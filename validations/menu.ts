// =============================================================================
// RestaurantOS: Menu Catalog & Pricing Validation Schemas
// Reference: DATABASE.md, API.md (Sprint 2 Menu Logic)
// =============================================================================

import { z } from 'zod';

export const createCategorySchema = z.object({
  name: z.string().min(2, { message: 'Category name must be at least 2 characters.' }).max(60),
  description: z.string().max(300).optional().nullable(),
  display_order: z.number().int().min(1, { message: 'Display order must be a positive integer.' }),
  is_active: z.boolean().default(true),
});
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const createMenuItemSchema = z.object({
  category_id: z.string().uuid({ message: 'Valid category UUID required.' }),
  name: z.string().min(2, { message: 'Dish name must be at least 2 characters.' }).max(100),
  description: z.string().max(500).optional().nullable(),
  price_cents: z.number().int().positive({ message: 'Price must be a strictly positive integer in cents.' }),
  prep_time_minutes: z.number().int().min(1, { message: 'Preparation time must be at least 1 minute.' }).max(180),
  image_url: z.string().url().optional().nullable(),
  is_available: z.boolean().default(true),
});
export type CreateMenuItemInput = z.infer<typeof createMenuItemSchema>;

export const updateMenuItemSchema = createMenuItemSchema.partial().extend({
  id: z.string().uuid({ message: 'Menu Item UUID required for updating.' }),
});
export type UpdateMenuItemInput = z.infer<typeof updateMenuItemSchema>;

export const toggleMenuAvailabilitySchema = z.object({
  menu_item_id: z.string().uuid({ message: 'Menu Item UUID required.' }),
  is_available: z.boolean(),
});
export type ToggleMenuAvailabilityInput = z.infer<typeof toggleMenuAvailabilitySchema>;
