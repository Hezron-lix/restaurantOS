"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface NavbarProps extends HTMLMotionProps<"nav"> {
  children?: React.ReactNode;
}

export function Navbar({ className, children, ...props }: NavbarProps) {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'sticky top-0 z-50 flex h-14 w-full items-center px-4 md:px-6',
        'border-b border-border/60 bg-background/80 backdrop-blur-md',
        className
      )}
      {...props}
    >
      <div className="flex w-full max-w-screen-2xl mx-auto items-center justify-between">
        {children}
      </div>
    </motion.nav>
  );
}

export function NavbarBrand({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-2 font-bold tracking-tight', className)}>
      {children}
    </div>
  );
}

export function NavbarNav({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      {children}
    </div>
  );
}
