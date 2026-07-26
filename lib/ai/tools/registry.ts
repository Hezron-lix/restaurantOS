import type { SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { getOccupiedTables } from './tables';
import { getSalesSummary } from './sales';
import { getKitchenStatus } from './kitchen';
import { getRestaurantHealth } from './health';

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
  getSalesSummary: {
    name: 'getSalesSummary',
    description: 'Retrieves the current day sales summary, including total revenue and total orders.',
    parameters: { type: 'object', properties: {}, required: [], additionalProperties: false },
    execute: getSalesSummary
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
  }
};
