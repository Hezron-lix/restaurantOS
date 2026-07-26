"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function enableDemoModeAction(restaurantId: string) {
  // Use user client only for authentication
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Use admin client for all DB operations -- bypasses RLS for seeding
  const admin = createAdminSupabaseClient();

  // 1. Wipe current state
  await admin.from("orders").delete().eq("restaurant_id", restaurantId);
  await admin.from("restaurant_activities").delete().eq("restaurant_id", restaurantId);

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
    const { data: categories } = await admin.from("menu_categories").insert(categoriesToInsert).select();
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
        await admin.from("menu_items").insert(itemsToInsert);
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
    const { data: newTables } = await admin.from("tables").insert(tablesToInsert).select("id");
    tables = newTables;
  }

  // 5. Reset Table Statuses and Create Active Orders
  if (tables && tables.length >= 4) {
    await admin.from("tables").update({ status: "AVAILABLE" }).eq("restaurant_id", restaurantId);
    await admin.from("tables").update({ status: "SEATED" }).eq("id", tables[1].id);
    await admin.from("tables").update({ status: "SEATED" }).eq("id", tables[3].id);

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
      const { data: createdOrders } = await admin.from("orders").insert([order1, order2]).select("id");
      if (createdOrders && createdOrders.length === 2) {
        const orderItems = [
          { order_id: createdOrders[0].id, menu_item_id: menuItems[0].id, quantity: 1, item_price_cents: menuItems[0].price_cents, status: "QUEUED" as const, notes: "Extra crispy" },
          { order_id: createdOrders[0].id, menu_item_id: menuItems[1].id, quantity: 1, item_price_cents: menuItems[1].price_cents, status: "QUEUED" as const },
          { order_id: createdOrders[1].id, menu_item_id: menuItems[0].id, quantity: 2, item_price_cents: menuItems[0].price_cents, status: "QUEUED" as const },
        ];
        await admin.from("order_items").insert(orderItems);
      }
    }
  }

  // 7. Seed Historical Revenue — deterministic fixed amounts for hackathon demo consistency
  if (tables && tables.length > 0) {
    const fixedAmountsCents = [2500, 3200, 1850, 4500, 2850];
    const historicalOrders = fixedAmountsCents.map((cents, i) => ({
      restaurant_id: restaurantId,
      table_id: tables![0].id,
      waiter_id: user.id,
      status: "BILLED" as const,
      total_cents: cents,
      created_at: new Date(Date.now() - (i + 1) * 60 * 60000).toISOString(),
    }));
    await admin.from("orders").insert(historicalOrders);
  }

  // 8. Seed Activities
  const activities = [
    { restaurant_id: restaurantId, type: "shift_start", title: "Shift Started", description: "Evening service has begun.", icon_name: "Sun", color_class: "text-amber-400", bg_class: "bg-amber-400/10" },
    { restaurant_id: restaurantId, type: "inventory_alert", title: "Demo Alert • Low Stock", description: "Truffle oil is running low.", icon_name: "AlertTriangle", color_class: "text-red-400", bg_class: "bg-red-400/10" },
  ];
  await admin.from("restaurant_activities").insert(activities);

  revalidatePath("/", "layout");
}
