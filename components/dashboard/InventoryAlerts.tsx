"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Package, CheckCircle2 } from "lucide-react";

export function InventoryAlerts() {
  return (
    <GlassCard className="h-full p-6 flex flex-col justify-between hover:bg-white/5 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-zinc-400">Inventory Alerts</span>
          <span className="px-1.5 py-0.5 rounded-md bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider">
            Demo
          </span>
        </div>
        <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
          <Package className="w-4 h-4" />
        </div>
      </div>

      <div className="flex flex-col items-center justify-center py-2 text-center my-auto">
        <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-2">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <p className="text-sm font-semibold text-zinc-200">Inventory Healthy</p>
        <p className="text-xs text-zinc-500 mt-0.5">All stock levels optimal</p>
      </div>
    </GlassCard>
  );
}
