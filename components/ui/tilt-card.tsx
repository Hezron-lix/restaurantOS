"use client";

import React, { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { cn } from "@/lib/utils";

interface TiltProps {
  children: React.ReactNode;
  rotationFactor?: number;
  isReverse?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export function Tilt({
  children,
  rotationFactor = 15,
  isReverse = false,
  className,
  style,
}: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const rotateX = useTransform(
    springY,
    [-0.5, 0.5],
    isReverse ? [rotationFactor, -rotationFactor] : [-rotationFactor, rotationFactor]
  );
  const rotateY = useTransform(
    springX,
    [-0.5, 0.5],
    isReverse ? [-rotationFactor, rotationFactor] : [rotationFactor, -rotationFactor]
  );

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        ...style,
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
}
