"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function createMenuCategoryAction(restaurantId: string, name: string, description: string = "") {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get current max display_order
  const { data: categories } = await supabase
    .from("menu_categories")
    .select("display_order")
    .eq("restaurant_id", restaurantId)
    .order("display_order", { ascending: false })
    .limit(1);

  const displayOrder = categories && categories.length > 0 ? (categories[0].display_order || 0) + 1 : 1;

  const { error } = await supabase
    .from("menu_categories")
    .insert({
      restaurant_id: restaurantId,
      name,
      description,
      display_order: displayOrder,
      is_active: true
    });

  if (error) {
    console.error("Create Category Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/menu");
}

export async function createMenuItemAction(
  categoryId: string,
  name: string,
  description: string = "",
  priceCents: number,
  prepTimeMinutes: number = 10
) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("menu_items")
    .insert({
      category_id: categoryId,
      name,
      description,
      price_cents: priceCents,
      prep_time_minutes: prepTimeMinutes,
      is_available: true
    });

  if (error) {
    console.error("Create Menu Item Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/menu");
}

export async function toggleMenuItemAvailabilityAction(itemId: string, isAvailable: boolean) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("menu_items")
    .update({ is_available: isAvailable })
    .eq("id", itemId);

  if (error) {
    console.error("Toggle Availability Error:", error);
    throw new Error(error.message);
  }

  revalidatePath("/menu");
}
