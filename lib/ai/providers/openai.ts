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

export function createChatStream(messages: Message[], context: ToolContext, recursionDepth = 0) {
  // Graceful API Key Error
  if (!process.env.OPENROUTER_API_KEY) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: "OpenRouter API Key is missing. Please add OPENROUTER_API_KEY to your .env.local file to use the AI assistant." })}\n\n`));
        controller.close();
      }
    });
  }

  // Infinite Recursion Failsafe: Prevent catastrophic LLM hallucination loops
  if (recursionDepth > 3) {
    return new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ text: "\n\n(I apologize, but the operation became too complex and was automatically safely aborted.)" })}\n\n`));
        controller.close();
      }
    });
  }

  const streamStartTime = performance.now();

  return new ReadableStream({
    async start(controller) {
      const MODELS = [
        'openai/gpt-oss-20b:free',
        'google/gemma-4-31b-it:free',
        'google/gemma-4-26b-a4b-it:free'
      ];

      let response: any;
      let lastError: any;
      const openRouterReqStart = performance.now();

      for (let i = 0; i < MODELS.length; i++) {
        const model = MODELS[i];
        try {
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
          console.error(`[OpenRouter Request Error] Model ${model} failed with status:`, status);
          if (status === 400 || status === 401 || status === 403) {
            break; 
          }
        }
      }

      if (!response) {
        console.error('All fallback models failed or fatal error:', lastError);
        const status = lastError?.status || lastError?.response?.status;
        const errMsg = lastError?.message || lastError?.error?.message || (typeof lastError === 'string' ? lastError : JSON.stringify(lastError || {}));
        
        const isRateLimit = status === 429 || 
                            errMsg.includes('429') || 
                            errMsg.includes('free-models-per-day') || 
                            errMsg.toLowerCase().includes('rate limit') ||
                            errMsg.toLowerCase().includes('rate_limit');

        const userFriendlyError = isRateLimit 
          ? "Restaurant Copilot is temporarily unavailable. Please try again later." 
          : "LLM Provider is currently unavailable or returned an error. Please try again.";

        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: userFriendlyError })}\n\n`));
        controller.close();
        return;
      }

      let toolCallBuffer: any = null;
      let assistantContentBuffer = '';
      let firstTokenReceived = false;

      try {
        for await (const chunk of response) {
          if (!firstTokenReceived) {
            firstTokenReceived = true;
          }

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

            const nestedStream = createChatStream(nextMessages, context, recursionDepth + 1);
            const reader = nestedStream.getReader();
            
            while (true) {
              const { done, value } = await reader.read();
              if (done) break;
              controller.enqueue(value);
            }
            break; // Stop processing chunks for this tool call event to prevent duplicate logic
          }
        }
      } catch (err: any) {
        console.error('OpenAI Error:', err);
        const status = err?.status || err?.response?.status;
        const errMsg = err?.message || err?.error?.message || (typeof err === 'string' ? err : JSON.stringify(err || {}));
        
        const isRateLimit = status === 429 || 
                            errMsg.includes('429') || 
                            errMsg.includes('free-models-per-day') || 
                            errMsg.toLowerCase().includes('rate limit') ||
                            errMsg.toLowerCase().includes('rate_limit');

        const userFriendlyError = isRateLimit 
          ? "Restaurant Copilot is temporarily unavailable. Please try again later." 
          : "LLM Provider Error. Please try again.";

        controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify({ error: userFriendlyError })}\n\n`));
      } finally {
        controller.close();
      }
    }
  });
}
