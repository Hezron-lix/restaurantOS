// =============================================================================
// RestaurantOS: Cashier POS & Billing Settlement Validation Schemas
// =============================================================================

import { z } from 'zod';
import { PAYMENT_METHODS } from '../config/constants';

/**
 * Schema for generating table check subtotal and taxes.
 */
export const generateTableBillSchema = z.object({
  table_id: z.string().uuid({ message: 'Table UUID required for cashier checkout.' }),
});
export type GenerateTableBillInput = z.infer<typeof generateTableBillSchema>;

/**
 * Schema for Cashier finalizing a billing transaction in integer cents.
 */
export const processPaymentSchema = z.object({
  order_id: z.string().uuid({ message: 'Order UUID required for payment settlement.' }),
  payment_method: z.enum(PAYMENT_METHODS, {
    message: 'Invalid payment method selected.',
  }),
  amount_cents: z
    .number()
    .int()
    .min(0, { message: 'Payment amount in cents must be non-negative.' }),
  cashier_notes: z.string().max(200).optional(),
});
export type ProcessPaymentInput = z.infer<typeof processPaymentSchema>;
