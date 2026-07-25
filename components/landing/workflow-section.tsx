"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerContainer, staggerItem, hoverLift } from "@/lib/motion";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  CalendarDays, 
  Smartphone, 
  ChefHat, 
  ConciergeBell, 
  CreditCard, 
  LineChart, 
  Sparkles,
  ArrowRight
} from "lucide-react";

const workflowSteps = [
  { id: 1, title: "Customer", icon: Users, color: "text-blue-400", bg: "bg-blue-400/10" },
  { id: 2, title: "Reservation", icon: CalendarDays, color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { id: 3, title: "QR Menu", icon: Smartphone, color: "text-purple-400", bg: "bg-purple-400/10" },
  { id: 4, title: "Kitchen", icon: ChefHat, color: "text-amber-400", bg: "bg-amber-400/10" },
  { id: 5, title: "Waiter", icon: ConciergeBell, color: "text-rose-400", bg: "bg-rose-400/10" },
  { id: 6, title: "Cashier", icon: CreditCard, color: "text-teal-400", bg: "bg-teal-400/10" },
  { id: 7, title: "Manager", icon: LineChart, color: "text-indigo-400", bg: "bg-indigo-400/10" },
  { id: 8, title: "AI Insights", icon: Sparkles, color: "text-brand", bg: "bg-brand/10" },
];

export function WorkflowSection() {
  return (
    <section id="workflow" className="py-24 relative">
      <div className="container mx-auto max-w-6xl px-4 md:px-8">
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            The Complete Flow
          </h2>
          <p className="text-muted-foreground text-lg">
            A seamless journey from the moment a customer books a table to the intelligent insights generated after they leave.
          </p>
        </motion.div>

        <motion.div 
          variants={staggerContainer}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-50px" }}
          className="relative max-w-5xl mx-auto"
        >
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-1/2 z-0" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 md:gap-2 relative z-10">
            {workflowSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.id} variants={staggerItem} className="relative group">
                  <motion.div {...hoverLift}>
                    <Card className="flex flex-col items-center justify-center p-4 h-32 surface-card surface-hover border-border/50">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${step.bg}`}>
                        <Icon className={`size-6 ${step.color}`} />
                      </div>
                      <span className="text-xs font-medium text-foreground text-center">
                        {step.title}
                      </span>
                    </Card>
                  </motion.div>
                  {/* Mobile connecting arrow */}
                  {index < workflowSteps.length - 1 && (
                    <div className="md:hidden absolute -right-2 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 text-border">
                      <ArrowRight className="size-4" />
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
