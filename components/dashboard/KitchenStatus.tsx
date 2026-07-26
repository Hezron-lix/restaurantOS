"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { ChefHat } from "lucide-react";

export function KitchenStatus({ activeTicketsCount = 0 }: { activeTicketsCount?: number }) {
  return (
    <GlassCard className="p-6 flex items-center justify-between bg-gradient-to-br from-orange-950/20 to-zinc-950 border-orange-900/20">
      <div>
        <h3 className="text-lg font-semibold text-zinc-100 mb-1">Kitchen Status</h3>
        <p className="text-zinc-400 text-sm">
          {activeTicketsCount > 0 
            ? `${activeTicketsCount} active ticket${activeTicketsCount > 1 ? 's' : ''} in kitchen`
            : "No active tickets."}
        </p>
      </div>
      <div className="w-12 h-12 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
        <ChefHat className="w-6 h-6 text-orange-400" />
      </div>
    </GlassCard>
  );
}
