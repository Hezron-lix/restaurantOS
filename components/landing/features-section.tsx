"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, hoverLift } from "@/lib/motion";
import { Card } from "@/components/ui/card";
import { 
  Smartphone, 
  MonitorPlay, 
  LayoutDashboard, 
  Calculator, 
  BarChart3, 
  BrainCircuit 
} from "lucide-react";

const features = [
  {
    title: "QR Ordering",
    description: "Frictionless digital menus. Guests order and pay from their phones, reducing wait times and increasing ticket sizes.",
    icon: Smartphone,
  },
  {
    title: "Live Kitchen Display",
    description: "Replace paper tickets with a synchronized KDS. Track preparation times and prioritize orders automatically.",
    icon: MonitorPlay,
  },
  {
    title: "Waiter Dashboard",
    description: "Real-time table status, instant kitchen alerts, and quick order modification right from a mobile device.",
    icon: LayoutDashboard,
  },
  {
    title: "Cashier POS",
    description: "Lightning-fast checkout, split bills effortlessly, and manage walk-in orders with a streamlined interface.",
    icon: Calculator,
  },
  {
    title: "Analytics",
    description: "Deep insights into sales trends, table turnover rates, and menu performance available instantly.",
    icon: BarChart3,
  },
  {
    title: "AI Insights",
    description: "Predict peak hours, optimize inventory, and get staffing recommendations powered by advanced AI.",
    icon: BrainCircuit,
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-24 bg-card/30 border-y border-border/40">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Everything you need. <br />
            <span className="text-muted-foreground">Nothing you don&apos;t.</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Purpose-built modules that communicate instantly.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={staggerItem}>
                <motion.div {...hoverLift} className="h-full">
                  <Card className="h-full p-6 surface-card surface-hover border-border/50 flex flex-col items-start text-left">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                      <Icon className="size-6 text-brand" />
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-3">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
