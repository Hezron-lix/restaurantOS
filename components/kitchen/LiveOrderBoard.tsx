"use client";

import { useTransition, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle2, ChevronRight, Utensils } from "lucide-react";
import { toast } from "sonner";
import { updateOrderStatusAction } from "@/app/actions/orders";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  status: string;
  notes: string | null;
}

interface Order {
  id: string;
  status: string;
  created_at: string;
  special_instructions: string | null;
  table_number?: number;
  items: OrderItem[];
}

export function LiveOrderBoard({ initialOrders }: { initialOrders: Order[] }) {
  const [isPending, startTransition] = useTransition();
  const [now, setNow] = useState(new Date());
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const router = useRouter();

  useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Update timers every minute
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // Optimistic UI update
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));

    startTransition(async () => {
      try {
        await updateOrderStatusAction(orderId, newStatus);
        toast.success(`Order bumped to ${newStatus}`);
        router.refresh();
      } catch {
        toast.error("Failed to update order status");
        setOrders(initialOrders);
      }
    });
  };

  const getElapsedTime = (createdAt: string) => {
    const elapsedMinutes = Math.floor((now.getTime() - new Date(createdAt).getTime()) / 60000);
    return elapsedMinutes;
  };

  const preparingOrders = orders.filter(o => o.status === "PREPARING");
  const readyOrders = orders.filter(o => o.status === "READY");

  const OrderCard = ({ order, isReady }: { order: Order, isReady?: boolean }) => {
    const elapsed = getElapsedTime(order.created_at);
    const isUrgent = !isReady && elapsed > 15;
    
    return (
      <GlassCard className={cn(
        "flex flex-col h-full border transition-all duration-300 relative overflow-hidden",
        isReady ? "border-emerald-500/30 bg-emerald-500/5" : (isUrgent ? "border-orange-500/50 bg-orange-500/5" : "border-white/10 bg-zinc-900/50"),
        !isReady && "animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"
      )}>
        <div className={cn(
          "px-4 py-3 border-b flex justify-between items-center",
          isReady ? "border-emerald-500/20 bg-emerald-500/10" : (isUrgent ? "border-orange-500/30 bg-orange-500/20" : "border-white/10 bg-zinc-800/50")
        )}>
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg",
              isReady ? "bg-emerald-500 text-zinc-950" : (isUrgent ? "bg-orange-500 text-zinc-950" : "bg-brand text-zinc-950")
            )}>
              {order.table_number ? `T${order.table_number}` : '#'}
            </div>
            <div>
              <p className="font-bold text-zinc-100">{order.id.slice(0, 6).toUpperCase()}</p>
              <div className="flex items-center gap-1 text-xs text-zinc-400 font-medium">
                <Clock className="w-3 h-3" />
                <span className={cn(isUrgent && !isReady && "text-orange-400 font-bold")}>{elapsed} min</span>
              </div>
            </div>
          </div>
          {isReady && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
        </div>
        
        <div className="flex-1 p-4 overflow-y-auto space-y-3">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-start border-b border-white/5 pb-2 last:border-0">
              <div className="flex gap-2">
                <span className="font-bold text-brand">{item.quantity}x</span>
                <div>
                  <p className="font-medium text-zinc-200">{item.name}</p>
                  {item.notes && <p className="text-xs text-orange-300 mt-1 italic">&quot;{item.notes}&quot;</p>}
                </div>
              </div>
            </div>
          ))}
          {order.special_instructions && (
            <div className="mt-4 p-2 bg-orange-500/10 border border-orange-500/20 rounded text-sm text-orange-200">
              <span className="font-bold uppercase text-xs block mb-1">Ticket Note:</span>
              {order.special_instructions}
            </div>
          )}
        </div>
        
        <div className="p-3 border-t border-white/5 bg-zinc-900/30">
          {!isReady ? (
            <Button 
              className="w-full bg-brand text-zinc-950 hover:bg-brand/90 py-6 text-lg font-bold"
              onClick={() => handleUpdateStatus(order.id, "READY")}
              disabled={isPending}
            >
              Mark Ready <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          ) : (
            <Button 
              className="w-full bg-emerald-500 text-zinc-950 hover:bg-emerald-600 py-6 text-lg font-bold"
              onClick={() => handleUpdateStatus(order.id, "SERVED")}
              disabled={isPending}
            >
              Order Picked Up <Utensils className="w-5 h-5 ml-2" />
            </Button>
          )}
        </div>
      </GlassCard>
    );
  };

  return (
    <div className="flex h-full gap-6 overflow-x-auto pb-4 scrollbar-hide">
      {/* Preparing Column */}
      <div className="flex-none w-[350px] md:w-[400px] flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-zinc-900/50 flex justify-between items-center">
          <h2 className="font-bold text-lg text-zinc-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand"></span>
            Preparing
          </h2>
          <span className="px-2 py-1 bg-zinc-800 text-zinc-300 text-xs font-bold rounded-full">
            {preparingOrders.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {preparingOrders.map(order => (
              <motion.div 
                layout
                key={order.id} 
                initial={{ opacity: 0, x: -50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                className="h-[400px]"
              >
                <OrderCard order={order} />
              </motion.div>
            ))}
          </AnimatePresence>
          {preparingOrders.length === 0 && (
            <div className="h-full flex items-center justify-center text-zinc-500">
              No orders preparing
            </div>
          )}
        </div>
      </div>

      {/* Ready Column */}
      <div className="flex-none w-[350px] md:w-[400px] flex flex-col h-full bg-zinc-950/50 rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-4 border-b border-white/10 bg-emerald-950/30 flex justify-between items-center">
          <h2 className="font-bold text-lg text-emerald-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Ready to Serve
          </h2>
          <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-bold rounded-full">
            {readyOrders.length}
          </span>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {readyOrders.map(order => (
              <motion.div 
                layout
                key={order.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95, transition: { duration: 0.2 } }}
                className="h-[400px]"
              >
                <OrderCard order={order} isReady={true} />
              </motion.div>
            ))}
          </AnimatePresence>
          {readyOrders.length === 0 && (
            <div className="h-full flex items-center justify-center text-zinc-500">
              No orders waiting
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
