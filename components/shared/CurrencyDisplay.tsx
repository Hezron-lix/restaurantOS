/**
 * CurrencyDisplay — Converts integer cents to formatted USD currency.
 *
 * RULE: This is the ONLY component permitted to render monetary values.
 * No raw cents division may appear anywhere else in JSX.
 */

import { cn } from '@/lib/utils';
import { formatCurrency } from '@/lib/format';

interface CurrencyDisplayProps {
  /** Integer cents (e.g. 1450 for $14.50). Never pass dollars. */
  cents: number;
  className?: string;
  /** If true, applies tabular-nums for POS invoice column alignment */
  tabular?: boolean;
}

export function CurrencyDisplay({ cents, className, tabular = false }: CurrencyDisplayProps) {
  return (
    <span
      className={cn(
        'font-mono',
        tabular && 'tabular-nums',
        className,
      )}
    >
      {formatCurrency(cents)}
    </span>
  );
}
