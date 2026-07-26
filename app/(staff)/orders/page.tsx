import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAuthWorkspace } from "@/lib/auth/onboarding";
import { getOrdersHistory } from "@/services/orders";
import { OrderHistoryTable } from "@/components/orders/OrderHistoryTable";

export default async function OrdersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null; // Will be handled by middleware
  }

  const { restaurant } = await getAuthWorkspace(supabase, user.id);

  if (!restaurant) {
    return null;
  }

  const orders = await getOrdersHistory(supabase, restaurant.id);

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Orders</h1>
          <p className="text-muted-foreground mt-1">Browse and manage restaurant order history.</p>
        </div>
      </div>
      
      {/* 
        We pass the typecast orders because Supabase infers nested fields as arrays for one-to-many 
        relationships and object | array for one-to-one, which we safely assume follows our schema.
      */}
      <div className="flex-1 min-h-0">
        <OrderHistoryTable orders={orders as any} />
      </div>
    </div>
  );
}
