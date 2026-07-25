import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { LiveOrderBoard } from "@/components/kitchen/LiveOrderBoard";

export default async function KitchenPage() {
  const supabase = await createServerSupabaseClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from("profiles")
    .select("restaurant_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.restaurant_id) redirect('/onboarding');
  
  // Verify access (Kitchen or Manager)
  if (profile.role !== 'kitchen' && profile.role !== 'manager') {
    // We'll let waiters view it for the sake of the hackathon, but usually restricted.
  }

  // Fetch active orders for kitchen (PREPARING, READY)
  const { data: orders } = await supabase
    .from("orders")
    .select(`
      id,
      status,
      created_at,
      special_instructions,
      tables ( table_number ),
      order_items (
        id,
        menu_items ( name ),
        quantity,
        status,
        notes
      )
    `)
    .eq("restaurant_id", profile.restaurant_id)
    .in("status", ["PREPARING", "READY"])
    .order("created_at", { ascending: true }); // Oldest first

  // Transform data for the client component
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const typedOrders = (orders as unknown as any[]) || [];
  
  const formattedOrders = typedOrders.map(order => ({
    id: order.id,
    status: order.status,
    created_at: order.created_at,
    special_instructions: order.special_instructions,
    table_number: order.tables?.table_number,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    items: (order.order_items || []).map((item: any) => ({
      id: item.id,
      name: item.menu_items?.name || "Unknown Item",
      quantity: item.quantity,
      status: item.status,
      notes: item.notes
    }))
  }));

  return (
    <div className="h-[calc(100vh-64px)] overflow-hidden flex flex-col p-6 -mx-8 -mt-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Live Kitchen Display</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-brand animate-pulse"></span>
            <span className="text-sm font-medium text-brand">Live Sync</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <LiveOrderBoard initialOrders={formattedOrders} />
      </div>
    </div>
  );
}
