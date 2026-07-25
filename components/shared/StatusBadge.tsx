/**
 * StatusBadge — Single source of truth for all operational status rendering.
 *
 * Maps TableStatus, OrderStatus, and ReservationStatus to the
 * correct operational signal color tokens from DESIGN_TOKENS.md.
 * Never repeat status-to-color mappings elsewhere in the codebase.
 */

import { cn } from '@/lib/utils';
import type { TableStatus, OrderStatus, ReservationStatus } from '@/types/database';

type AnyStatus = TableStatus | OrderStatus | ReservationStatus;

interface StatusBadgeProps {
  status: AnyStatus;
  className?: string;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  // Table statuses
  AVAILABLE:  { label: 'Available',  classes: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/60' },
  RESERVED:   { label: 'Reserved',   classes: 'bg-purple-950/60 text-purple-400 border-purple-500/60' },
  SEATED:     { label: 'Seated',     classes: 'bg-blue-950/60 text-blue-400 border-blue-500/60' },
  DIRTY:      { label: 'Needs Clean',classes: 'bg-slate-800/80 text-slate-400 border-slate-600/60' },

  // Order statuses
  PENDING:    { label: 'Pending',    classes: 'bg-slate-800/80 text-slate-300 border-slate-600/60' },
  PLACED:     { label: 'Placed',     classes: 'bg-blue-950/60 text-blue-300 border-blue-500/60' },
  PREPARING:  { label: 'Preparing',  classes: 'bg-amber-950/60 text-amber-300 border-amber-500/60' },
  READY:      { label: 'Ready',      classes: 'bg-red-950/60 text-red-400 border-red-500/60' },
  SERVED:     { label: 'Served',     classes: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/60' },
  PAID:       { label: 'Paid',       classes: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/60' },
  CANCELLED:  { label: 'Cancelled',  classes: 'bg-slate-800/80 text-slate-500 border-slate-700/60 line-through' },

  // Reservation statuses
  CONFIRMED:  { label: 'Confirmed',  classes: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/60' },
  NO_SHOW:    { label: 'No Show',    classes: 'bg-orange-950/60 text-orange-400 border-orange-500/60' },
  COMPLETED:  { label: 'Completed',  classes: 'bg-slate-800/80 text-slate-400 border-slate-600/60' },
};

export function StatusBadge({ status, className, size = 'sm' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    classes: 'bg-slate-800/80 text-slate-400 border-slate-600/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center border font-semibold uppercase tracking-wider rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-3 py-1 text-xs',
        config.classes,
        className,
      )}
    >
      {config.label}
    </span>
  );
}
