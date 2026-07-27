"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function seedRestaurantData(restaurantId: string, tableCount: number = 6) {
  const supabase = await createServerSupabaseClient();
  
  // 1. Check if tables already exist
  const { data: existingTables, error: tableError } = await supabase
    .from("tables")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .limit(1);
    
  if (tableError) {
    console.error("Error checking tables:", tableError);
    return { success: false, error: tableError.message };
  }
  
  if (existingTables && existingTables.length > 0) {
    // Already seeded
    return { success: true, message: "Restaurant already seeded." };
  }

  // 2. Insert Tables
  const tablesToInsert = Array.from({ length: tableCount }).map((_, i) => ({
    restaurant_id: restaurantId,
    table_number: i + 1,
    capacity: (i % 2 === 0) ? 2 : 4,
    status: "AVAILABLE" as const,
  }));
  
  const { error: insertTableError } = await supabase.from("tables").insert(tablesToInsert);
  if (insertTableError) return { success: false, error: insertTableError.message };

  // 3. Insert Menu Categories
  const categoriesToInsert = [
    { restaurant_id: restaurantId, name: "Appetizers", display_order: 1 },
    { restaurant_id: restaurantId, name: "Main Courses", display_order: 2 },
    { restaurant_id: restaurantId, name: "Desserts", display_order: 3 },
    { restaurant_id: restaurantId, name: "Drinks", display_order: 4 },
  ];
  
  const { data: categories, error: catError } = await supabase
    .from("menu_categories")
    .insert(categoriesToInsert)
    .select();
    
  if (catError || !categories) return { success: false, error: catError?.message };

  // 4. Insert Menu Items
  const catMap = categories.reduce((acc, cat) => {
    acc[cat.name] = cat.id;
    return acc;
  }, {} as Record<string, string>);

  const itemsToInsert = [
    // Appetizers
    { category_id: catMap["Appetizers"], name: "Bruschetta", price_cents: 800, prep_time_minutes: 10 },
    { category_id: catMap["Appetizers"], name: "Calamari", price_cents: 1200, prep_time_minutes: 15 },
    // Mains
    { category_id: catMap["Main Courses"], name: "Grilled Salmon", price_cents: 2400, prep_time_minutes: 25 },
    { category_id: catMap["Main Courses"], name: "Ribeye Steak", price_cents: 3200, prep_time_minutes: 30 },
    { category_id: catMap["Main Courses"], name: "Truffle Pasta", price_cents: 2100, prep_time_minutes: 20 },
    // Desserts
    { category_id: catMap["Desserts"], name: "Tiramisu", price_cents: 900, prep_time_minutes: 5 },
    { category_id: catMap["Desserts"], name: "Cheesecake", price_cents: 850, prep_time_minutes: 5 },
    // Drinks
    { category_id: catMap["Drinks"], name: "Craft Beer", price_cents: 700, prep_time_minutes: 2 },
    { category_id: catMap["Drinks"], name: "Pinot Noir (Glass)", price_cents: 1100, prep_time_minutes: 2 },
    { category_id: catMap["Drinks"], name: "Sparkling Water", price_cents: 400, prep_time_minutes: 1 },
  ];

  const { error: itemError } = await supabase.from("menu_items").insert(itemsToInsert);
  if (itemError) return { success: false, error: itemError.message };

  return { success: true, message: "Successfully seeded restaurant data." };
}
