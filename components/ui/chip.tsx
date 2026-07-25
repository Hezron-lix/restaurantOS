"use client";

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

const chipVariants = cva(
  'inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary/10 text-primary hover:bg-primary/20',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        outline: 'text-foreground',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface ChipProps
  extends HTMLMotionProps<"div">,
    VariantProps<typeof chipVariants> {}

function Chip({ className, variant, ...props }: ChipProps) {
  return (
    <motion.div
      whileTap={{ scale: 0.95 }}
      className={cn(chipVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Chip, chipVariants };
