import { SupabaseClient } from '@supabase/supabase-js';
import type { UserRole, RestaurantRecord } from '@/types/database';

export interface AuthWorkspace {
  profile: {
    full_name: string | null;
    role: UserRole;
    restaurant_id: string | null;
  } | null;
  restaurant: RestaurantRecord | null;
  requiresOnboarding: boolean;
}

export async function getAuthWorkspace(supabase: SupabaseClient, userId: string): Promise<AuthWorkspace> {
  // Fetch profile for display name, role, and restaurant_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, role, restaurant_id')
    .eq('id', userId)
    .single();

  // If the user has no restaurant_id, they haven't been assigned to a restaurant.
  if (!profile?.restaurant_id) {
    return {
      profile: profile as any,
      restaurant: null,
      requiresOnboarding: true,
    };
  }

  // Fetch the restaurant
  const { data: restaurant } = await supabase
    .from('restaurants')
    .select('*')
    .eq('id', profile.restaurant_id)
    .single();

  // Failsafe in case restaurant was deleted but profile wasn't updated
  if (!restaurant) {
    return {
      profile: profile as any,
      restaurant: null,
      requiresOnboarding: true,
    };
  }

  return {
    profile: profile as any,
    restaurant: restaurant as RestaurantRecord,
    requiresOnboarding: false,
  };
}
