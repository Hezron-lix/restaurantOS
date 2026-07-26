import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * Retrieves the current status of the kitchen by querying active orders.
 * Returns the count of open orders and the oldest active order time.
 */
export async function getKitchenLoad(supabase: SupabaseClient<Database>, restaurantId: string) {
  // Query orders that are PREPARING or READY (matches Dashboard logic)
  const { data: activeOrders, error } = await supabase
    .from('orders')
    .select('id, status, created_at, table_id')
    .eq('restaurant_id', restaurantId)
    .in('status', ['PREPARING', 'READY']);

  if (error) {
    throw new Error(`Failed to fetch kitchen status: ${error.message}`);
  }

  const orders = activeOrders || [];
  
  return {
    activeTickets: orders.length,
    oldestTicketTime: orders.length > 0 
      ? orders.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0].created_at 
      : null
  };
}

/**
 * Retrieves the full order history for a restaurant, including items and table names.
 */
export async function getOrdersHistory(supabase: SupabaseClient<Database>, restaurantId: string) {
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      created_at,
      total_cents,
      tables ( table_number ),
      order_items (
        id,
        quantity,
        item_price_cents,
        menu_items ( name )
      )
    `)
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch orders history: ${error.message}`);
  }

  return orders || [];
}
