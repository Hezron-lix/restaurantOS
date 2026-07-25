// =============================================================================
// RestaurantOS: Kitchen Display System (KDS) Validation Schemas
// =============================================================================

import { z } from 'zod';
import { ORDER_ITEM_STATUSES } from '../config/constants';

/**
 * Schema for Chef updating an individual dish preparation state in KDS.
 */
export const updateOrderItemStatusSchema = z.object({
  order_item_id: z.string().uuid({ message: 'Valid Order Item UUID required.' }),
  status: z.enum(ORDER_ITEM_STATUSES, {
    message: 'Invalid KDS cooking item state transition.',
  }),
});
export type UpdateOrderItemStatusInput = z.infer<typeof updateOrderItemStatusSchema>;

/**
 * Schema for Chef toggling dish stock availability to block customer menu ordering.
 */
export const toggleMenuItemStockSchema = z.object({
  menu_item_id: z.string().uuid(),
  is_available: z.boolean(),
});
export type ToggleMenuItemStockInput = z.infer<typeof toggleMenuItemStockSchema>;

/**
 * Schema for manual inventory replenishment or adjustment.
 */
export const updateInventoryStockSchema = z.object({
  inventory_id: z.string().uuid(),
  new_stock_units: z.number().int().min(0, { message: 'Stock quantity cannot be negative.' }),
});
export type UpdateInventoryStockInput = z.infer<typeof updateInventoryStockSchema>;
