"use client";

import { motion, useInView, Variant, Transition } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface InViewProps {
  children: React.ReactNode;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: {
    margin?: string;
    once?: boolean;
    amount?: "some" | "all" | number;
  };
  className?: string;
}

const defaultVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function InView({
  children,
  variants = defaultVariants,
  transition = { duration: 0.5, ease: "easeOut" },
  viewOptions = { once: true, margin: "-50px" },
  className,
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, {
    once: viewOptions.once,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    margin: viewOptions.margin as any,
    amount: viewOptions.amount || "some",
  });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}
