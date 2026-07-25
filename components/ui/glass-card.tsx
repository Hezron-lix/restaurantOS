"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { hoverLift } from '@/lib/motion';

export interface GlassCardProps extends HTMLMotionProps<"div"> {
  hoverable?: boolean;
}

const GlassCard = React.forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, hoverable = false, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          'rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-xl',
          'transition-colors duration-200',
          hoverable && 'hover:bg-white/10 hover:border-white/20',
          className
        )}
        {...(hoverable ? hoverLift : {})}
        {...props}
      />
    );
  }
);
GlassCard.displayName = 'GlassCard';

export { GlassCard };
