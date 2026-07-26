"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function enableDemoModeAction(restaurantId: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // 1. Wipe current state (Orders, Order Items, Activities)
  // Deleting orders will cascade to order_items.
  await supabase.from("orders").delete().eq("restaurant_id", restaurantId);
  await supabase.from("restaurant_activities").delete().eq("restaurant_id", restaurantId);

  // We won't wipe tables or menu to avoid breaking foreign keys, but we'll reset them.
  // First, check if menu categories exist. If not, seed them.
  const { data: existingCategories } = await supabase
    .from("menu_categories")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .limit(1);

  let appetizersId, mainsId, drinksId;

  if (!existingCategories || existingCategories.length === 0) {
    const categoriesToInsert = [
      { restaurant_id: restaurantId, name: "Appetizers", display_order: 1 },
      { restaurant_id: restaurantId, name: "Main Courses", display_order: 2 },
      { restaurant_id: restaurantId, name: "Drinks", display_order: 3 },
    ];
    const { data: categories } = await supabase.from("menu_categories").insert(categoriesToInsert).select();
    if (categories) {
      appetizersId = categories.find(c => c.name === "Appetizers")?.id;
      mainsId = categories.find(c => c.name === "Main Courses")?.id;
      drinksId = categories.find(c => c.name === "Drinks")?.id;

      // Seed Items
      const itemsToInsert = [];
      if (appetizersId) {
        itemsToInsert.push(
          { category_id: appetizersId, name: "Truffle Fries", price_cents: 899, prep_time_minutes: 10, is_available: true },
          { category_id: appetizersId, name: "Calamari", price_cents: 1299, prep_time_minutes: 12, is_available: true }
        );
      }
      if (mainsId) {
        itemsToInsert.push(
          { category_id: mainsId, name: "Wagyu Burger", price_cents: 2499, prep_time_minutes: 20, is_available: true },
          { category_id: mainsId, name: "Margherita Pizza", price_cents: 1899, prep_time_minutes: 15, is_available: true }
        );
      }
      if (drinksId) {
        itemsToInsert.push(
          { category_id: drinksId, name: "Craft Cola", price_cents: 499, prep_time_minutes: 2, is_available: true },
          { category_id: drinksId, name: "IPA Beer", price_cents: 799, prep_time_minutes: 2, is_available: true }
        );
      }
      await supabase.from("menu_items").insert(itemsToInsert);
    }
  }

  // Get current menu items to create fake orders
  const { data: menuItems } = await supabase
    .from("menu_items")
    .select("id, name, price_cents")
    // Note: in a real robust setup, we'd filter by category_id linked to the restaurant
    // but for demo mode we just get a few to make orders.
    .limit(5);

  // 2. Reset Tables and Make Some Occupied
  const { data: tables } = await supabase.from("tables").select("id").eq("restaurant_id", restaurantId).order('table_number');
  if (tables && tables.length >= 4) {
    await supabase.from("tables").update({ status: "AVAILABLE" }).eq("restaurant_id", restaurantId);
    
    // Set Table 2 and Table 4 to SEATED
    await supabase.from("tables").update({ status: "SEATED" }).eq("id", tables[1].id);
    await supabase.from("tables").update({ status: "SEATED" }).eq("id", tables[3].id);

    // 3. Create Orders
    if (menuItems && menuItems.length > 0) {
      const order1 = {
        restaurant_id: restaurantId,
        table_id: tables[1].id,
        waiter_id: user.id,
        status: "PREPARING" as const,
        total_cents: menuItems[0].price_cents + menuItems[1].price_cents,
        created_at: new Date(Date.now() - 12 * 60000).toISOString() // 12 mins ago
      };
      
      const order2 = {
        restaurant_id: restaurantId,
        table_id: tables[3].id,
        waiter_id: user.id,
        status: "READY" as const,
        total_cents: menuItems[0].price_cents * 2,
        created_at: new Date(Date.now() - 25 * 60000).toISOString() // 25 mins ago
      };

      const { data: createdOrders } = await supabase.from("orders").insert([order1, order2]).select("id");

      // 4. Create Order Items
      if (createdOrders && createdOrders.length === 2) {
        const orderItems = [
          { order_id: createdOrders[0].id, menu_item_id: menuItems[0].id, quantity: 1, item_price_cents: menuItems[0].price_cents, status: "QUEUED" as const, notes: "Extra crispy" },
          { order_id: createdOrders[0].id, menu_item_id: menuItems[1].id, quantity: 1, item_price_cents: menuItems[1].price_cents, status: "QUEUED" as const },
          { order_id: createdOrders[1].id, menu_item_id: menuItems[0].id, quantity: 2, item_price_cents: menuItems[0].price_cents, status: "QUEUED" as const }
        ];
        await supabase.from("order_items").insert(orderItems);
      }
    }
  }

  // 5. Seed fake historical revenue (completed orders from earlier today)
  const historicalOrders = Array.from({ length: 5 }).map((_, i) => ({
    restaurant_id: restaurantId,
    table_id: tables![0].id,
    waiter_id: user.id,
    status: "BILLED" as const,
    total_cents: Math.floor(Math.random() * 5000) + 2000, // random between $20 and $70
    created_at: new Date(Date.now() - (i + 1) * 60 * 60000).toISOString() // 1 to 5 hours ago
  }));
  await supabase.from("orders").insert(historicalOrders);

  // 6. Seed Activities
  const activities = [
    { restaurant_id: restaurantId, type: "shift_start", title: "Shift Started", description: "Evening service has begun.", icon_name: "Sun", color_class: "text-amber-400", bg_class: "bg-amber-400/10" },
    { restaurant_id: restaurantId, type: "inventory_alert", title: "Low Stock", description: "Truffle oil is running low.", icon_name: "AlertTriangle", color_class: "text-red-400", bg_class: "bg-red-400/10" }
  ];
  await supabase.from("restaurant_activities").insert(activities);

  revalidatePath("/", "layout");
}
