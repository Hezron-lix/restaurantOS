// =============================================================================
// RestaurantOS: Table Floor & QR Session Validation Schemas
// Reference: WORKFLOWS.md, DATABASE.md (Sprint 2 Table Logic)
// =============================================================================

import { z } from 'zod';
import { TABLE_STATUSES } from '../config/constants';

export const generateTableSessionSchema = z.object({
  table_id: z.string().uuid({ message: 'Table UUID required to initialize dining session.' }),
});
export type GenerateTableSessionInput = z.infer<typeof generateTableSessionSchema>;

export const validateQrSessionSchema = z.object({
  table_id: z.string().uuid({ message: 'Table UUID required.' }),
  token: z.string().min(10, { message: 'Valid cryptographically secure QR token required.' }),
});
export type ValidateQrSessionInput = z.infer<typeof validateQrSessionSchema>;

export const updateTableStatusSchema = z.object({
  table_id: z.string().uuid({ message: 'Table UUID required for status transition.' }),
  status: z.enum(TABLE_STATUSES, {
    message: 'Invalid table floor status selected.',
  }),
  token: z.string().optional().nullable(),
});
export type UpdateTableStatusInput = z.infer<typeof updateTableStatusSchema>;
