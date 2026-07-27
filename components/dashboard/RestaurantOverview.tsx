"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { useRestaurant } from "@/components/providers/staff-providers";
import { Store, MapPin, Phone, Clock } from "lucide-react";

export function RestaurantOverview() {
  const { restaurant } = useRestaurant();

  if (!restaurant) return null;

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
          <Store className="w-6 h-6 text-brand" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-100 leading-tight">{restaurant.name}</h3>
          <p className="text-sm text-zinc-400">Primary Location</p>
        </div>
      </div>

      <div className="space-y-4 text-sm">
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-zinc-500 mt-0.5 flex-shrink-0" />
          <span className="text-zinc-300">{restaurant.address || "No address provided"} <br/> {restaurant.city}, {restaurant.country}</span>
        </div>
        
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span className="text-zinc-300">{restaurant.phone || "No phone provided"}</span>
        </div>
        

        
        <div className="flex items-center gap-3">
          <Clock className="w-4 h-4 text-zinc-500 flex-shrink-0" />
          <span className="text-emerald-400 font-medium">Currently Open</span>
        </div>
      </div>
    </GlassCard>
  );
}
