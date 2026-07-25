"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { CalendarDays } from "lucide-react";
import * as LucideIcons from "lucide-react";

export interface ActivityEntry {
  id: string;
  type: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  color_class: string | null;
  bg_class: string | null;
  created_at: string;
}

export function ActivityTimeline({ activities = [] }: { activities?: ActivityEntry[] }) {
  if (activities.length === 0) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-zinc-100">Recent Activity</h3>
          <CalendarDays className="w-4 h-4 text-zinc-500" />
        </div>
        <div className="py-8 text-center text-zinc-500 text-sm">
          No recent activity to display.
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-100">Recent Activity</h3>
        <CalendarDays className="w-4 h-4 text-zinc-500" />
      </div>

      <div className="relative border-l border-white/10 ml-3 space-y-6">
        {activities.map((activity) => {
          // Dynamically grab icon from lucide, fallback to Activity
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const Icon = (LucideIcons as any)[activity.icon_name || "Activity"] || LucideIcons.Activity;
          
          return (
            <div key={activity.id} className="relative pl-6">
              <div className={`absolute -left-3.5 top-0 w-7 h-7 rounded-full flex items-center justify-center border border-zinc-950 ${activity.bg_class}`}>
                <Icon className={`w-3.5 h-3.5 ${activity.color_class}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-zinc-200">{activity.title}</p>
                <p className="text-xs text-zinc-500 mt-1">{activity.description}</p>
                <p className="text-xs text-zinc-600 mt-2">
                  {new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(activity.created_at))}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}
