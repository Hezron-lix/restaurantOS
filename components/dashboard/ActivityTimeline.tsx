"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { useRestaurant } from "@/components/providers/staff-providers";
import { useAuth } from "@/components/providers/staff-providers";
import { CalendarDays, Store, UserPlus } from "lucide-react";

export function ActivityTimeline() {
  const { restaurant } = useRestaurant();
  const { profile } = useAuth();
  
  if (!restaurant || !profile) return null;

  const activities = [
    {
      id: "login",
      type: "login",
      title: "User Session Started",
      description: `${profile.full_name} logged in.`,
      icon: UserPlus,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
      date: new Date(), // Simulating just now
    },
    {
      id: "created",
      type: "system",
      title: "Restaurant Created",
      description: `${restaurant.name} was successfully registered on RestaurantOS.`,
      icon: Store,
      color: "text-brand",
      bg: "bg-brand/10",
      date: new Date(restaurant.created_at),
    }
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-100">Recent Activity</h3>
        <CalendarDays className="w-4 h-4 text-zinc-500" />
      </div>

      <div className="relative border-l border-white/10 ml-3 space-y-6">
        {activities.map((activity) => {
          const Icon = activity.icon;
          return (
            <div key={activity.id} className="relative pl-6">
              <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full flex items-center justify-center border border-zinc-950 ${activity.bg}`}>
                <Icon className={`w-3.5 h-3.5 ${activity.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{activity.title}</p>
                <p className="text-xs text-zinc-500 mt-1">{activity.description}</p>
                <p className="text-xs text-zinc-600 mt-2">
                  {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(activity.date)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
