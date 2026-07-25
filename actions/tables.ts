'use server';

// =============================================================================
// RestaurantOS: Table Floor Management & QR Session Server Actions
// Reference: WORKFLOWS.md, API.md (Sprint 2 Table Logic & Token Governance)
// =============================================================================

import { createServerSupabaseClient } from '../lib/supabase/server';
import type { ActionResponse, TableRecord } from '../types/database';
import { handleActionError, actionSuccess } from './utils';
import * as tableService from '../services/tables';
import {
  generateTableSessionSchema,
  validateQrSessionSchema,
  updateTableStatusSchema,
  type GenerateTableSessionInput,
  type ValidateQrSessionInput,
  type UpdateTableStatusInput,
} from '../validations/tables';
import { enforceOperationalRoleGuard, getCurrentUserProfile } from '../services/auth';

/**
 * Server Action: Retrieves all dining floor tables and their occupancy state.
 */
export async function fetchFloorTablesAction(): Promise<ActionResponse<TableRecord[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const tables = await tableService.getFloorTables(supabase);
    return actionSuccess(tables);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Generates and activates a secure QR session dining token for a seated table.
 * Invoked by Waiter or Manager upon guest seating.
 */
export async function generateTableSessionAction(rawInput: GenerateTableSessionInput): Promise<ActionResponse<{ table: TableRecord; sessionToken: string }>> {
  try {
    const input = generateTableSessionSchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();

    // Guard: only operational staff manage active floor seating tokens
    const authErr = await enforceOperationalRoleGuard(['waiter', 'cashier', 'manager']);
    if (authErr) return authErr;

    const sessionData = await tableService.activateTableQrSession(supabase, input.table_id);
    return actionSuccess(sessionData);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Validates a guest's scanned QR token against active table session in DB.
 */
export async function validateTableQrSessionAction(rawInput: ValidateQrSessionInput): Promise<ActionResponse<TableRecord>> {
  try {
    const input = validateQrSessionSchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();

    const validatedTable = await tableService.validateTableQrSession(supabase, input.table_id, input.token);
    return actionSuccess(validatedTable);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Updates dining table occupancy floor status (e.g. SEATED -> DIRTY).
 */
export async function updateTableStatusAction(rawInput: UpdateTableStatusInput): Promise<ActionResponse<TableRecord>> {
  try {
    const input = updateTableStatusSchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();

    // Enforce role guard: waiters, cashiers, managers
    const authErr = await enforceOperationalRoleGuard(['waiter', 'cashier', 'manager']);
    if (authErr) return authErr;

    const { role } = await getCurrentUserProfile();
    const isManager = role === 'manager';

    const updatedTable = await tableService.updateTableOccupancyStatus(supabase, input.table_id, input.status, isManager);
    return actionSuccess(updatedTable);
  } catch (error) {
    return handleActionError(error);
  }
}
