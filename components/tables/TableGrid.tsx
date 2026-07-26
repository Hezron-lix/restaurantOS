"use client";

import { useTransition } from "react";
import { openTableAction, clearTableAction } from "@/app/actions/orders";
import { GlassCard } from "@/components/ui/glass-card";
import { Users, Loader2, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: "AVAILABLE" | "SEATED" | "PREPARING" | "READY" | "DIRTY" | "RESERVED" | "CLEANING";
}

export function TableGrid({ tables }: { tables: Table[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleTableClick = (table: Table) => {
    if (isPending) return;

    if (table.status === "AVAILABLE") {
      startTransition(() => {
        openTableAction(table.id);
      });
    } else if (table.status === "SEATED" || table.status === "PREPARING" || table.status === "READY") {
      router.push(`/pos/${table.id}`);
    } else if (table.status === "DIRTY") {
      startTransition(async () => {
        await clearTableAction(table.id);
        toast.success(`Table ${table.table_number} cleaned & available!`);
        router.refresh();
      });
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {tables.map((table) => {
        const isAvailable = table.status === "AVAILABLE";
        const isSeated = table.status === "SEATED";
        const isPreparing = table.status === "PREPARING";
        const isReady = table.status === "READY";
        const isDirty = table.status === "DIRTY";
        
        const isInteractive = isAvailable || isSeated || isPreparing || isReady || isDirty;
        
        return (
          <GlassCard 
            key={table.id}
            onClick={() => handleTableClick(table)}
            className={cn(
              "p-6 cursor-pointer transition-all duration-300 border flex flex-col items-center justify-center min-h-[160px] relative group active:scale-95",
              isAvailable && "hover:bg-brand/5 border-white/5 hover:border-brand/30",
              isSeated && "bg-orange-500/10 border-orange-500/30 hover:border-orange-500/50 animate-[pulse_3s_ease-in-out_infinite]",
              isPreparing && "bg-yellow-500/10 border-yellow-500/30 hover:border-yellow-500/50 animate-[pulse_3s_ease-in-out_infinite]",
              isReady && "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/50 animate-[pulse_3s_ease-in-out_infinite]",
              isDirty && "bg-zinc-800/80 border-zinc-700/50 hover:border-brand/40 hover:bg-zinc-800",
              !isInteractive && "opacity-50 cursor-not-allowed bg-zinc-900 border-white/5 active:scale-100"
            )}
          >
            {isPending && (
              <div className="absolute inset-0 bg-zinc-950/50 flex items-center justify-center rounded-xl backdrop-blur-sm z-10">
                <Loader2 className="w-6 h-6 animate-spin text-brand" />
              </div>
            )}
            
            <div className="text-3xl font-bold text-zinc-100 mb-2">
              {table.table_number}
            </div>
            
            <div className="flex items-center gap-1.5 text-sm text-zinc-400 mb-3">
              <Users className="w-4 h-4" />
              <span>{table.capacity} Seats</span>
            </div>

            <div className={cn(
              "px-3 py-1 rounded-full text-xs font-medium uppercase tracking-wider",
              isAvailable && "bg-brand/10 text-brand",
              isSeated && "bg-orange-500/20 text-orange-400",
              isPreparing && "bg-yellow-500/20 text-yellow-400",
              isReady && "bg-emerald-500/20 text-emerald-400",
              !isInteractive && "bg-zinc-800 text-zinc-400"
            )}>
              {table.status}
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
}
