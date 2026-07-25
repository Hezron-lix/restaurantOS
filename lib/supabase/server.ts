// =============================================================================
// RestaurantOS: Next.js App Router Server-Side Supabase Client Connector
// =============================================================================

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '../../types/database';

/**
 * Creates an asynchronous server-side Supabase client with App Router cookie integration.
 * Safe for consumption within React Server Components, Route Handlers, and Server Actions.
 */
export async function createServerSupabaseClient() {
  const cookieStore = await cookies();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co';
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-anon-key';

  return createServerClient<Database>(url, anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // The `setAll` method was invoked from a Server Component.
          // This can be ignored if middleware is refreshing user sessions.
        }
      },
    },
  });
}
