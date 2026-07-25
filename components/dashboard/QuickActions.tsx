"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { PlusCircle, Grid2x2, ChefHat, Package, Users } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const ACTIONS = [
  { label: "New Order", icon: PlusCircle, href: "/tables", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { label: "Manage Tables", icon: Grid2x2, href: "/tables", color: "text-blue-400", bg: "bg-blue-400/10" },
  { label: "Kitchen Display", icon: ChefHat, href: "/kitchen", color: "text-orange-400", bg: "bg-orange-400/10" },
  { label: "Inventory", icon: Package, href: "/inventory", color: "text-purple-400", bg: "bg-purple-400/10" },
  { label: "Customers", icon: Users, href: "/customers", color: "text-pink-400", bg: "bg-pink-400/10" },
];

export function QuickActions() {
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
      </div>
    </GlassCard>
  );
}
