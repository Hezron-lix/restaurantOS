import { getFloorTables } from '@/services/tables';
import { getKitchenLoad } from '@/services/orders';
import { getTodaySalesSummary } from '@/services/analytics';
import type { ToolContext } from './registry';

export async function getRestaurantHealth(context: ToolContext, args: Record<string, any>) {
  try {
    const allowedRoles = ['admin', 'manager'];
    if (!allowedRoles.includes(context.role)) {
      return { error: 'Unauthorized. Only managers can view a full health summary.' };
    }

    const [tables, kitchen, sales] = await Promise.all([
      getFloorTables(context.supabase), // tables service uses RLS internally, but we could pass restaurantId if needed. Wait, getFloorTables might need it.
      getKitchenLoad(context.supabase, context.restaurantId!),
      getTodaySalesSummary(context.supabase, context.restaurantId!)
    ]);

    const totalTables = tables.length;
    const availableTables = tables.filter(t => t.status === 'AVAILABLE').length;
    
    // We treat seated/active as strictly occupied for this summary.
    // Dirty/Cleaning/Reserved can be grouped if necessary, but the prompt says:
    // "Dining room: 2 tables occupied, 4 available."
    const seatedCount = tables.filter(t => ['SEATED', 'PREPARING', 'READY'].includes(t.status)).length;

    let summary = "🟢 **Restaurant Health**\n\n";
    summary += `• **Dining Room:** ${seatedCount} occupied, ${availableTables} available.\n`;
    
    if (kitchen.activeTickets === 0) {
      summary += `• **Kitchen:** No active tickets.\n`;
    } else {
      summary += `• **Kitchen:** ${kitchen.activeTickets} active ticket${kitchen.activeTickets === 1 ? '' : 's'}.\n`;
    }
    
    if (sales.totalOrders === 0) {
      summary += `• **Today's Revenue:** 0 today.\n\n`;
    } else {
      summary += `• **Today's Revenue:** ${sales.totalRevenue}.\n\n`;
    }
    
    // Simple conditional for the ending
    if (kitchen.activeTickets === 0 && availableTables > 0) {
      summary += "🟢 Everything looks healthy. You have good table availability and no kitchen backlog.";
    } else if (kitchen.activeTickets > 5 || availableTables === 0) {
      summary += "🟠 Operations are busy. The restaurant is currently running at high capacity.";
    } else {
      summary += "🟢 Everything is running smoothly. No immediate action is required.";
    }

    return {
      success: true,
      summary: summary
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch restaurant health summary.' };
  }
}
