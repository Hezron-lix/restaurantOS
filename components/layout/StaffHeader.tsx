'use client';

/**
 * StaffHeader — Persistent top navigation bar for all staff consoles.
 *
 * Displays restaurant identity, current user context, notification bell,
 * and sign-out action. Adapts to different staff roles visually.
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, ChefHat, LogOut, User } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types/database';

const ROLE_CONFIG: Record<UserRole, { label: string; color: string }> = {
  manager:  { label: 'Manager',  color: 'bg-purple-950/60 text-purple-300 border-purple-500/50' },
  kitchen:  { label: 'Chef',     color: 'bg-orange-950/60 text-orange-300 border-orange-500/50' },
  waiter:   { label: 'Waiter',   color: 'bg-blue-950/60 text-blue-300 border-blue-500/50' },
  cashier:  { label: 'Cashier',  color: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/50' },
  guest:    { label: 'Guest',    color: 'bg-slate-800/60 text-slate-300 border-slate-500/50' },
};

interface StaffHeaderProps {
  userName: string;
  userRole: UserRole;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

export function StaffHeader({
  userName,
  userRole,
  notificationCount = 0,
  onNotificationClick,
}: StaffHeaderProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const roleConfig = ROLE_CONFIG[userRole] ?? ROLE_CONFIG.guest;

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="flex items-center justify-between h-14 px-4 md:px-6 max-w-screen-2xl mx-auto">

        {/* Brand identity */}
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-brand/10 border border-brand/30 p-1.5">
            <ChefHat className="h-5 w-5 text-brand" />
          </div>
          <div>
            <span className="text-sm font-bold text-text-primary tracking-tight">RestaurantOS</span>
            <span className="hidden md:inline text-xs text-text-muted ml-2">Operations Console</span>
          </div>
        </div>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          {/* User info */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-card border border-border/50">
            <User className="h-3.5 w-3.5 text-text-muted" />
            <span className="text-xs font-medium text-text-secondary">{userName}</span>
            <span className={cn(
              'text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full border',
              roleConfig.color,
            )}>
              {roleConfig.label}
            </span>
          </div>

          {/* Notification bell */}
          <button
            onClick={onNotificationClick}
            className={cn(
              'relative rounded-lg p-2 transition-colors touch-target',
              'text-text-muted hover:text-text-primary hover:bg-surface-hover',
            )}
            aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} unread)` : ''}`}
          >
            <Bell className="h-5 w-5" />
            {notificationCount > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 rounded-full bg-brand text-white text-[10px] font-bold flex items-center justify-center">
                {notificationCount > 9 ? '9+' : notificationCount}
              </span>
            )}
          </button>

          {/* Sign out */}
          <button
            onClick={handleSignOut}
            disabled={signingOut}
            className={cn(
              'rounded-lg p-2 transition-colors touch-target',
              'text-text-muted hover:text-red-400 hover:bg-red-950/30',
              signingOut && 'opacity-50 cursor-not-allowed',
            )}
            aria-label="Sign out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
