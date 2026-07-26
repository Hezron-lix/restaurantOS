"use client";

import { useState, useRef, useEffect } from "react";
import { Bell, CheckCircle2, AlertCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

// Placeholder types for UI structure
type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning";
  time: string;
  read: boolean;
  badge?: string;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "New Order", message: "Table 4 placed an order.", type: "info", time: "2 min ago", read: false },
  { id: "2", title: "Inventory Low", message: "Tomatoes are running low.", type: "warning", time: "1 hr ago", read: false, badge: "Demo Alert" },
  { id: "3", title: "Shift Complete", message: "Closing checklist done.", type: "success", time: "Yesterday", read: true },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
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
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand ring-2 ring-background animate-pulse" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-h-[24rem] flex flex-col bg-zinc-950 border border-border/60 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3 border-b border-border/50 bg-zinc-900/50 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-primary">Notifications</h3>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand hover:text-brand/80 font-medium transition-colors">
                Mark all read
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto flex-1 p-1.5">
            {notifications.length === 0 ? (
              <div className="p-6 text-center">
                <Bell className="h-8 w-8 text-zinc-600 mx-auto mb-2 opacity-50" />
                <p className="text-sm text-text-muted">No new notifications</p>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={cn(
                      "flex gap-3 p-2 rounded-lg transition-colors cursor-pointer",
                      notif.read ? "hover:bg-white/5 opacity-70" : "bg-brand/5 hover:bg-brand/10"
                    )}
                  >
                    <div className="mt-0.5 flex-shrink-0">
                      {notif.type === 'info' && <Info className="h-4 w-4 text-blue-400" />}
                      {notif.type === 'success' && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                      {notif.type === 'warning' && <AlertCircle className="h-4 w-4 text-orange-400" />}
                    </div>
                    <div className="flex-1 flex flex-col min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 truncate">
                          <span className={cn("text-sm font-medium truncate", notif.read ? "text-text-secondary" : "text-text-primary")}>
                            {notif.title}
                          </span>
                          {notif.badge && (
                            <span className="px-1.5 py-0.5 rounded-md bg-brand/10 text-brand text-[10px] font-bold uppercase tracking-wider shrink-0">
                              {notif.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-text-muted whitespace-nowrap shrink-0">{notif.time}</span>
                      </div>
                      <span className="text-xs text-text-muted line-clamp-2 mt-0.5">{notif.message}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
