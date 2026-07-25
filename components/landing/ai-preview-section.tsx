"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem } from "@/lib/motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, Users } from "lucide-react";

export function AiPreviewSection() {
  return (
    <section id="ai" className="py-24 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand/5 rounded-full blur-3xl -z-10" />

      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div
            variants={fadeUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col gap-6"
          >
            <div>
              <Badge variant="outline" className="text-brand border-brand/30 bg-brand/10 mb-4 px-3 py-1">
                <Sparkles className="mr-1.5 size-3.5" />
                Coming Soon
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Operate with intelligence
              </h2>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Stop guessing. RestaurantOS uses real-time data from your floor, kitchen, and POS to predict what you need before you need it.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            {/* Mock Card 1 */}
            <motion.div variants={staggerItem}>
              <Card className="p-5 surface-card border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-md bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="size-4" />
                  </div>
                  <h4 className="font-medium text-sm">Inventory Alert</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Tomato stock is depleting 20% faster than usual.
                </p>
                <div className="text-xs font-mono text-amber-400 bg-amber-500/10 inline-block px-2 py-1 rounded">
                  Predict empty by 8:00 PM
                </div>
              </Card>
            </motion.div>

            {/* Mock Card 2 */}
            <motion.div variants={staggerItem} className="sm:mt-8">
              <Card className="p-5 surface-card border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-md bg-emerald-500/10 text-emerald-500">
                    <TrendingUp className="size-4" />
                  </div>
                  <h4 className="font-medium text-sm">Peak Hour Prediction</h4>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden flex items-end">
                    <div className="h-full w-[30%] bg-border" />
                    <div className="h-full w-[40%] bg-emerald-500" />
                    <div className="h-full w-[30%] bg-border" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Surge expected at 7:30 PM.
                  </p>
                </div>
              </Card>
            </motion.div>

            {/* Mock Card 3 */}
            <motion.div variants={staggerItem}>
              <Card className="p-5 surface-card border-border/50">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 rounded-md bg-blue-500/10 text-blue-500">
                    <Users className="size-4" />
                  </div>
                  <h4 className="font-medium text-sm">Staffing Recommendation</h4>
                </div>
                <p className="text-xs text-muted-foreground mb-3">
                  Saturday shift requires +2 kitchen staff based on local event data.
                </p>
              </Card>
            </motion.div>

            {/* Mock Card 4 */}
            <motion.div variants={staggerItem} className="sm:mt-8">
              <Card className="p-5 surface-card border-border/50 flex flex-col justify-center items-center text-center">
                <Sparkles className="size-6 text-muted-foreground/50 mb-2" />
                <span className="text-sm font-medium text-muted-foreground">
                  Continuous Learning
                </span>
              </Card>
            </motion.div>

          </motion.div>
        </div>
      </div>
    </section>
  );
}
