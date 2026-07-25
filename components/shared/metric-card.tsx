import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface MetricCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  title: string;
  value: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: React.ReactNode;
}

export function MetricCard({ title, value, trend, icon, className, ...props }: MetricCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)} {...props}>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {trend && (
          <p className="text-xs text-muted-foreground mt-1">
            <span className={cn('mr-1', trend.value > 0 ? 'text-emerald-500' : trend.value < 0 ? 'text-red-500' : 'text-muted-foreground')}>
              {trend.value > 0 ? '+' : ''}{trend.value}%
            </span>
            {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
