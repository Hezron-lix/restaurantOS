import { getTodaySalesSummary } from '@/services/analytics';
import { formatCurrency } from '@/lib/format';
import type { ToolContext } from './registry';

export async function getSalesSummary(context: ToolContext, args: Record<string, any>) {
  try {
    const allowedRoles = ['admin', 'manager'];
    if (!allowedRoles.includes(context.role)) {
      return { error: 'Unauthorized. You do not have permission to view sales data.' };
    }

    // Must use live application data filtered by restaurant
    const data = await getTodaySalesSummary(context.supabase, context.restaurantId!);
    
    // Fetch restaurant settings for formatting
    const { data: restaurant } = await context.supabase
      .from('restaurants')
      .select('currency')
      .eq('id', context.restaurantId!)
      .single();

    if (data.totalOrders === 0) {
       return { success: true, summary: "💰 **Today's Revenue:** 0 (No completed orders yet)" };
    }

    const formattedRevenue = formatCurrency(data.totalRevenue, { currency: restaurant?.currency });

    return { 
      success: true, 
      summary: `💰 **Today's Revenue:** ${formattedRevenue} across ${data.totalOrders} completed order${data.totalOrders === 1 ? '' : 's'}.`,
      data: {
        totalRevenueTodayCents: data.totalRevenue,
        totalRevenueTodayFormatted: formattedRevenue,
        totalOrdersToday: data.totalOrders
      }
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch sales summary.' };
  }
}
