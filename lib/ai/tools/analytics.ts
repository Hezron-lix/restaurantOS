import { getAnalyticsSummary, getAdvancedAnalyticsSummary } from '@/services/analytics';
import { getOrdersHistory } from '@/services/orders';
import type { ToolContext } from './registry';

export async function getSalesAnalytics(context: ToolContext, args: Record<string, any>) {
  try {
    const allowedRoles = ['admin', 'manager'];
    if (!allowedRoles.includes(context.role)) {
      return { error: 'Unauthorized. You do not have permission to view sales analytics.' };
    }

    const data = await getAnalyticsSummary(context.supabase, context.restaurantId!);
    
    // Default to 'month' if timeframe is invalid or not provided
    const validTimeframes = ['today', 'week', 'month'];
    const timeframe = validTimeframes.includes(args.timeframe) ? args.timeframe : 'month';
    const advancedData = await getAdvancedAnalyticsSummary(context.supabase, context.restaurantId!, timeframe as any);
    
    // Fetch restaurant settings for formatting
    const { data: restaurant } = await context.supabase
      .from('restaurants')
      .select('currency')
      .eq('id', context.restaurantId!)
      .single();

    const formatCurrency = (await import('@/lib/format')).formatCurrency;
    const format = (cents: number) => formatCurrency(cents, { currency: restaurant?.currency });

    return { 
      success: true, 
      data: {
        revenueTodayCents: data.revenueToday,
        revenueTodayFormatted: format(data.revenueToday),
        
        revenueLast7DaysCents: data.revenueWeekly,
        revenueLast7DaysFormatted: format(data.revenueWeekly),
        
        revenueLast30DaysCents: data.revenueMonthly,
        revenueLast30DaysFormatted: format(data.revenueMonthly),
        
        totalOrdersToday: data.ordersToday,
        totalCompletedOrdersLast30Days: data.completedOrdersTotal,
        
        averageOrderValueLast30DaysCents: data.averageOrderValue,
        averageOrderValueLast30DaysFormatted: format(data.averageOrderValue),
        
        occupiedTablesNow: data.occupiedTables
      },
      advanced_analytics: {
        timeframe_analyzed: timeframe,
        [`largestOrder_${timeframe}`]: advancedData.largestOrder ? {
          ...advancedData.largestOrder,
          total_formatted: format(advancedData.largestOrder.total_cents)
        } : null,
        [`topSpendingTables_${timeframe}`]: advancedData.topSpendingTables.map(t => ({ ...t, total_revenue_formatted: format(t.total_revenue) })),
        [`bestSellingItems_${timeframe}`]: advancedData.bestSellingItems.map(i => ({ ...i, revenue_formatted: format(i.revenue) })),
        [`leastSellingItems_${timeframe}`]: advancedData.leastSellingItems.map(i => ({ ...i, revenue_formatted: format(i.revenue) }))
      }
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch sales analytics.' };
  }
}

export async function getOrdersHistoryTool(context: ToolContext, args: Record<string, any>) {
  try {
    const allowedRoles = ['admin', 'manager', 'staff'];
    if (!allowedRoles.includes(context.role)) {
      return { error: 'Unauthorized. You do not have permission to view order history.' };
    }

    if (!context.restaurantId) {
      return { error: 'No restaurant context found.' };
    }

    const data = await getOrdersHistory(context.supabase, context.restaurantId, { limit: 50 });
    
    return { 
      success: true, 
      orders: data 
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch order history.' };
  }
}
