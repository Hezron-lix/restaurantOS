"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function enableDemoModeAction() {
  // Use user client only for authentication
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', user.id)
    .single();

  if (!profile?.restaurant_id) {
    throw new Error("No restaurant associated with user");
  }
  
  const restaurantId = profile.restaurant_id;

  // Use admin client for all DB operations -- bypasses RLS for seeding
  const admin = createAdminSupabaseClient();

  // 1. Wipe current state
  await admin.from("orders").delete().eq("restaurant_id", restaurantId).throwOnError();
  await admin.from("restaurant_activities").delete().eq("restaurant_id", restaurantId).throwOnError();

  // 2. Seed Menu Categories if none exist
  const { data: existingCategories } = await admin
    .from("menu_categories")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .limit(1);

  if (!existingCategories || existingCategories.length === 0) {
    const categoriesToInsert = [
      { restaurant_id: restaurantId, name: "Appetizers", display_order: 1 },
      { restaurant_id: restaurantId, name: "Main Courses", display_order: 2 },
      { restaurant_id: restaurantId, name: "Drinks", display_order: 3 },
    ];
    const { data: categories } = await admin.from("menu_categories").insert(categoriesToInsert).select().throwOnError();
    if (categories) {
      const appetizersId = categories.find(c => c.name === "Appetizers")?.id;
      const mainsId = categories.find(c => c.name === "Main Courses")?.id;
      const drinksId = categories.find(c => c.name === "Drinks")?.id;

      const itemsToInsert: Array<{ category_id: string; name: string; price_cents: number; prep_time_minutes: number; is_available: boolean }> = [];
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
      if (itemsToInsert.length > 0) {
        await admin.from("menu_items").insert(itemsToInsert).throwOnError();
      }
    }
  }

  // 3. Get menu items scoped to THIS restaurant
  const { data: restaurantCategoryIds } = await admin
    .from("menu_categories")
    .select("id")
    .eq("restaurant_id", restaurantId);

  const categoryIds = restaurantCategoryIds?.map(c => c.id) ?? [];
  const { data: menuItems } = categoryIds.length > 0
    ? await admin.from("menu_items").select("id, name, price_cents").in("category_id", categoryIds).limit(5)
    : { data: null };

  // 4. Seed Tables if none exist
  let { data: tables } = await admin
    .from("tables")
    .select("id")
    .eq("restaurant_id", restaurantId)
    .order("table_number");

  if (!tables || tables.length === 0) {
    const tablesToInsert = Array.from({ length: 6 }).map((_, i) => ({
      restaurant_id: restaurantId,
      table_number: i + 1,
      capacity: i % 2 === 0 ? 2 : 4,
      status: "AVAILABLE" as const,
    }));
    const { data: newTables } = await admin.from("tables").insert(tablesToInsert).select("id").throwOnError();
    tables = newTables;
  }

  // 5. Reset Table Statuses and Create Active Orders
  if (tables && tables.length >= 4) {
    await admin.from("tables").update({ status: "AVAILABLE" }).eq("restaurant_id", restaurantId).throwOnError();
    await admin.from("tables").update({ status: "SEATED" }).eq("id", tables[1].id).throwOnError();
    await admin.from("tables").update({ status: "SEATED" }).eq("id", tables[3].id).throwOnError();

    if (menuItems && menuItems.length >= 2) {
      const order1 = {
        restaurant_id: restaurantId,
        table_id: tables[1].id,
        waiter_id: user.id,
        status: "PREPARING" as const,
        total_cents: menuItems[0].price_cents + menuItems[1].price_cents,
        created_at: new Date(Date.now() - 12 * 60000).toISOString(),
      };
      const order2 = {
        restaurant_id: restaurantId,
        table_id: tables[3].id,
        waiter_id: user.id,
        status: "READY" as const,
        total_cents: menuItems[0].price_cents * 2,
        created_at: new Date(Date.now() - 25 * 60000).toISOString(),
      };
      const { data: createdOrders } = await admin.from("orders").insert([order1, order2]).select("id").throwOnError();
      if (createdOrders && createdOrders.length === 2) {
        const orderItems = [
          { order_id: createdOrders[0].id, menu_item_id: menuItems[0].id, quantity: 1, item_price_cents: menuItems[0].price_cents, status: "QUEUED" as const, notes: "Extra crispy" },
          { order_id: createdOrders[0].id, menu_item_id: menuItems[1].id, quantity: 1, item_price_cents: menuItems[1].price_cents, status: "QUEUED" as const },
          { order_id: createdOrders[1].id, menu_item_id: menuItems[0].id, quantity: 2, item_price_cents: menuItems[0].price_cents, status: "QUEUED" as const },
        ];
        await admin.from("order_items").insert(orderItems).throwOnError();
      }
    }
  }

  // 7. Seed Historical Revenue — deterministic distribution for hackathon demo consistency
  if (tables && tables.length > 0 && menuItems && menuItems.length > 0) {
    const historicalOrders: any[] = [];
    const historicalOrderItemsTemplates: any[][] = [];
    const now = Date.now();
    
    // Create ~45 orders spread over the last 30 days
    for (let i = 0; i < 45; i++) {
      // Days ago: from 0 to 29, distributed
      const daysAgo = (i * 13) % 30; 
      
      // Deterministically pick 1 to 3 items
      const numItems = (i % 3) + 1;
      let orderTotal = 0;
      const itemsForThisOrder = [];
      
      for (let j = 0; j < numItems; j++) {
        // Deterministically pick a menu item based on current loop indices
        const menuItem = menuItems[(i + j) % menuItems.length];
        const quantity = (j % 2) + 1; // 1 or 2
        orderTotal += menuItem.price_cents * quantity;
        
        itemsForThisOrder.push({
          menu_item_id: menuItem.id,
          quantity,
          item_price_cents: menuItem.price_cents,
          status: "READY" as const,
        });
      }
      
      historicalOrders.push({
        restaurant_id: restaurantId,
        table_id: tables[i % tables.length].id,
        waiter_id: user.id,
        status: "BILLED" as const,
        total_cents: orderTotal,
        created_at: new Date(now - daysAgo * 24 * 60 * 60 * 1000 - i * 60 * 60000).toISOString(),
      });
      
      historicalOrderItemsTemplates.push(itemsForThisOrder);
    }
    
    // Bulk insert orders and return their newly generated IDs
    const { data: insertedOrders } = await admin.from("orders").insert(historicalOrders).select("id").throwOnError();
    
    // Bulk insert all corresponding order items
    if (insertedOrders && insertedOrders.length === historicalOrders.length) {
      const finalOrderItems: any[] = [];
      insertedOrders.forEach((order: any, i: number) => {
        const items = historicalOrderItemsTemplates[i];
        items.forEach((item: any) => {
          finalOrderItems.push({ ...item, order_id: order.id });
        });
      });
      await admin.from("order_items").insert(finalOrderItems).throwOnError();
    }
  }

  // 8. Seed Activities
  const activities = [
    { restaurant_id: restaurantId, type: "shift_start", title: "Shift Started", description: "Evening service has begun.", icon_name: "Sun", color_class: "text-amber-400", bg_class: "bg-amber-400/10" },
    { restaurant_id: restaurantId, type: "inventory_alert", title: "Demo Alert • Low Stock", description: "Truffle oil is running low.", icon_name: "AlertTriangle", color_class: "text-red-400", bg_class: "bg-red-400/10" },
  ];
  await admin.from("restaurant_activities").insert(activities).throwOnError();

  revalidatePath("/", "layout");
}
