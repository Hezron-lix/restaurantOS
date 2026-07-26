import { getTodaySalesSummary } from '@/services/analytics';
import type { ToolContext } from './registry';

export async function getSalesSummary(context: ToolContext, args: Record<string, any>) {
  try {
    const allowedRoles = ['admin', 'manager'];
    if (!allowedRoles.includes(context.role)) {
      return { error: 'Unauthorized. You do not have permission to view sales data.' };
    }

    // Must use live application data filtered by restaurant
    const data = await getTodaySalesSummary(context.supabase, context.restaurantId!);
    
    if (data.totalOrders === 0) {
       return { success: true, summary: "💰 **Today's Revenue:** 0 (No completed orders yet)" };
    }

    return { 
      success: true, 
      summary: `💰 **Today's Revenue:** ${data.totalRevenue} across ${data.totalOrders} completed order${data.totalOrders === 1 ? '' : 's'}.`
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch sales summary.' };
  }
}
