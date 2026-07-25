/**
 * EmptyState — Standardized empty data state for all 12 screens.
 *
 * Renders an illustrative icon, informative title, reassuring subtitle,
 * and an optional call-to-action button.
 */

import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  /** compact — for use inside cards/panels; full — for full-screen use */
  size?: 'compact' | 'full';
}

export function EmptyState({
  icon: Icon,
  title,
  subtitle,
  action,
  className,
  size = 'full',
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center',
        size === 'full'    ? 'py-20 px-6' : 'py-10 px-4',
        className,
      )}
    >
      {/* Icon container */}
      <div className={cn(
        'rounded-2xl bg-surface-hover border border-border/50 flex items-center justify-center mb-5',
        size === 'full' ? 'h-20 w-20' : 'h-14 w-14',
      )}>
        <Icon
          className={cn(
            'text-text-muted',
            size === 'full' ? 'h-9 w-9' : 'h-6 w-6',
          )}
          strokeWidth={1.5}
        />
      </div>

      {/* Title */}
      <h3 className={cn(
        'font-semibold text-text-primary mb-2',
        size === 'full' ? 'text-lg' : 'text-base',
      )}>
        {title}
      </h3>

      {/* Subtitle */}
      {subtitle && (
        <p className={cn(
          'text-text-muted max-w-sm leading-relaxed',
          size === 'full' ? 'text-sm' : 'text-xs',
        )}>
          {subtitle}
        </p>
      )}

      {/* Optional CTA */}
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'mt-5 rounded-xl bg-brand text-white font-semibold transition-all',
            'hover:bg-brand-warm active:scale-95',
            size === 'full' ? 'px-6 py-2.5 text-sm' : 'px-4 py-2 text-xs',
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
