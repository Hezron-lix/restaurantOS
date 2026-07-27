"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useRestaurant } from "@/components/providers/staff-providers";
import { createClient } from "@/lib/supabase/client";

export function RealtimeRefresher() {
  const router = useRouter();
  const { restaurant } = useRestaurant();
  const supabase = createClient();

  useEffect(() => {
    if (!restaurant?.id) return;

    // Listen to changes on tables, orders, and restaurant_activities
    const channel = supabase
      .channel('restaurant-live-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `restaurant_id=eq.${restaurant.id}`,
        },
        () => {
          router.refresh();
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tables',
          filter: `restaurant_id=eq.${restaurant.id}`,
        },
        () => {
          router.refresh();
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'restaurant_activities',
          filter: `restaurant_id=eq.${restaurant.id}`,
        },
        () => {
          router.refresh();
        }
      )
      .subscribe((status: string) => {
        // Silent subscription
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurant?.id, router, supabase]);

  return null; // Silent background component
}
