/**
 * ErrorCard — Graceful error recovery state for all screens.
 *
 * Renders a red-bordered card with a plain-language error message
 * and an optional retry action button.
 */

import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorCardProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorCard({
  message,
  onRetry,
  retryLabel = 'Try Again',
  className,
}: ErrorCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-red-500/50 bg-red-950/40 p-5',
        'flex items-start gap-4',
        className,
      )}
      role="alert"
    >
      <div className="shrink-0 rounded-lg bg-red-950/60 p-2 border border-red-500/40">
        <AlertTriangle className="h-5 w-5 text-red-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-red-300 mb-1">Something went wrong</p>
        <p className="text-xs text-red-400/80 leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className={cn(
              'mt-3 text-xs font-semibold px-4 py-1.5 rounded-lg',
              'bg-red-900/60 text-red-300 border border-red-500/40',
              'hover:bg-red-800/60 transition-colors',
            )}
          >
            {retryLabel}
          </button>
        )}
      </div>
    </div>
  );
}
