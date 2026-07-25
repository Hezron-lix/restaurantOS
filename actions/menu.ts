'use server';

// =============================================================================
// RestaurantOS: Menu & Dining Catalog Server Actions
// Reference: API.md, DATABASE.md (Sprint 2 Menu Server Actions)
// =============================================================================

import { createServerSupabaseClient } from '../lib/supabase/server';
import type { ActionResponse, MenuCategoryRecord, MenuItemRecord } from '../types/database';
import { handleActionError, actionSuccess } from './utils';
import * as menuService from '../services/menu';
import {
  createCategorySchema,
  createMenuItemSchema,
  updateMenuItemSchema,
  toggleMenuAvailabilitySchema,
  type CreateCategoryInput,
  type CreateMenuItemInput,
  type UpdateMenuItemInput,
  type ToggleMenuAvailabilityInput,
} from '../validations/menu';
import { enforceOperationalRoleGuard } from '../services/auth';

/**
 * Server Action: Queries active menu dining categories sorted by display order.
 */
export async function fetchMenuCategoriesAction(): Promise<ActionResponse<MenuCategoryRecord[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const categories = await menuService.getMenuCategories(supabase);
    return actionSuccess(categories);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Retrieves complete menu dining catalog with category grouping.
 */
export async function fetchMenuCatalogAction(includeUnavailable = false): Promise<ActionResponse<{ category: MenuCategoryRecord; items: MenuItemRecord[] }[]>> {
  try {
    const supabase = await createServerSupabaseClient();
    const catalog = await menuService.getMenuCatalog(supabase, includeUnavailable);
    return actionSuccess(catalog);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Manager creates a new dining category.
 */
export async function createMenuCategoryAction(rawInput: CreateCategoryInput): Promise<ActionResponse<MenuCategoryRecord>> {
  try {
    const input = createCategorySchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();
    
    // Ensure only manager can execute this category alteration
    const authErr = await enforceOperationalRoleGuard(['manager']);
    if (authErr) return authErr;
    
    const newCategory = await menuService.createCategory(supabase, input);
    return actionSuccess(newCategory);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Kitchen Head Chef or Manager registers a new dish on the menu.
 */
export async function createMenuItemAction(rawInput: CreateMenuItemInput): Promise<ActionResponse<MenuItemRecord>> {
  try {
    const input = createMenuItemSchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();

    // Guard: strictly kitchen staff and manager
    const authErr = await enforceOperationalRoleGuard(['kitchen', 'manager']);
    if (authErr) return authErr;

    const newItem = await menuService.createMenuItem(supabase, input);
    return actionSuccess(newItem);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Kitchen Head Chef or Manager updates menu dish attributes.
 */
export async function updateMenuItemAction(rawInput: UpdateMenuItemInput): Promise<ActionResponse<MenuItemRecord>> {
  try {
    const input = updateMenuItemSchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();

    const authErr = await enforceOperationalRoleGuard(['kitchen', 'manager']);
    if (authErr) return authErr;

    const updatedItem = await menuService.updateMenuItem(supabase, input);
    return actionSuccess(updatedItem);
  } catch (error) {
    return handleActionError(error);
  }
}

/**
 * Server Action: Kitchen Chef quick toggle to block customer orders on sold out items.
 */
export async function toggleMenuItemAvailabilityAction(rawInput: ToggleMenuAvailabilityInput): Promise<ActionResponse<MenuItemRecord>> {
  try {
    const input = toggleMenuAvailabilitySchema.parse(rawInput);
    const supabase = await createServerSupabaseClient();

    const authErr = await enforceOperationalRoleGuard(['kitchen', 'manager']);
    if (authErr) return authErr;

    const toggledItem = await menuService.toggleMenuAvailability(supabase, input);
    return actionSuccess(toggledItem);
  } catch (error) {
    return handleActionError(error);
  }
}
