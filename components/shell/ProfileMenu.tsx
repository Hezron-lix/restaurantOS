"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, Settings, User, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/app/actions/auth";
import type { UserRole } from "@/types/database";

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  manager:  { label: 'Manager',  color: 'bg-purple-950/60 text-purple-300 border-purple-500/50' },
  kitchen:  { label: 'Chef',     color: 'bg-orange-950/60 text-orange-300 border-orange-500/50' },
  waiter:   { label: 'Waiter',   color: 'bg-blue-950/60 text-blue-300 border-blue-500/50' },
  cashier:  { label: 'Cashier',  color: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50' },
  guest:    { label: 'Guest',    color: 'bg-slate-800/60 text-slate-300 border-slate-500/50' },
};

interface ProfileMenuProps {
  userName: string;
  userRole: UserRole;
}

export function ProfileMenu({ userName, userRole }: ProfileMenuProps) {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const roleConfig = ROLE_CONFIG[userRole] ?? ROLE_CONFIG.guest;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    setSigningOut(true);
    await logoutAction();
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-surface-card border border-border/50 hover:bg-surface-hover transition-colors touch-target"
      >
        <div className="h-6 w-6 rounded-full bg-brand/20 flex items-center justify-center border border-brand/30">
          <User className="h-3.5 w-3.5 text-brand" />
        </div>
        <div className="hidden sm:flex flex-col items-start mr-1">
          <span className="text-[11px] font-semibold text-text-primary leading-none mb-1">{userName}</span>
          <span className={cn(
            'text-[9px] font-bold uppercase tracking-wider px-1 rounded-sm border leading-tight',
            roleConfig.color
          )}>
            {roleConfig.label}
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-zinc-950 border border-border/60 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="p-3 border-b border-border/50 bg-zinc-900/50">
            <p className="text-sm font-medium text-text-primary">{userName}</p>
            <p className="text-xs text-text-muted mt-0.5">{roleConfig.label}</p>
          </div>
          
          <div className="p-1.5">
            <div className="px-2 py-1.5 text-xs font-semibold text-text-muted uppercase tracking-wider">
              Theme
            </div>
            <div className="flex items-center justify-between px-1 mb-1">
              <button
                disabled
                className="p-1.5 rounded-md flex-1 flex justify-center text-zinc-600 opacity-40 cursor-not-allowed"
                title="Light mode disabled"
              >
                <Sun className="h-4 w-4" />
              </button>
              <button
                disabled
                className="p-1.5 rounded-md flex-1 flex justify-center text-zinc-600 opacity-40 cursor-not-allowed"
                title="System theme disabled"
              >
                <Monitor className="h-4 w-4" />
              </button>
              <button onClick={() => setTheme('dark')} className={cn("p-1.5 rounded-md flex-1 flex justify-center text-zinc-400 hover:text-zinc-100 hover:bg-white/5", theme === 'dark' && "text-brand bg-brand/10")}>
                <Moon className="h-4 w-4" />
              </button>
            </div>
          </div>

          <div className="p-1.5 border-t border-border/50">
            <button className="w-full flex items-center gap-2 px-2 py-2 text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 rounded-md transition-colors">
              <Settings className="h-4 w-4" />
              Account Settings
            </button>
            <button 
              onClick={handleSignOut}
              disabled={signingOut}
              className="w-full flex items-center gap-2 px-2 py-2 text-sm text-red-400 hover:bg-red-950/30 rounded-md transition-colors mt-0.5"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? "Signing out..." : "Sign Out"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
