// =============================================================================
// RestaurantOS: Table Reservation & Conflict Detection Domain Service
// Reference: WORKFLOWS.md, DATABASE.md (Sprint 2 Reservation Logic)
// =============================================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, ReservationRecord, TableRecord } from '../types/database';
import type { CheckAvailabilityInput, CreateReservationInput, UpdateReservationStatusInput } from '../validations/reservations';
import { DomainError } from './menu';

/**
 * Pure business rule validator to evaluate reservation time window double-booking conflicts.
 * Dining window defaults to 90 minutes. A conflict occurs if an existing confirmed/seated booking
 * overlaps the target dining window on the same dining table.
 */
export function evaluateReservationTimeConflict(
  existingReservations: Pick<ReservationRecord, 'reservation_time' | 'status' | 'guest_name'>[],
  targetTimeIso: string,
  durationMinutes = 90
): { hasConflict: boolean; conflictingBooking?: string } {
  const targetStart = new Date(targetTimeIso).getTime();
  const targetEnd = targetStart + durationMinutes * 60 * 1000;

  for (const res of existingReservations) {
    // Only check active reservation states that block physical table seating
    if (res.status === 'CANCELLED') {
      continue;
    }

    const resStart = new Date(res.reservation_time).getTime();
    const resEnd = resStart + durationMinutes * 60 * 1000;

    // Strict overlapping interval test: (StartA < EndB) and (EndA > StartB)
    if (targetStart < resEnd && targetEnd > resStart) {
      return {
        hasConflict: true,
        conflictingBooking: `Existing reservation for [${res.guest_name}] scheduled at ${new Date(res.reservation_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      };
    }
  }

  return { hasConflict: false };
}

/**
 * Checks available tables that accommodate the requested guest party size and have zero time conflicts.
 */
export async function getAvailableTablesForReservation(
  supabase: SupabaseClient<Database>,
  input: CheckAvailabilityInput
): Promise<TableRecord[]> {
  // 1. Fetch all floor tables where capacity >= guest_count
  const { data: tables, error: tablesError } = await supabase
    .from('tables')
    .select('*')
    .gte('capacity', input.guest_count)
    .order('capacity', { ascending: true }); // Prefer smallest fitting table first

  if (tablesError || !tables) {
    throw new DomainError('INTERNAL_ERROR', `Failed to query table capacities: ${tablesError?.message}`);
  }

  if (tables.length === 0) {
    return []; // No physical tables large enough for this party
  }

  // 2. Fetch existing active reservations within a generous ± 4 hour bounding window of requested time
  const targetTime = new Date(input.requested_time).getTime();
  const lowerBound = new Date(targetTime - 4 * 3600 * 1000).toISOString();
  const upperBound = new Date(targetTime + 4 * 3600 * 1000).toISOString();

  const { data: existingBookings, error: bookingsError } = await supabase
    .from('reservations')
    .select('*')
    .gte('reservation_time', lowerBound)
    .lte('reservation_time', upperBound);

  if (bookingsError) {
    throw new DomainError('INTERNAL_ERROR', `Failed to query existing reservations: ${bookingsError.message}`);
  }

  const activeBookings = (existingBookings ?? []) as ReservationRecord[];

  // 3. Filter tables against time conflict business rule
  const availableTables: TableRecord[] = [];
  const typedTables = tables as TableRecord[];

  for (const table of typedTables) {
    const tableBookings = activeBookings.filter((b) => b.table_id === table.id);
    const conflictCheck = evaluateReservationTimeConflict(tableBookings, input.requested_time, input.duration_minutes);

    if (!conflictCheck.hasConflict) {
      availableTables.push(table);
    }
  }

  return availableTables;
}

/**
 * Creates a new dining reservation with rigorous double-booking conflict prevention.
 */
export async function createReservation(
  supabase: SupabaseClient<Database>,
  input: CreateReservationInput
): Promise<ReservationRecord> {
  const duration = input.duration_minutes;

  let assignedTableId: string | null = input.table_id ?? null;

  if (assignedTableId) {
    // Verify specific requested table capacity and availability
    const { data: table, error } = await supabase
      .from('tables')
      .select('*')
      .eq('id', assignedTableId)
      .single();

    if (error || !table) {
      throw new DomainError('NOT_FOUND', 'Requested dining table does not exist.');
    }

    if ((table as TableRecord).capacity < input.guest_count) {
      throw new DomainError(
        'VALIDATION_ERROR',
        `Table ${(table as TableRecord).table_number} has capacity of ${(table as TableRecord).capacity}, which is insufficient for a party of ${input.guest_count}.`
      );
    }

    // Check double-booking conflicts exclusively on this table
    const targetTime = new Date(input.reservation_time).getTime();
    const { data: existing } = await supabase
      .from('reservations')
      .select('*')
      .eq('table_id', assignedTableId)
      .gte('reservation_time', new Date(targetTime - 4 * 3600 * 1000).toISOString())
      .lte('reservation_time', new Date(targetTime + 4 * 3600 * 1000).toISOString());

    const conflict = evaluateReservationTimeConflict((existing ?? []) as ReservationRecord[], input.reservation_time, duration);
    if (conflict.hasConflict) {
      throw new DomainError(
        'STATE_CONFLICT',
        `Double-booking conflict detected on Table ${(table as TableRecord).table_number}: ${conflict.conflictingBooking}. Please select another time or table.`
      );
    }
  } else {
    // Auto-assign the most optimal available dining table without double booking
    const availableTables = await getAvailableTablesForReservation(supabase, {
      guest_count: input.guest_count,
      requested_time: input.reservation_time,
      duration_minutes: duration,
    });

    if (availableTables.length > 0) {
      assignedTableId = availableTables[0].id; // Assign smallest adequate table
    }
    // Note: If all physical tables are booked, assignedTableId remains null (Queue waitlist reservation)
  }

  const { data, error } = await supabase
    .from('reservations')
    .insert({
      table_id: assignedTableId,
      guest_name: input.guest_name.trim(),
      phone: input.phone.trim(),
      guest_count: input.guest_count,
      reservation_time: input.reservation_time,
      status: assignedTableId ? 'CONFIRMED' : 'PENDING',
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new DomainError('INTERNAL_ERROR', `Failed to record reservation: ${error?.message || 'Database insert error'}`);
  }

  return data as ReservationRecord;
}

/**
 * Updates reservation state (e.g. Host seating guests or marking guest check-in/no-show).
 */
export async function updateReservationStatus(
  supabase: SupabaseClient<Database>,
  input: UpdateReservationStatusInput
): Promise<ReservationRecord> {
  const { data, error } = await supabase
    .from('reservations')
    .update({ status: input.status })
    .eq('id', input.reservation_id)
    .select('*')
    .single();

  if (error || !data) {
    throw new DomainError('NOT_FOUND', `Reservation status update failed: ${error?.message}`);
  }

  return data as ReservationRecord;
}
