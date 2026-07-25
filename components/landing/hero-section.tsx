"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-32 pb-24 md:pt-48 md:pb-32">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="flex flex-col gap-8 max-w-2xl"
          >
            <motion.div variants={staggerItem}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground leading-[1.1]">
                Modern restaurant <br className="hidden md:block" />
                operations. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand to-brand-warm">
                  One platform.
                </span>
              </h1>
            </motion.div>

            <motion.div variants={staggerItem}>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg">
                Replace your fragmented tech stack with a unified operating system. 
                From QR ordering to AI insights, everything works together effortlessly.
              </p>
            </motion.div>

            <motion.div variants={staggerItem} className="flex flex-wrap items-center gap-4 pt-4">
              <Button size="lg" className="glow-brand group text-base h-12 px-8">
                Book a Demo
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Link href="#workflow">
                <Button variant="outline" size="lg" className="text-base h-12 px-8 bg-background/50 backdrop-blur-sm hover:bg-muted/80">
                  <Play className="mr-2 size-4" />
                  View Workflow
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            className="relative h-[400px] md:h-[500px] w-full rounded-2xl"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-brand/10 to-transparent rounded-3xl blur-3xl -z-10" />
            <GlassCard className="w-full h-full flex items-center justify-center border-border/50">
              <div className="text-center space-y-3">
                <div className="mx-auto w-16 h-16 rounded-full border border-dashed border-muted-foreground/50 flex items-center justify-center">
                  <span className="text-muted-foreground text-xs">3D</span>
                </div>
                <p className="text-sm text-muted-foreground font-medium">Spline Scene Placeholder</p>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
