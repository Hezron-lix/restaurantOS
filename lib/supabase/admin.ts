// =============================================================================
// RestaurantOS: Supabase Service-Role Admin Client Bypass Helper
// =============================================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../../types/database';

/**
 * Creates an administrative Supabase client equipped with the Service Role key.
 * WARNING: Bypasses Row-Level Security (RLS). Use exclusively in background cron tasks, AI audits, and seed.ts resets!
 */
export function createAdminSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'placeholder-service-role-key';

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
