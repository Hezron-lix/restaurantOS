"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { PlusCircle, Grid2x2, ChefHat, Package, Users, Zap, Loader2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import { enableDemoModeAction } from "@/app/actions/demo";
import { toast } from "sonner";
import { useRestaurant } from "@/components/providers/staff-providers";

const ACTIONS = [
  { label: "New Order", icon: PlusCircle, href: "/tables", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Manage Tables", icon: Grid2x2, href: "/tables", color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Kitchen Display", icon: ChefHat, href: "/kitchen", color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Inventory", icon: Package, href: "/inventory", color: "text-purple-400", bg: "bg-purple-400/10" },
  { label: "Customers", icon: Users, href: "/customers", color: "text-pink-400", bg: "bg-pink-400/10" },
];

export function QuickActions() {
  const [isPending, startTransition] = useTransition();
  const { restaurant } = useRestaurant();

  const handleDemoMode = () => {
    if (!restaurant) return;
    startTransition(async () => {
      try {
        await enableDemoModeAction(restaurant.id);
        toast.success("Demo Mode Activated! Reality warped.");
      } catch {
        toast.error("Failed to activate Demo Mode.");
      }
    });
  };

  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ACTIONS.map((action, i) => (
          <Link href={action.href} key={i}>
            <div className="flex items-center gap-3 p-3 rounded-lg border border-white/5 bg-zinc-900/50 hover:bg-zinc-800/80 transition-all group">
              <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105", action.bg, action.color)}>
                <action.icon className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-zinc-200 group-hover:text-white">{action.label}</span>
            </div>
          </Link>
        ))}
        
        {/* Demo Mode Button */}
        <button onClick={handleDemoMode} disabled={isPending} className="flex items-center gap-3 p-3 rounded-lg border border-brand/30 bg-brand/5 hover:bg-brand/10 transition-all group active:scale-95 text-left">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105 bg-brand/20 text-brand relative overflow-hidden">
             {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
          </div>
          <span className="text-sm font-bold text-brand group-hover:text-brand">Activate Demo Mode</span>
        </button>
      </div>
    </GlassCard>
  );
}
