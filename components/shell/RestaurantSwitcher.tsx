"use client";

import { useState, useRef, useEffect } from "react";
import { Store, ChevronDown, Check } from "lucide-react";
import { useRestaurant } from "@/components/providers/staff-providers";
import { cn } from "@/lib/utils";

export function RestaurantSwitcher() {
  const { restaurant } = useRestaurant();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 transition-colors touch-target",
          "bg-surface-card hover:bg-surface-hover text-text-primary",
          isOpen && "bg-surface-hover border-border"
        )}
      >
        <Store className="h-4 w-4 text-brand" />
        <span className="text-xs font-semibold truncate max-w-[120px] sm:max-w-[200px]">
          {restaurant?.name || "No Restaurant"}
        </span>
        <ChevronDown className="h-3 w-3 text-text-muted ml-1 opacity-70" />
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-56 bg-zinc-950 border border-border/60 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-2 flex flex-col gap-1">
            <span className="px-2 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Active Location
            </span>
            {restaurant && (
              <button
                className={cn(
                  "flex items-center justify-between px-2 py-2 text-sm rounded-md transition-colors text-left",
                  "bg-brand/10 text-brand"
                )}
              >
                <span className="font-medium truncate pr-2">{restaurant.name}</span>
                <Check className="h-4 w-4 flex-shrink-0" />
              </button>
            )}
            
            {/* Future multiple locations can be rendered here */}
            
          </div>
        </div>
      )}
    </div>
  );
}
