"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getSearchData(restaurantId: string) {
  const supabase = await createServerSupabaseClient();

  const [tablesRes, menuRes, staffRes] = await Promise.all([
    supabase
      .from("tables")
      .select("id, table_number")
      .eq("restaurant_id", restaurantId),
    supabase
      .from("menu_items")
      .select("id, name, menu_categories!inner(restaurant_id)")
      .eq("menu_categories.restaurant_id", restaurantId),
    supabase
      .from("profiles")
      .select("id, full_name, role")
      .eq("restaurant_id", restaurantId),
  ]);

  return {
    tables: tablesRes.data || [],
    menuItems: menuRes.data || [],
    staff: staffRes.data || [],
  };
}
