"use client";

import { useEffect, useRef } from "react";
import { useInView, useMotionValue, useSpring } from "framer-motion";

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  prefix = "",
  suffix = "",
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number; // delay in s
  prefix?: string;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(direction === "down" ? value : 0);
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  useEffect(() => {
    if (isInView) {
      setTimeout(() => {
        motionValue.set(direction === "down" ? 0 : value);
      }, delay * 1000);
    }
  }, [motionValue, isInView, delay, value, direction]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        // format logic for currency or standard
        let formattedStr = "";
        
        if (prefix === "$" || prefix === "€" || prefix === "£") {
           formattedStr = Intl.NumberFormat("en-US", {
             minimumFractionDigits: 2,
             maximumFractionDigits: 2
           }).format(latest);
        } else {
           formattedStr = Intl.NumberFormat("en-US", {
             maximumFractionDigits: 0
           }).format(latest);
        }
        
        ref.current.textContent = `${prefix}${formattedStr}${suffix}`;
      }
    });
  }, [springValue, prefix, suffix]);

  return (
    <span
      className={className}
      ref={ref}
    />
  );
}
