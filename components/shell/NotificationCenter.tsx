"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, Info, AlertCircle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRestaurant } from "@/components/providers/staff-providers";
import { getDropdownInsights } from "@/app/actions/activity";

type Activity = {
  id: string;
  title: string;
  message: string;
  type: string;
  time: string;
};

export function NotificationCenter() {
  const { restaurant } = useRestaurant();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [activities, setActivities] = useState<Activity[]>([]);
  const [insights, setInsights] = useState<string[]>([]);
  
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

  useEffect(() => {
    if (isOpen && restaurant?.id) {
      setIsLoading(true);
      getDropdownInsights(restaurant.id).then(data => {
        setActivities(data.activities);
        setInsights(data.insights);
        setIsLoading(false);
      }).catch(err => {
        console.error("Failed to load insights", err);
        setIsLoading(false);
      });
    }
  }, [isOpen, restaurant?.id]);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hr ago`;
    return "Yesterday";
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative rounded-lg p-2 transition-colors touch-target",
          "text-text-muted hover:text-text-primary hover:bg-surface-hover",
          isOpen && "bg-surface-hover text-text-primary"
        )}
        title="Activity & Insights"
        aria-label="Activity & Insights"
      >
        <Bell className="h-5 w-5" />
        {!isOpen && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand ring-2 ring-background animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[32rem] flex flex-col bg-zinc-950 border border-border/60 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-border/50 bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Activity & Insights</h3>
          </div>
          
          <div className="overflow-y-auto flex-1 p-2 space-y-4">
            {isLoading ? (
              <div className="p-8 flex justify-center items-center">
                <Loader2 className="w-5 h-5 animate-spin text-brand" />
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">Activity</h4>
                  {activities.length === 0 ? (
                     <div className="px-2 py-4 text-center">
                       <p className="text-sm text-text-muted">No recent activity.</p>
                     </div>
                  ) : (
                    <div className="flex flex-col gap-1">
                      {activities.map((activity) => (
                        <div key={activity.id} className="flex gap-3 p-2 rounded-lg bg-white/5 opacity-80 hover:opacity-100 transition-opacity">
                          <div className="mt-0.5 flex-shrink-0">
                            {activity.type === 'warning' ? (
                              <AlertCircle className="h-4 w-4 text-orange-400" />
                            ) : (
                              <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center text-[8px]">🔵</div>
                            )}
                          </div>
                          <div className="flex-1 flex flex-col min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-sm font-medium text-text-primary truncate">
                                {activity.title}
                              </span>
                              <span className="text-[10px] text-text-muted whitespace-nowrap shrink-0">
                                {formatTimeAgo(activity.time)}
                              </span>
                            </div>
                            <span className="text-xs text-text-muted line-clamp-2 mt-0.5">
                              {activity.message}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border-t border-border/40 my-2" />

                <div className="space-y-2 pb-2">
                  <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider px-2">Insights</h4>
                  <div className="flex flex-col gap-1">
                    {insights.map((insight, idx) => (
                      <div key={idx} className="p-2 text-sm text-zinc-300">
                        {insight}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
