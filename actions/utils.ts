// =============================================================================
// RestaurantOS: Server Action Utilities & Error Transformation Engine
// Reference: API.md (Standard ActionResponse Envelope & Validation Governance)
// =============================================================================

import { z } from 'zod';
import type { ActionResponse, ActionError } from '../types/database';
import { DomainError } from '../services/menu';

/**
 * Transforms any runtime exception, Zod validation fault, or domain logic error
 * into an explicit, immutable ActionResponse error envelope.
 */
export function handleActionError(error: unknown): ActionResponse<never> {
  // 1. Zod Runtime Input Validation Errors
  if (error instanceof z.ZodError) {
    const fieldErrors: Record<string, string[]> = {};
    const formatted = error.flatten().fieldErrors as Record<string, string[] | undefined>;
    for (const [key, val] of Object.entries(formatted)) {
      if (val && Array.isArray(val)) {
        fieldErrors[key] = val;
      }
    }
    const firstErrorMessage = Object.values(fieldErrors)[0]?.[0] || 'Invalid input parameter payload provided.';

    const actionError: ActionError = {
      code: 'VALIDATION_ERROR',
      message: `Validation Error: ${firstErrorMessage}`,
      fieldErrors,
    };
    return { success: false, error: actionError, timestamp: new Date().toISOString() };
  }

  // 2. Pure Business Logic & Domain Errors (State conflicts, double bookings, token invalid)
  if (error instanceof DomainError) {
    return {
      success: false,
      error: {
        code: error.code,
        message: error.message,
        fieldErrors: error.fieldErrors,
      },
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Unhandled Postgres or General System Exceptions
  const errorMessage = error instanceof Error ? error.message : 'An unexpected backend operational error occurred.';
  return {
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: errorMessage,
    },
    timestamp: new Date().toISOString(),
  };
}

/**
 * Wraps successful return payloads into explicit ActionResponse success envelopes.
 */
export function actionSuccess<T>(data: T): ActionResponse<T> {
  return { success: true, data, timestamp: new Date().toISOString() };
}
