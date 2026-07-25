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
    .select('full_name, role, restaurant_id')
    .eq('id', user.id)
    .single();

  const userName = profile?.full_name ?? user.email ?? 'Staff';
  const userRole = (profile?.role ?? 'guest') as UserRole;

  // Restaurant Check
  // If the user has no restaurant_id, they haven't been assigned to a restaurant.
  if (!profile?.restaurant_id) {
    redirect('/onboarding');
  }

  // Fetch the restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', profile.restaurant_id)
    .single();

  if (!restaurant) {
    // Failsafe in case restaurant was deleted but profile wasn't updated
    redirect('/onboarding');
  }

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
