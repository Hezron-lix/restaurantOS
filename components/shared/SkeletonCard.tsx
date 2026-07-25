/**
 * SkeletonCard — CSS shimmer placeholder for loading states.
 *
 * Replaces spinning loaders. Matches the shape of the content it previews.
 * Uses the .shimmer CSS utility class defined in globals.css.
 */

import { cn } from '@/lib/utils';

interface SkeletonCardProps {
  height?: string;
  className?: string;
  /** Renders N skeleton cards stacked/gridded — use with parent grid container */
  count?: number;
}

function SingleSkeleton({ height = 'h-24', className }: { height?: string; className?: string }) {
  return (
    <div
      className={cn(
        'rounded-xl shimmer',
        height,
        className,
      )}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard({ height = 'h-24', className, count = 1 }: SkeletonCardProps) {
  if (count === 1) return <SingleSkeleton height={height} className={className} />;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SingleSkeleton key={i} height={height} className={className} />
      ))}
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Specialized Skeleton Variants
// ─────────────────────────────────────────────────────────────────────────────

/** Skeleton for a single line of text */
export function SkeletonText({ className, width = 'w-3/4' }: { className?: string; width?: string }) {
  return <div className={cn('h-4 rounded-md shimmer', width, className)} aria-hidden="true" />;
}

/** Skeleton for a KPI banner metric */
export function SkeletonKpi() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-6 space-y-3">
      <div className="h-3 w-1/3 rounded shimmer" />
      <div className="h-8 w-1/2 rounded shimmer" />
      <div className="h-3 w-2/5 rounded shimmer" />
    </div>
  );
}

/** Skeleton for a table floor card */
export function SkeletonTableCard() {
  return (
    <div className="rounded-xl border border-border/50 bg-card p-5 space-y-3 aspect-square">
      <div className="h-3 w-1/3 rounded shimmer" />
      <div className="flex-1 flex items-center justify-center">
        <div className="h-12 w-12 rounded-full shimmer" />
      </div>
      <div className="h-8 rounded-lg shimmer mt-auto" />
    </div>
  );
}
