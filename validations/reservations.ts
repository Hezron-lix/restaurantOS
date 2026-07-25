// =============================================================================
// RestaurantOS: Table Reservation & Conflict Detection Validation Schemas
// Reference: WORKFLOWS.md, DATABASE.md (Sprint 2 Reservation Logic)
// =============================================================================

import { z } from 'zod';
import { RESERVATION_STATUSES } from '../config/constants';

export const checkAvailabilitySchema = z.object({
  guest_count: z.number().int().min(1, { message: 'Guest count must be at least 1.' }).max(30, { message: 'Parties larger than 30 require private banquet coordination.' }),
  requested_time: z.string().datetime({ message: 'Valid ISO-8601 timestamp required for dining availability search.' }),
  duration_minutes: z.number().int().min(30).max(240).default(90),
});
export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;

export const createReservationSchema = z.object({
  table_id: z.string().uuid().optional().nullable(),
  guest_name: z.string().min(2, { message: 'Guest full name must be at least 2 characters.' }).max(100),
  phone: z.string().min(7, { message: 'Valid contact phone number required.' }).max(25),
  guest_count: z.number().int().min(1).max(30),
  reservation_time: z.string().datetime({ message: 'Valid ISO-8601 datetime timestamp required.' }),
  duration_minutes: z.number().int().min(30).max(240).default(90),
});
export type CreateReservationInput = z.infer<typeof createReservationSchema>;

export const updateReservationStatusSchema = z.object({
  reservation_id: z.string().uuid({ message: 'Reservation UUID required.' }),
  status: z.enum(RESERVATION_STATUSES, {
    message: 'Invalid reservation status.',
  }),
});
export type UpdateReservationStatusInput = z.infer<typeof updateReservationStatusSchema>;
