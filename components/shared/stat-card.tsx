import * as React from 'react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export interface StatCardProps extends React.ComponentPropsWithoutRef<typeof Card> {
  label: string;
  value: React.ReactNode;
  description?: string;
  icon?: React.ReactNode;
}

export function StatCard({ label, value, description, icon, className, ...props }: StatCardProps) {
  return (
    <Card className={cn('bg-surface-card border-border/60', className)} {...props}>
      <CardContent className="flex items-center gap-4 p-4 md:p-6">
        {icon && (
          <div className="flex items-center justify-center h-12 w-12 rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-muted-foreground truncate">{label}</p>
          <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
          {description && (
            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
