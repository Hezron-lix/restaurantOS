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
    totalRevenue: totalCents,
    totalOrders: validOrders.length,
    averageCheck: validOrders.length > 0 ? (totalCents / validOrders.length) : 0
  };
}
export async function getAnalyticsSummary(supabase: SupabaseClient<Database>, restaurantId: string) {
  const now = new Date();
  
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);

  const sevenDaysAgo = new Date(now);
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const thirtyDaysAgo = new Date(now);
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  // Fetch orders from the last 30 days
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('total_cents, status, created_at')
    .eq('restaurant_id', restaurantId)
    .gte('created_at', thirtyDaysAgo.toISOString());

  if (ordersError) throw new Error(`Failed to fetch orders: ${ordersError.message}`);

  // Fetch tables to count occupied
  const { data: tables, error: tablesError } = await supabase
    .from('tables')
    .select('status')
    .eq('restaurant_id', restaurantId);

  if (tablesError) throw new Error(`Failed to fetch tables: ${tablesError.message}`);

  const validOrders = orders || [];
  const validTables = tables || [];

  // Filter completed orders (BILLED or SERVED count as revenue in this system per previous implementations)
  const completedOrders = validOrders.filter(o => o.status === 'BILLED' || o.status === 'SERVED');

  // Revenue metrics
  const revenueTodayCents = completedOrders
    .filter(o => new Date(o.created_at) >= today)
    .reduce((sum, o) => sum + (o.total_cents || 0), 0);

  const revenueWeeklyCents = completedOrders
    .filter(o => new Date(o.created_at) >= sevenDaysAgo)
    .reduce((sum, o) => sum + (o.total_cents || 0), 0);

  const revenueMonthlyCents = completedOrders
    .reduce((sum, o) => sum + (o.total_cents || 0), 0);

  // Order metrics
  const ordersToday = validOrders.filter(o => new Date(o.created_at) >= today).length;
  const totalCompletedOrders = completedOrders.length;
  const totalRevenueCents = revenueMonthlyCents;
  const averageOrderValueCents = totalCompletedOrders > 0 ? totalRevenueCents / totalCompletedOrders : 0;

  // Occupied tables count (anything not AVAILABLE)
  const occupiedTables = validTables.filter(t => t.status !== 'AVAILABLE').length;

  return {
    revenueToday: revenueTodayCents,
    revenueWeekly: revenueWeeklyCents,
    revenueMonthly: revenueMonthlyCents,
    ordersToday,
    completedOrdersTotal: totalCompletedOrders,
    averageOrderValue: averageOrderValueCents,
    occupiedTables
  };
}

export async function getAdvancedAnalyticsSummary(supabase: SupabaseClient<Database>, restaurantId: string, timeframe: 'today' | 'week' | 'month' = 'month') {
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0); // Default to start of today

  if (timeframe === 'week') {
    startDate.setDate(startDate.getDate() - 7);
  } else if (timeframe === 'month') {
    startDate.setDate(startDate.getDate() - 30);
  }

  // Fetch all orders from the specified timeframe including their items and tables
  const { data: orders, error } = await supabase
    .from('orders')
    .select(`
      id,
      status,
      created_at,
      total_cents,
      tables ( id, table_number ),
      order_items (
        quantity,
        item_price_cents,
        menu_items ( id, name )
      )
    `)
    .eq('restaurant_id', restaurantId)
    .gte('created_at', startDate.toISOString());

  if (error) {
    throw new Error(`Failed to fetch advanced analytics data: ${error.message}`);
  }

  const validOrders = orders || [];
  
  // 1. Largest Order
  let largestOrder = null;
  if (validOrders.length > 0) {
    const sorted = [...validOrders].sort((a, b) => (b.total_cents || 0) - (a.total_cents || 0));
    largestOrder = {
      id: sorted[0].id,
      total_cents: sorted[0].total_cents,
      created_at: sorted[0].created_at,
      table_number: (sorted[0].tables as any)?.table_number
    };
  }

  // 2. Table Revenue Rankings
  const tableStats: Record<string, { table_number: string, total_revenue: number, order_count: number }> = {};
  for (const order of validOrders) {
    if (order.status !== 'BILLED' && order.status !== 'SERVED') continue;
    const tableId = (order.tables as any)?.id;
    const tableNum = (order.tables as any)?.table_number;
    if (tableId && tableNum) {
      if (!tableStats[tableId]) tableStats[tableId] = { table_number: tableNum, total_revenue: 0, order_count: 0 };
      tableStats[tableId].total_revenue += (order.total_cents || 0);
      tableStats[tableId].order_count += 1;
    }
  }
  const topTables = Object.values(tableStats)
    .sort((a, b) => b.total_revenue - a.total_revenue)
    .slice(0, 5);

  // 3. Top Menu Items
  const itemStats: Record<string, { name: string, total_sold: number, revenue: number }> = {};
  for (const order of validOrders) {
    if (order.status !== 'BILLED' && order.status !== 'SERVED') continue;
    for (const item of (order.order_items || [])) {
      const menuItemId = ((item as any).menu_items as any)?.id;
      const menuItemName = ((item as any).menu_items as any)?.name;
      if (menuItemId && menuItemName) {
        if (!itemStats[menuItemId]) itemStats[menuItemId] = { name: menuItemName, total_sold: 0, revenue: 0 };
        itemStats[menuItemId].total_sold += ((item as any).quantity || 1);
        itemStats[menuItemId].revenue += (((item as any).item_price_cents || 0) * ((item as any).quantity || 1));
      }
    }
  }
  
  const allItems = Object.values(itemStats).sort((a, b) => b.total_sold - a.total_sold);
  const bestSellingItems = allItems.slice(0, 5);
  const leastSellingItems = allItems.slice(-5).reverse();

  return {
    largestOrder,
    topSpendingTables: topTables,
    bestSellingItems,
    leastSellingItems
  };
}
