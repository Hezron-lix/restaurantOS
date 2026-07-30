"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  formatFn,
}: {
  value: number;
  direction?: "up" | "down";
  className?: string;
  delay?: number;
  formatFn?: (value: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // Initialise at the correct value so the span is never blank on mount.
  const motionValue = useMotionValue(value);
  // Track the previous value so we only animate real deltas, not remounts.
  const prevValueRef = useRef(value);

  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  });

  // Write the current value to the DOM synchronously before paint — no blank frame.
  useLayoutEffect(() => {
    if (ref.current) {
      const display = formatFn
        ? formatFn(value)
        : Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
      ref.current.textContent = display;
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- intentionally runs once on mount only

  // Animate only when the value actually changes (not on remounts/refreshes).
  useEffect(() => {
    if (value === prevValueRef.current) return;
    const target = direction === "down"
      ? prevValueRef.current - (prevValueRef.current - value)
      : value;
    prevValueRef.current = value;
    const timer = setTimeout(() => motionValue.set(target), delay * 1000);
    return () => clearTimeout(timer);
  }, [value, direction, delay, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = formatFn
          ? formatFn(latest)
          : Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(latest);
      }
    });
  }, [springValue, formatFn]);

  return <span className={className} ref={ref} />;
}
