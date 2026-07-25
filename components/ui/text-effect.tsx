/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import React from "react";

interface TextEffectProps {
  children: string;
  per?: "word" | "char";
  delay?: number;
  variants?: {
    container?: Variants;
    item?: Variants;
  };
  className?: string;
  preset?: "fade" | "blur" | "slide";
}

const defaultContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const defaultItemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const presets = {
  blur: {
    hidden: { opacity: 0, filter: "blur(8px)" },
    visible: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.6 } },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.4 } },
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
};

export function TextEffect({
  children,
  per = "word",
  delay = 0,
  variants,
  className,
  preset,
}: TextEffectProps) {
  const words = children.split(" ");
  const chars = children.split("");

  const containerVariants = variants?.container || defaultContainerVariants;
  const itemVariants =
    variants?.item || (preset ? presets[preset] : defaultItemVariants);

  // Inject delay into container visible variant
  const finalContainerVariants = {
    ...containerVariants,
    visible: {
      ...containerVariants.visible,
      transition: {
        ...(containerVariants.visible as any)?.transition,
        delayChildren: delay,
      },
    },
  };

  return (
    <motion.div
      variants={finalContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={cn("inline-block", className)}
    >
      {per === "word"
        ? words.map((word, i) => (
            <motion.span
              key={i}
              variants={itemVariants as any}
              className="inline-block mr-[0.25em]"
            >
              {word}
            </motion.span>
          ))
        : chars.map((char, i) => (
            <motion.span
              key={i}
              variants={itemVariants as any}
              className="inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
    </motion.div>
  );
}
