import { getKitchenLoad } from '@/services/orders';
import type { ToolContext } from './registry';

export async function getKitchenStatus(context: ToolContext, args: Record<string, any>) {
  try {
    const allowedRoles = ['admin', 'manager', 'waiter', 'chef'];
    if (!allowedRoles.includes(context.role)) {
      return { error: 'Unauthorized.' };
    }

    // Must use live application data filtered by restaurant
    const data = await getKitchenLoad(context.supabase, context.restaurantId!);

    if (data.activeTickets === 0) {
      return { success: true, summary: "👨‍🍳 **Kitchen Status:** Clear (0 active tickets)" };
    }

    return { 
      success: true, 
      summary: `👨‍🍳 **Kitchen Status:** ${data.activeTickets} active ticket${data.activeTickets === 1 ? '' : 's'}`
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch kitchen status.' };
  }
}
