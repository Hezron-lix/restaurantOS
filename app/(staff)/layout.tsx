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
import { StaffSidebar } from '@/components/layout/StaffSidebar';
import { Workspace } from '@/components/layout/Workspace';
import { StaffProviders } from '@/components/providers/staff-providers';
import { CommandPalette } from '@/components/shell/CommandPalette';
import { RealtimeRefresher } from '@/components/providers/RealtimeRefresher';
import type { UserRole, RestaurantRecord } from '@/types/database';
import { getAuthWorkspace } from '@/lib/auth/onboarding';

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

  const { profile, restaurant, requiresOnboarding } = await getAuthWorkspace(supabase, user.id);

  if (requiresOnboarding) {
    redirect('/onboarding');
  }

  const userName = profile?.full_name ?? user.email ?? 'Staff';
  const userRole = (profile?.role ?? 'guest') as UserRole;

  return (
    <StaffProviders initialSession={{ user, profile }} initialRestaurant={restaurant as RestaurantRecord}>
      <RealtimeRefresher />
      <div className="min-h-screen flex bg-background text-foreground">
        {/* Sidebar is persistent on the left */}
        <StaffSidebar />
        
        {/* Main content area */}
        <div className="flex-1 flex flex-col overflow-hidden relative">
          <StaffHeader
            userName={userName}
            userRole={userRole}
          />
          <Workspace>
            {children}
          </Workspace>
        </div>
      </div>
      <CommandPalette />
    </StaffProviders>
  );
}
