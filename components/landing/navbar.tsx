"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion, type Transition } from "framer-motion";
import { fadeIn, fadeInTransition } from "@/lib/motion";

export function Navbar() {
  return (
    <motion.header
      variants={fadeIn}
      initial="initial"
      animate="animate"
      transition={fadeInTransition as Transition}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md"
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-tight text-foreground">
              Restaurant<span className="text-primary">OS</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
              Sign In
            </Button>
          </Link>
          <Link href="/register">
            <Button size="sm" className="glow-brand">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </motion.header>
  );
}
