import * as React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface LoadingSpinnerProps extends React.SVGProps<SVGSVGElement> {
  size?: 'sm' | 'default' | 'lg' | 'xl';
  variant?: 'default' | 'primary' | 'muted';
}

const sizeClasses = {
  sm: 'h-4 w-4',
  default: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
};

const variantClasses = {
  default: 'text-foreground',
  primary: 'text-primary',
  muted: 'text-muted-foreground',
};

export function LoadingSpinner({
  className,
  size = 'default',
  variant = 'primary',
  ...props
}: LoadingSpinnerProps) {
  return (
    <Loader2
      className={cn(
        'animate-spin',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export function LoadingState({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[200px]">
      <LoadingSpinner size="lg" className="mb-4 opacity-50" />
      <p className="text-sm text-muted-foreground animate-pulse">{text}</p>
    </div>
  );
}
