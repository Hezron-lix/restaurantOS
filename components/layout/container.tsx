"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface ContainerProps extends HTMLMotionProps<"div"> {
  children?: React.ReactNode;
}

export function Container({ className, children, ...props }: ContainerProps) {
  return (
    <motion.div
      className={cn('mx-auto w-full max-w-screen-xl px-4 md:px-6', className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
