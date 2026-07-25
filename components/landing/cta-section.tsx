"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function CtaSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto max-w-4xl px-4 md:px-8 text-center relative z-10">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="bg-card/40 border border-border/50 rounded-3xl p-8 md:p-16 backdrop-blur-sm"
        >
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">
            Ready to modernize?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Join the restaurants using RestaurantOS to reduce wait times, increase turnover, and operate with absolute clarity.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button size="lg" className="glow-brand group text-base h-12 px-8 w-full sm:w-auto">
              Book a Demo
              <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
            </Button>
            <Link href="/login" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="text-base h-12 px-8 w-full bg-background/50 backdrop-blur-sm hover:bg-muted/80">
                Sign In
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
