"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface SectionProps extends HTMLMotionProps<"section"> {
  children?: React.ReactNode;
}

export function Section({ className, children, ...props }: SectionProps) {
  return (
    <motion.section
      className={cn('py-12 md:py-16 lg:py-24', className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}
