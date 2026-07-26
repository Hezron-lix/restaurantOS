import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PosInterface } from "@/components/pos/PosInterface";

export default async function PosPage({ params }: { params: Promise<{ tableId: string }> }) {
  const resolvedParams = await params;
  const tableId = resolvedParams.tableId;
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from("profiles")
    .select("restaurant_id")
    .eq("id", user.id)
    .single();

  if (!profile?.restaurant_id) redirect('/onboarding');

  // 1. Get Table
  const { data: table } = await supabase
    .from("tables")
    .select("id, table_number, status")
    .eq("id", tableId)
    .single();

  if (!table) redirect('/tables');

  // 2. Get Active Order
  const { data: order } = await supabase
    .from("orders")
    .select("id")
    .eq("table_id", tableId)
    .in("status", ["PLACED", "PREPARING", "READY"])
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // If no order is active for this table, maybe they tried to navigate directly. Redirect back.
  if (!order) redirect('/tables');

  // 3. Get Menu Categories & Items
  const { data: categories } = await supabase
    .from("menu_categories")
    .select("id, name")
    .eq("restaurant_id", profile.restaurant_id)
    .order("display_order", { ascending: true });

  const { data: items } = await supabase
    .from("menu_items")
    .select("id, category_id, name, price_cents")
    // Wait, menu_items doesn't have restaurant_id, it is implicitly owned by category_id.
    // In a real app we'd join, but we can filter by category_ids if needed.
    // However, if we just select all menu items, Supabase RLS would restrict it.
    // For now, let's fetch items whose category_id is in the categories we just fetched.
    .in("category_id", categories?.map(c => c.id) || [])
    .eq("is_available", true);

  return (
    <div className="px-6 md:px-8">
      <PosInterface 
        tableId={table.id}
        tableNumber={table.table_number}
        orderId={order.id}
        categories={categories || []}
        menuItems={items || []}
      />
    </div>
  );
}
