'use server';

// =============================================================================
// RestaurantOS: Table Reservation & Double-Booking Prevention Server Actions
// Reference: WORKFLOWS.md, API.md (Sprint 2 Reservation Logic)
// =============================================================================

import { createServerSupabaseClient } from '../lib/supabase/server';
import type { ActionResponse, ReservationRecord, TableRecord } from '../types/database';
import { handleActionError, actionSuccess } from './utils';
import * as reservationService from '../services/reservations';
import {
  checkAvailabilitySchema,
  createReservationSchema,
  updateReservationStatusSchema,
  type CheckAvailabilityInput,
  type CreateReservationInput,
  type UpdateReservationStatusInput,
} from '../validations/reservations';
import { enforceOperationalRoleGuard } from '../services/auth';

/**
 * Server Action: Checks table availability for a specific party size and time without double bookings.
 */
export async function checkTableAvailabilityAction(rawInput: CheckAvailabilityInput): Promise<ActionResponse<TableRecord[]>> {
  try {
    const input = checkAvailabilitySchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();
    
    const availableTables = await reservationService.getAvailableTablesForReservation(supabase, input);
    return actionSuccess(availableTables);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Submits a new dining reservation with strict double-booking conflict detection.
 */
export async function createReservationAction(rawInput: CreateReservationInput): Promise<ActionResponse<ReservationRecord>> {
  try {
    const input = createReservationSchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();

    const newReservation = await reservationService.createReservation(supabase, input);
    return actionSuccess(newReservation);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Host or Manager updates reservation state (CONFIRMED, SEATED, NO_SHOW, CANCELLED).
 */
export async function updateReservationStatusAction(rawInput: UpdateReservationStatusInput): Promise<ActionResponse<ReservationRecord>> {
  try {
    const input = updateReservationStatusSchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();

    // Guard: hosts (waiters) and managers
    const authErr = await enforceOperationalRoleGuard(['waiter', 'manager']);
    if (authErr) return authErr;

    const updatedReservation = await reservationService.updateReservationStatus(supabase, input);
    return actionSuccess(updatedReservation);
  } catch (error) {
    return handleActionError(error);
  }
}
