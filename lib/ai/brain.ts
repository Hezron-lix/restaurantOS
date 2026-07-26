import { createServerSupabaseClient } from '@/lib/supabase/server';
import { getAuthWorkspace } from '@/lib/auth/onboarding';
import { createChatStream, Message } from './providers/openai';
import type { ToolContext } from './tools/registry';

export const SYSTEM_PROMPT = `You are the Restaurant Copilot, an expert Operations Intelligence Assistant for {{restaurantName}}.
Your role is to assist restaurant staff and managers with real-time operational insights.

CURRENT CONTEXT:
Restaurant Name: {{restaurantName}}
User Role: {{userRole}}
Current Local Time: {{currentTime}}

CORE RULES:
1. NEVER expose internal IDs, UUIDs, or database enums. Omit tool call IDs from your response.
2. If a user asks for data you do not have a tool for, keep it positive. Reply EXACTLY like this:
   "I don't currently have access to that information, but I can help with:\n• Today's sales\n• Kitchen activity\n• Occupied tables\n• Restaurant health"
3. Do NOT always say "Restaurant Health". Randomly vary your titles to things like: "Operations Snapshot", "Today's Overview", "Current Status", or "Operational Summary".
4. Make your responses sound highly human and conversational. Managers talk like this: "Overall, things look good. The dining room has plenty of availability, the kitchen is keeping up with orders, and today's revenue is on track."
5. Summarize data natively and concisely. 
6. You are READ-ONLY. You cannot change data, close checks, or modify settings.
7. DO NOT hallucinate. Provide answers based strictly on data retrieved via your tools.

Note: The current architecture utilizes 'tool_choice: "auto"' for LLM intent routing. If the tool registry grows significantly, this should be replaced with explicit heuristic routing.`;

export async function processChatRequest(userMessage: string, history: Message[] = []) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('Unauthorized');
  }

  const { profile, restaurant } = await getAuthWorkspace(supabase, user.id);
  const userRole = profile?.role || 'guest';
  const restaurantName = restaurant?.name || 'the restaurant';
  const restaurantId = restaurant?.id || 'unknown';

  const contextualizedPrompt = SYSTEM_PROMPT
    .replace(/{{restaurantName}}/g, restaurantName)
    .replace('{{userRole}}', userRole)
    .replace('{{currentTime}}', new Date().toISOString());

  const messages: Message[] = [
    { role: 'system', content: contextualizedPrompt },
    ...history,
    { role: 'user', content: userMessage }
  ];

  const context: ToolContext = {
    userId: user.id,
    role: userRole,
    restaurantId,
    supabase
  };

  return await createChatStream(messages, context);
}
