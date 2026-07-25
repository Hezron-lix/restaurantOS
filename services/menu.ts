// =============================================================================
// RestaurantOS: Menu Catalog & Kitchen Pricing Domain Service
// Reference: WORKFLOWS.md, DATABASE.md (Sprint 2 Menu Logic)
// =============================================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database, MenuCategoryRecord, MenuItemRecord } from '../types/database';
import type { CreateCategoryInput, CreateMenuItemInput, UpdateMenuItemInput, ToggleMenuAvailabilityInput } from '../validations/menu';

/**
 * Custom Domain Error for application level exceptions
 */
export class DomainError extends Error {
  constructor(
    public code: 'VALIDATION_ERROR' | 'AUTHENTICATION_ERROR' | 'AUTHORIZATION_ERROR' | 'NOT_FOUND' | 'STATE_CONFLICT' | 'INTERNAL_ERROR',
    message: string,
    public fieldErrors?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'DomainError';
  }
}

/**
 * Fetches all active dining menu categories sorted by display order.
 */
export async function getMenuCategories(supabase: SupabaseClient<Database>): Promise<MenuCategoryRecord[]> {
  const { data, error } = await supabase
    .from('menu_categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    throw new DomainError('INTERNAL_ERROR', `Failed to query menu categories: ${error.message}`);
  }

  return (data ?? []) as MenuCategoryRecord[];
}

/**
 * Fetches the complete menu catalog containing categories and available menu dishes.
 */
export async function getMenuCatalog(
  supabase: SupabaseClient<Database>,
  includeUnavailable = false
): Promise<{ category: MenuCategoryRecord; items: MenuItemRecord[] }[]> {
  const categories = await getMenuCategories(supabase);

  let itemsQuery = supabase.from('menu_items').select('*');
  if (!includeUnavailable) {
    itemsQuery = itemsQuery.eq('is_available', true);
  }
  const { data: items, error: itemsError } = await itemsQuery;

  if (itemsError) {
    throw new DomainError('INTERNAL_ERROR', `Failed to query menu items: ${itemsError.message}`);
  }

  const typedItems = (items ?? []) as MenuItemRecord[];

  return categories.map((cat) => ({
    category: cat,
    items: typedItems.filter((item) => item.category_id === cat.id),
  }));
}

/**
 * Creates a new dining menu category (Manager strictly protected).
 */
export async function createCategory(
  supabase: SupabaseClient<Database>,
  input: CreateCategoryInput
): Promise<MenuCategoryRecord> {
  const { data, error } = await supabase
    .from('menu_categories')
    .insert({
      name: input.name,
      description: input.description ?? null,
      display_order: input.display_order,
      is_active: input.is_active,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new DomainError('INTERNAL_ERROR', `Failed to create category: ${error?.message || 'No record returned'}`);
  }

  return data as MenuCategoryRecord;
}

/**
 * Creates a new artisan menu dish in Integer Cents pricing format.
 */
export async function createMenuItem(
  supabase: SupabaseClient<Database>,
  input: CreateMenuItemInput
): Promise<MenuItemRecord> {
  // Verify category exists
  const { data: category } = await supabase
    .from('menu_categories')
    .select('id')
    .eq('id', input.category_id)
    .single();

  if (!category) {
    throw new DomainError('NOT_FOUND', 'Referenced menu category does not exist.');
  }

  const { data, error } = await supabase
    .from('menu_items')
    .insert({
      category_id: input.category_id,
      name: input.name,
      description: input.description ?? null,
      price_cents: input.price_cents,
      prep_time_minutes: input.prep_time_minutes,
      image_url: input.image_url ?? null,
      is_available: input.is_available,
    })
    .select('*')
    .single();

  if (error || !data) {
    throw new DomainError('INTERNAL_ERROR', `Failed to create menu dish: ${error?.message || 'Unknown DB error'}`);
  }

  return data as MenuItemRecord;
}

/**
 * Updates properties of an existing menu dish.
 */
export async function updateMenuItem(
  supabase: SupabaseClient<Database>,
  input: UpdateMenuItemInput
): Promise<MenuItemRecord> {
  const { id, ...updateFields } = input;

  const { data, error } = await supabase
    .from('menu_items')
    .update(updateFields)
    .eq('id', id)
    .select('*')
    .single();

  if (error || !data) {
    throw new DomainError('NOT_FOUND', `Menu item update failed or item not found: ${error?.message}`);
  }

  return data as MenuItemRecord;
}

/**
 * Quick toggle for Kitchen Chef or Manager to mark dish stock as available or sold out.
 */
export async function toggleMenuAvailability(
  supabase: SupabaseClient<Database>,
  input: ToggleMenuAvailabilityInput
): Promise<MenuItemRecord> {
  const { data, error } = await supabase
    .from('menu_items')
    .update({ is_available: input.is_available })
    .eq('id', input.menu_item_id)
    .select('*')
    .single();

  if (error || !data) {
    throw new DomainError('NOT_FOUND', `Failed to toggle menu item availability: ${error?.message}`);
  }

  return data as MenuItemRecord;
}
