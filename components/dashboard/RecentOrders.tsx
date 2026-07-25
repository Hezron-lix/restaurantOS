"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { Receipt } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Order {
  id: string;
  table_number?: number;
  status: string;
  total_cents: number;
  created_at: string;
}

export function RecentOrders({ orders = [] }: { orders?: Order[] }) {
  return (
    <GlassCard className="p-6 h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-zinc-100">Recent Orders</h3>
        <Link href="/orders">
          <Button variant="ghost" className="text-xs h-8 text-brand hover:text-brand hover:bg-brand/10">
            View All
          </Button>
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
          <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-3">
            <Receipt className="w-5 h-5 text-zinc-500" />
          </div>
          <p className="text-zinc-300 font-medium mb-1">No active orders</p>
          <p className="text-zinc-500 text-sm max-w-[200px]">When you start creating orders, they will appear here.</p>
          
          <Link href="/tables" className="mt-4">
            <Button variant="outline" className="border-white/10 hover:bg-white/5">
              Open a Table
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
          {orders.map(order => (
            <div key={order.id} className="flex items-center justify-between p-3 rounded-lg border border-white/5 bg-zinc-900/30 hover:bg-zinc-800/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold">
                  {order.table_number ? `T${order.table_number}` : '#'}
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-200">
                    Order {order.id.slice(0, 6)}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {new Intl.DateTimeFormat('en-US', { timeStyle: 'short' }).format(new Date(order.created_at))} • {order.status}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-emerald-400">
                  ${(order.total_cents / 100).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
