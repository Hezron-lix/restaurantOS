/**
 * Staff Layout — Authenticated shell for all operational staff consoles.
 * Routes: /waiter, /kitchen, /cashier, /manager
 *
 * Fetches the current session server-side and passes profile data to StaffHeader.
 * Unauthenticated users are redirected by middleware before reaching this layout.
 */

import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { StaffHeader } from '@/components/layout/StaffHeader';
import type { UserRole } from '@/types/database';

export default async function StaffLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile for display name and role
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single();

  const userName = profile?.full_name ?? user.email ?? 'Staff';
  const userRole = (profile?.role ?? 'guest') as UserRole;

  return (
    <div className="min-h-screen flex flex-col">
      <StaffHeader
        userName={userName}
        userRole={userRole}
      />
      <main className="flex-1 flex flex-col">
        {children}
      </main>
    </div>
  );
}
