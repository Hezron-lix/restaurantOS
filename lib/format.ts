/**
 * RestaurantOS — Shared Formatting Utilities
 *
 * Centralizes all data display transforms so raw values never leak into JSX.
 * Reference: docs/design/DESIGN_TOKENS.md — Financial Display Rule
 */

// ─────────────────────────────────────────────────────────────────────────────
// Currency
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts integer cents to a formatted USD currency string.
 * RULE: This is the ONLY place in the codebase that may divide cents by 100.
 *
 * @example formatCurrency(1450) → "$14.50"
 * @example formatCurrency(0)    → "$0.00"
 */
export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Formats cents as a compact number for KPI banners (no symbol).
 * @example formatCurrencyCompact(125000) → "$1.25K"
 */
export function formatCurrencyCompact(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(cents / 100);
}

// ─────────────────────────────────────────────────────────────────────────────
// Time & Duration
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a relative time string from an ISO timestamp.
 * @example formatRelativeTime("2026-07-25T12:00:00Z") → "2m ago"
 */
export function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diffMs = now - then;
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60)  return `${diffSeconds}s ago`;
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60)  return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24)    return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

/**
 * Returns elapsed minutes since an ISO timestamp.
 * Used by KDS timer clocks.
 */
export function elapsedMinutes(iso: string): number {
  return Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
}

/**
 * Formats an integer minute count into a human-readable duration string.
 * @example formatDuration(15)  → "15m"
 * @example formatDuration(90)  → "1h 30m"
 * @example formatDuration(120) → "2h"
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/**
 * Formats an ISO timestamp to a localized time string (e.g. "7:45 PM").
 */
export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Formats an ISO timestamp to a short date string (e.g. "Jul 25").
 */
export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// KDS Urgency Helpers
// ─────────────────────────────────────────────────────────────────────────────

export type KdsUrgencyLevel = 'normal' | 'warning' | 'critical';

/**
 * Returns the urgency level for a KDS order ticket based on elapsed minutes.
 * normal:   < 10 minutes (emerald green)
 * warning:  10–17 minutes (amber)
 * critical: ≥ 18 minutes (pulsing crimson)
 */
export function getKdsUrgency(placedAtIso: string): KdsUrgencyLevel {
  const elapsed = elapsedMinutes(placedAtIso);
  if (elapsed < 10) return 'normal';
  if (elapsed < 18) return 'warning';
  return 'critical';
}
