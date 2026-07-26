import OpenAI from 'openai';
import { toolRegistry } from '../tools/registry';
import type { ToolContext } from '../tools/registry';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || 'MISSING_KEY',
  baseURL: 'https://openrouter.ai/api/v1',
  defaultHeaders: {
    "HTTP-Referer": "https://restaurantos.demo",
    "X-Title": "RestaurantOS",
  }
});

function getOpenAITools() {
  return Object.values(toolRegistry).map(tool => ({
    type: 'function' as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    }
  }));
}

export type Message = {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content?: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: any[];
};

export function createChatStream(messages: Message[], context: ToolContext) {
  // Graceful API Key Error
  if (!process.env.OPENROUTER_API_KEY) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: "OpenRouter API Key is missing. Please add OPENROUTER_API_KEY to your .env.local file to use the AI assistant." })}\n\n`));
        controller.close();
      }
    });
  }

  return new ReadableStream({
    async start(controller) {
      const MODELS = [
        'openai/gpt-oss-20b:free',
        'google/gemma-4-31b-it:free',
        'google/gemma-4-26b-a4b-it:free'
      ];

      let response: any;
      let lastError: any;

      for (let i = 0; i < MODELS.length; i++) {
        const model = MODELS[i];
        try {
          if (i === 0) {
            console.log(`Using model:\n${model}`);
          } else {
            console.log(`Primary model unavailable.\nFalling back to:\n${model}`);
          }

          response = await openai.chat.completions.create({
            model: model,
            messages: messages as any[],
            temperature: 0.1,
            tools: getOpenAITools(),
            tool_choice: 'auto',
            stream: true,
          });

          break; // Success, exit loop
        } catch (error: any) {
          lastError = error;
          const status = error.status || error.response?.status;
          
          if (status === 400 || status === 401 || status === 403) {
            break; 
          }
        }
      }

      if (!response) {
        console.error('All fallback models failed or fatal error:', lastError);
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: "LLM Provider is currently unavailable or returned an error. Please try again." })}\n\n`));
        controller.close();
        return;
      }

      let toolCallBuffer: any = null;
      let assistantContentBuffer = '';

      try {
        for await (const chunk of response) {
          const delta = chunk.choices[0]?.delta;

          if (delta?.tool_calls) {
            const tc = delta.tool_calls[0];
            if (tc.id) {
              toolCallBuffer = {
                id: tc.id,
                type: 'function',
                function: { name: tc.function?.name || '', arguments: tc.function?.arguments || '' }
              };
            } else if (tc.function?.arguments) {
              toolCallBuffer.function.arguments += tc.function.arguments;
            }
          }

          if (delta?.content) {
            assistantContentBuffer += delta.content;
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text: delta.content })}\n\n`));
          }

          if (chunk.choices[0]?.finish_reason === 'tool_calls' && toolCallBuffer) {
            controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ status: 'fetching_data', tool: toolCallBuffer.function.name })}\n\n`));
            
            let args = {};
            try { args = JSON.parse(toolCallBuffer.function.arguments); } catch(e) {}
            
            const tool = toolRegistry[toolCallBuffer.function.name];
            let toolResult = { error: 'Tool not found' };
            if (tool) {
              try {
                toolResult = await tool.execute(context, args);
              } catch (e: any) {
                toolResult = { error: e.message || 'Database execution failed. The data might be empty.' };
              }
            }

            const nextMessages = [
              ...messages,
              {
                role: 'assistant',
                content: assistantContentBuffer || null,
                tool_calls: [toolCallBuffer]
              } as Message,
              {
                role: 'tool',
                tool_call_id: toolCallBuffer.id,
                name: toolCallBuffer.function.name,
                content: JSON.stringify(toolResult)
              } as Message
            ];

            const nestedStream = createChatStream(nextMessages, context);
            const reader = nestedStream.getReader();
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
            break; // Stop processing chunks for this tool call event to prevent duplicate logic
          }
        }
      } catch (err) {
        console.error('OpenAI Error:', err);
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: 'LLM Provider Error. Please try again.' })}\n\n`));
      } finally {
        controller.close();
      }
    }
  });
}
