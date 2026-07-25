"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';
import { motion, type HTMLMotionProps } from 'framer-motion';

export interface SidebarProps extends HTMLMotionProps<"aside"> {
  children?: React.ReactNode;
}

export function Sidebar({ className, children, ...props }: SidebarProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        'flex h-screen w-64 flex-col border-r border-border/60 bg-surface-base',
        className
      )}
      {...props}
    >
      {children}
    </motion.aside>
  );
}

export function SidebarHeader({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex h-14 items-center px-4 border-b border-border/40', className)}>
      {children}
    </div>
  );
}

export function SidebarContent({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex-1 overflow-auto py-4', className)}>
      {children}
    </div>
  );
}

export function SidebarFooter({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('mt-auto flex items-center p-4 border-t border-border/40', className)}>
      {children}
    </div>
  );
}
