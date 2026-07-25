// =============================================================================
// RestaurantOS: Table Ordering & Reservation Validation Schemas
// =============================================================================

import { z } from 'zod';

/**
 * Individual item payload inside an order submission.
 */
export const createOrderItemSchema = z.object({
  menu_item_id: z.string().uuid({ message: 'Menu item UUID is required.' }),
  quantity: z
    .number()
    .int()
    .min(1, { message: 'Quantity must be at least 1.' })
    .max(50, { message: 'Maximum quantity per line item is 50.' }),
  notes: z.string().max(300, { message: 'Customization notes cannot exceed 300 characters.' }).optional(),
});
export type CreateOrderItemInput = z.infer<typeof createOrderItemSchema>;

/**
 * Complete order placement transaction payload.
 */
export const createOrderSchema = z.object({
  table_id: z.string().uuid({ message: 'Table UUID is required.' }),
  session_token: z.string().min(1, { message: 'Active table QR session token is required.' }),
  items: z
    .array(createOrderItemSchema)
    .min(1, { message: 'Order must contain at least one menu item.' }),
  special_instructions: z
    .string()
    .max(500, { message: 'Special dining instructions cannot exceed 500 characters.' })
    .optional(),
});
export type CreateOrderInput = z.infer<typeof createOrderSchema>;

/**
 * Schema for seated guest calling waiter assistance.
 */
export const requestWaiterAssistanceSchema = z.object({
  table_id: z.string().uuid(),
  reason: z
    .string()
    .min(3, { message: 'Reason must be provided (e.g., Water refill, Napkins, Bill).' })
    .max(100),
});
export type RequestWaiterAssistanceInput = z.infer<typeof requestWaiterAssistanceSchema>;


