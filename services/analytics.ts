import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

/**
 * Retrieves a summary of today's sales directly from the orders table.
 */
export async function getTodaySalesSummary(supabase: SupabaseClient<Database>, restaurantId: string) {
  // Matches Dashboard logic
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: orders, error } = await supabase
    .from('orders')
    .select('total_cents, status, created_at')
    .eq('restaurant_id', restaurantId)
    .in('status', ['BILLED', 'SERVED'])
    .gte('created_at', today.toISOString());

  if (error) {
    throw new Error(`Failed to fetch sales summary: ${error.message}`);
  }

  const validOrders = orders || [];
  const totalCents = validOrders.reduce((sum, order) => sum + (order.total_cents || 0), 0);
  
  return {
    totalRevenue: totalCents / 100, // Format as dollars for the AI
    totalOrders: validOrders.length,
    averageCheck: validOrders.length > 0 ? (totalCents / validOrders.length) / 100 : 0
  };
}
