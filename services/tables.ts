// =============================================================================
// RestaurantOS: Table Floor & QR Session Domain Service
// Reference: WORKFLOWS.md, DATABASE.md (Sprint 2 Table Logic & Session Tokens)
// =============================================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, TableRecord, TableStatus } from '../types/database';
import { VALID_TABLE_TRANSITIONS } from '../config/constants';
import { DomainError } from './menu';

/**
 * Generates a cryptographically sound, collision-resistant QR session token for a dining table.
 */
export function generateTableSessionToken(tableNumber: number | string): string {
  const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
  const timestamp = Date.now().toString(36);
  return `table_${tableNumber}_sess_${timestamp}_${randomHex}`;
}

/**
 * Pure business rule validator to verify table finite state machine transitions.
 * Prevents illegal state jumps (e.g., SEATED -> AVAILABLE without billing/cleaning).
 */
export function evaluateTableStateTransition(currentStatus: TableStatus, targetStatus: TableStatus): void {
  if (currentStatus === targetStatus) {
    return; // Idempotent same-state transition is permitted
  }

  const allowedNextStates = VALID_TABLE_TRANSITIONS[currentStatus] || [];
  if (!allowedNextStates.includes(targetStatus)) {
    throw new DomainError(
      'STATE_CONFLICT',
      `Illegal table operational transition: Cannot transition from [${currentStatus}] directly to [${targetStatus}]. Permitted transitions: ${allowedNextStates.join(', ')}.`
    );
  }
}

/**
 * Queries all dining floor tables sorted by table number.
 */
export async function getFloorTables(supabase: SupabaseClient<Database>): Promise<TableRecord[]> {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .order('table_number', { ascending: true });

  if (error) {
    throw new DomainError('INTERNAL_ERROR', `Failed to fetch floor tables: ${error.message}`);
  }

  return (data ?? []) as TableRecord[];
}

/**
 * Retrieves a single table by UUID.
 */
export async function getTableById(supabase: SupabaseClient<Database>, tableId: string): Promise<TableRecord> {
  const { data, error } = await supabase
    .from('tables')
    .select('*')
    .eq('id', tableId)
    .single();

  if (error || !data) {
    throw new DomainError('NOT_FOUND', `Table with UUID ${tableId} not found.`);
  }

  return data as TableRecord;
}

/**
 * Generates a fresh QR session token for a dining table and assigns it in PostgreSQL.
 * Typically invoked by Host or Waiter upon seating guests.
 */
export async function activateTableQrSession(
  supabase: SupabaseClient<Database>,
  tableId: string
): Promise<{ table: TableRecord; sessionToken: string }> {
  const table = await getTableById(supabase, tableId);
  const sessionToken = generateTableSessionToken(table.table_number);

  // When session is activated, transition status to SEATED if currently AVAILABLE
  const nextStatus: TableStatus = table.status === 'AVAILABLE' ? 'SEATED' : table.status;
  evaluateTableStateTransition(table.status, nextStatus);

  const { data, error } = await supabase
    .from('tables')
    .update({
      current_qr_token: sessionToken,
      status: nextStatus,
    })
    .eq('id', tableId)
    .select('*')
    .single();

  if (error || !data) {
    throw new DomainError('INTERNAL_ERROR', `Failed to activate table QR session token: ${error?.message}`);
  }

  return { table: data as TableRecord, sessionToken };
}

/**
 * Validates a submitted QR session token against the currently active table session.
 * Prevents unauthorized or expired QR codes from submitting dining orders.
 */
export async function validateTableQrSession(
  supabase: SupabaseClient<Database>,
  tableId: string,
  token: string
): Promise<TableRecord> {
  const table = await getTableById(supabase, tableId);

  if (!table.current_qr_token) {
    throw new DomainError(
      'AUTHORIZATION_ERROR',
      'This table does not currently have an active dining session. Please request a waiter to activate your QR code.'
    );
  }

  if (table.current_qr_token !== token.trim()) {
    throw new DomainError(
      'AUTHORIZATION_ERROR',
      'Invalid or expired table session token. Please scan the current physical QR code on your table.'
    );
  }

  return table;
}

/**
 * Updates table occupancy floor status enforcing strict FSM rules and optional session invalidation.
 */
export async function updateTableOccupancyStatus(
  supabase: SupabaseClient<Database>,
  tableId: string,
  targetStatus: TableStatus,
  isManagerOverride = false
): Promise<TableRecord> {
  const table = await getTableById(supabase, tableId);

  if (!isManagerOverride) {
    evaluateTableStateTransition(table.status, targetStatus);
  }

  // If transitioning back to AVAILABLE or DIRTY, terminate active QR dining token
  const nextToken = targetStatus === 'AVAILABLE' || targetStatus === 'DIRTY' ? null : table.current_qr_token;

  const { data, error } = await supabase
    .from('tables')
    .update({
      status: targetStatus,
      current_qr_token: nextToken,
    })
    .eq('id', tableId)
    .select('*')
    .single();

  if (error || !data) {
    throw new DomainError('INTERNAL_ERROR', `Failed to update table floor status: ${error?.message}`);
  }

  return data as TableRecord;
}
