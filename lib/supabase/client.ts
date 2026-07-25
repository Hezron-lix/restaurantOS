// =============================================================================
// RestaurantOS: Browser-Side Supabase Client Connector
// =============================================================================

import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '../../types/database';

/**
 * Creates and singleton-caches a browser Supabase client using public environment secrets.
 */
export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

  return createBrowserClient<Database>(url, anonKey);
}
