// =============================================================================
// RestaurantOS: Operational AI Diagnostic Output Validation Schema
// =============================================================================

import { z } from 'zod';
import { AI_INSIGHT_TYPES, AI_URGENCY_LEVELS } from '../config/constants';

/**
 * Strict Zod runtime validation schema for operational AI diagnostic outputs.
 * Enforces zero-hallucination structured JSON formatting whether returned by live Gemini or deterministic local fallbacks.
 */
export const aiOperationalInsightSchema = z.object({
  insight_type: z.enum(AI_INSIGHT_TYPES),
  urgency_level: z.enum(AI_URGENCY_LEVELS),
  title: z.string().min(5).max(100),
  message: z.string().min(10).max(500),
  recommended_action: z.string().max(300).optional(),
  affected_entity_id: z.string().uuid().optional(),
});

export const aiInsightPayloadSchema = z.array(aiOperationalInsightSchema);
export type AiInsightPayload = z.infer<typeof aiInsightPayloadSchema>;
