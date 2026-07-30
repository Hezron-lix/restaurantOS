import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getOccupiedTables } from './tables';
import { getKitchenStatus } from './kitchen';
import { getRestaurantHealth } from './health';
import { getSalesAnalytics, getOrdersHistoryTool } from './analytics';
import { getMenuItems } from './menu';
export interface ToolContext {
  userId: string;
  role: string;
  restaurantId?: string;
  supabase: SupabaseClient<Database>;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  execute: (context: ToolContext, args: Record<string, any>) => Promise<any>;
}

export const toolRegistry: Record<string, ToolDefinition> = {
  getOccupiedTables: {
    name: 'getOccupiedTables',
    description: 'Retrieves a list of currently occupied tables on the restaurant floor, including table number and status.',
    parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
    execute: getOccupiedTables
  },
  getKitchenStatus: {
    name: 'getKitchenStatus',
    description: 'Retrieves the number of active tickets in the kitchen to assess kitchen load.',
    parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
    execute: getKitchenStatus
  },
  getRestaurantHealth: {
    name: 'getRestaurantHealth',
    description: 'Retrieves a complete operational summary of the restaurant including tables, kitchen load, and sales.',
    parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
    execute: getRestaurantHealth
  },
  getSalesAnalytics: {
    name: 'getSalesAnalytics',
    description: 'Retrieves comprehensive sales analytics including revenue (today, weekly, monthly), top-selling items, highest revenue tables, largest orders, and order counts. Use for general sales questions, best-selling items, menu item counts, sales rankings, or top spending tables.',
    parameters: { 
      type: 'object', 
      properties: {
        timeframe: {
          type: 'string',
          enum: ['today', 'week', 'month'],
          description: 'The time period to analyze for top items, tables, and largest order. Defaults to month if not specified.'
        }
      }, 
      required: [], 
      additionalProperties: false 
    },
    execute: getSalesAnalytics
  },
  getOrdersHistory: {
    name: 'getOrdersHistory',
    description: 'Retrieves a history of recent orders, their statuses, totals, and items. Strictly use this ONLY to answer questions about specific recent orders, active orders, or order lookups. Do NOT use for analytics, top items, or largest orders.',
    parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
    execute: getOrdersHistoryTool
  },
  getMenuItems: {
    name: 'getMenuItems',
    description: 'Retrieves menu items for the restaurant. Can filter by category, search term, and availability, and sort by price or name. Do not assume vegetarian items exist as they are not currently tagged.',
    parameters: {
      type: 'object',
      properties: {
        category: { type: 'string', description: 'Filter by category name (case-insensitive).' },
        search: { type: 'string', description: 'Search term for item name or description.' },
        availableOnly: { type: 'boolean', description: 'If true, only returns items currently available.' },
        sortBy: { type: 'string', enum: ['price_asc', 'price_desc', 'name'], description: 'Sort criteria.' },
        limit: { type: 'number', description: 'Maximum number of items to return. Max 20.' }
      },
      required: [],
      additionalProperties: false
    },
    execute: getMenuItems
  }
};
