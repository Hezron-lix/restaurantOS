"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { DollarSign, Receipt, Grid2x2, Package } from "lucide-react";
import { useRestaurant } from "@/components/providers/staff-providers";
import { NumberTicker } from "@/components/ui/number-ticker";

interface SummaryRowProps {
  activeOrdersCount: number;
  occupiedTablesCount: number;
  totalTablesCount: number;
  revenueToday: number;
}

export function SummaryRow({ activeOrdersCount, occupiedTablesCount, totalTablesCount, revenueToday }: SummaryRowProps) {
  const { restaurant } = useRestaurant();
  const currencySymbol = restaurant?.currency === "USD" ? "$" : (restaurant?.currency || "$");

  const stats = [
    {
      title: "Revenue Today",
      value: revenueToday,
      isCurrency: true,
      icon: DollarSign,
      trend: revenueToday > 0 ? "Today's total earnings" : "No sales yet today",
    },
    {
      title: "Active Orders",
      value: activeOrdersCount,
      icon: Receipt,
      trend: activeOrdersCount > 0 ? "Currently processing" : "Start a service to track",
    },
    {
      title: "Occupied Tables",
      value: occupiedTablesCount,
      suffix: ` / ${totalTablesCount}`,
      icon: Grid2x2,
      trend: occupiedTablesCount > 0 ? `${totalTablesCount - occupiedTablesCount} tables available` : "All tables available",
    },
    {
      title: "Inventory Alerts",
      value: 0,
      icon: Package,
      trend: "Stock looks good",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <GlassCard key={i} className="p-5 flex flex-col justify-between h-32 hover:bg-white/5 transition-colors">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-zinc-400">{stat.title}</span>
              <div className="w-8 h-8 rounded-full bg-brand/10 text-brand flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-zinc-100 flex items-center">
                <NumberTicker 
                  value={stat.value as number} 
                  prefix={stat.isCurrency ? currencySymbol : ""} 
                  suffix={stat.suffix || ""}
                />
              </p>
              <p className="text-xs text-zinc-500 mt-1">{stat.trend}</p>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
