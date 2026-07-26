import { getFloorTables } from '@/services/tables';
import type { ToolContext } from './registry';

/**
 * Returns a list of currently occupied tables (i.e. status is not 'AVAILABLE' or 'DIRTY' or similar, 
 * or just anything that has a party seated).
 */
export async function getOccupiedTables(context: ToolContext, args: Record<string, any>) {
  try {
    // Authorization check
    const allowedRoles = ['admin', 'manager', 'waiter', 'host']; // Example FOH/Manager roles
    if (!allowedRoles.includes(context.role)) {
      return { error: 'Unauthorized. You do not have permission to view table status.' };
    }

    const tables = await getFloorTables(context.supabase);

    const totalTables = tables.length;
    const availableTables = tables.filter(t => t.status === 'AVAILABLE').length;
    const occupiedCount = totalTables - availableTables;

    const seated = tables.filter(t => t.status === 'SEATED').length;
    const dirty = tables.filter(t => t.status === 'DIRTY').length;
    const cleaning = tables.filter(t => t.status === 'CLEANING').length;
    const reserved = tables.filter(t => t.status === 'RESERVED').length;
    const activeService = tables.filter(t => t.status === 'PREPARING' || t.status === 'READY').length;

    const guestsSeated = seated + activeService;
    const needsCleaning = dirty + cleaning;

    let summary = "🟢 **Floor Status**\n\n";
    summary += `• **Guest Tables:** ${guestsSeated}\n`;
    summary += `• **Available Tables:** ${availableTables}\n`;
    
    if (needsCleaning > 0) {
      summary += `• **Waiting for Cleaning:** ${needsCleaning}\n`;
    }
    if (reserved > 0) {
      summary += `• **Reserved:** ${reserved}\n`;
    }

    summary += "\n";
    if (availableTables > totalTables / 2) {
      summary += "🟢 The dining room has good availability.";
    } else if (availableTables > 0) {
      summary += "🟠 The dining room is busy, but some tables are still available.";
    } else {
      summary += "🔴 The dining room is currently at full capacity.";
    }

    return {
      success: true,
      summary: summary
    };
  } catch (error: any) {
    return { error: error.message || 'Failed to fetch occupied tables.' };
  }
}
