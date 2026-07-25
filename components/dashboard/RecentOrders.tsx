"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function RecentOrders() {
  return (
    <GlassCard className="p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-100">Recent Orders</h3>
        <Link href="/orders">
          <Button variant="ghost" className="text-xs h-8 text-brand hover:text-brand hover:bg-brand/10">
            View All
          </Button>
        </Link>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
        <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-3">
          <Receipt className="w-5 h-5 text-zinc-500" />
        </div>
        <p className="text-zinc-300 font-medium mb-1">No active orders</p>
        <p className="text-zinc-500 text-sm max-w-[200px]">When you start creating orders, they will appear here.</p>
        
        <Link href="/orders/new" className="mt-4">
          <Button variant="outline" className="border-white/10 hover:bg-white/5">
            Create First Order
          </Button>
        </Link>
      </div>
    </GlassCard>
  );
}
