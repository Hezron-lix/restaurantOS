"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { logActivityAction } from "./activity";
import type { OrderStatus } from "@/types/database";

export async function openTableAction(tableId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  // Get restaurant_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("restaurant_id")
    .eq("id", user.id)
    .single();

  if (!profile?.restaurant_id) throw new Error("No restaurant context");

  // 1. Create a new order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      restaurant_id: profile.restaurant_id,
      table_id: tableId,
      waiter_id: user.id,
      status: "PLACED", // Initial status
      total_cents: 0,
    })
    .select("id")
    .single();

  if (orderError || !order) throw new Error("Failed to create order");

  // 2. Update table status to SEATED
  const { error: tableError } = await supabase
    .from("tables")
    .update({ status: "SEATED" })
    .eq("id", tableId);

  if (tableError) throw new Error("Failed to update table status");

  // 3. Log Activity
  await logActivityAction({
    restaurantId: profile.restaurant_id,
    type: "table_seated",
    title: "Table Opened",
    description: `Guests seated at table.`,
    iconName: "Users",
    colorClass: "text-blue-400",
    bgClass: "bg-blue-400/10"
  });

  revalidatePath("/tables");
  revalidatePath("/dashboard");
  
  redirect(`/pos/${tableId}`); // Navigate to POS for this table
}

export async function submitOrderAction(tableId: string, orderId: string, items: Array<{menu_item_id: string, quantity: number, price_cents: number, notes?: string}>, totalCents: number) {
  const supabase = await createServerSupabaseClient();
  
  // Need to get restaurant_id to log activity properly
  const { data: orderData } = await supabase.from("orders").select("restaurant_id").eq("id", orderId).single();
  const restaurantId = orderData?.restaurant_id;

  // 1. Insert order items
  const orderItemsToInsert = items.map(item => ({
    order_id: orderId,
    menu_item_id: item.menu_item_id,
    quantity: item.quantity,
    item_price_cents: item.price_cents,
    status: "QUEUED" as const,
    notes: item.notes || null
  }));

  if (orderItemsToInsert.length > 0) {
    const { error: itemsError } = await supabase.from("order_items").insert(orderItemsToInsert);
    if (itemsError) throw new Error("Failed to save order items");
  }

  // 2. Update order total and status
  const { error: orderError } = await supabase
    .from("orders")
    .update({ 
      status: "PREPARING",
      total_cents: totalCents
    })
    .eq("id", orderId);

  if (orderError) throw new Error("Failed to update order");

  // 3. Log Activity
  if (restaurantId) {
    await logActivityAction({
      restaurantId,
      type: "order_sent",
      title: "Order Sent to Kitchen",
      description: `Order ${orderId.slice(0,6)} has been sent to the kitchen.`,
      iconName: "ChefHat",
      colorClass: "text-orange-400",
      bgClass: "bg-orange-400/10"
    });
  }

  revalidatePath(`/pos/${tableId}`);
  revalidatePath("/tables");
  revalidatePath("/dashboard");

  redirect("/dashboard");
}

export async function updateOrderStatusAction(orderId: string, newStatus: string) {
  const supabase = await createServerSupabaseClient();
  
  // 1. Get order details
  const { data: order } = await supabase
    .from("orders")
    .select("restaurant_id, table_id")
    .eq("id", orderId)
    .single();
    
  if (!order) throw new Error("Order not found");

  // 2. Update order status
  const { error } = await supabase
    .from("orders")
    .update({ status: newStatus as OrderStatus })
    .eq("id", orderId);
    
  if (error) throw new Error("Failed to update order");

  // 3. Update table status accordingly
  if (newStatus === "READY") {
    await supabase.from("tables").update({ status: "READY" }).eq("id", order.table_id);
    
    // Log Activity
    if (order.restaurant_id) {
      await logActivityAction({
        restaurantId: order.restaurant_id,
        type: "order_ready",
        title: "Order Ready",
        description: `Order ${orderId.slice(0,6)} is ready for pickup.`,
        iconName: "CheckCircle2",
        colorClass: "text-emerald-400",
        bgClass: "bg-emerald-400/10"
      });
    }
  } else if (newStatus === "SERVED") {
    // A served order means the guests are eating, table is SEATED (or DIRTY if completed)
    await supabase.from("tables").update({ status: "DIRTY" }).eq("id", order.table_id);
    
    if (order.restaurant_id) {
      await logActivityAction({
        restaurantId: order.restaurant_id,
        type: "order_served",
        title: "Order Served",
        description: `Order ${orderId.slice(0,6)} has been served. Table is now dirty/billing.`,
        iconName: "Utensils",
        colorClass: "text-blue-400",
        bgClass: "bg-blue-400/10"
      });
    }
  }

  // Not calling redirect here, just letting the client useTransition handle it.
  // The global RealtimeRefresher will trigger router.refresh() automatically when DB updates!
}
