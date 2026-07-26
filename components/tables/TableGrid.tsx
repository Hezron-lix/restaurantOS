"use client";

import { useState, useTransition } from "react";
import { openTableAction, clearTableAction } from "@/app/actions/orders";
import { updateTableCapacityAction } from "@/app/actions/tables";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Loader2, Pencil, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/components/providers/staff-providers";

interface Table {
  id: string;
  table_number: number;
  capacity: number;
  status: "AVAILABLE" | "SEATED" | "PREPARING" | "READY" | "DIRTY" | "RESERVED" | "CLEANING";
}

export function TableGrid({ tables }: { tables: Table[] }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { profile } = useAuth();
  const isManager = profile?.role === "manager";

  // Edit Capacity State
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [editCapacity, setEditCapacity] = useState<number>(4);
  const [isSaving, setIsSaving] = useState(false);

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

  const handleOpenEditModal = (e: React.MouseEvent, table: Table) => {
    e.stopPropagation();
    setEditingTable(table);
    setEditCapacity(table.capacity);
  };

  const handleSaveCapacity = async () => {
    if (!editingTable) return;
    if (isNaN(editCapacity) || editCapacity < 1 || editCapacity > 20) {
      toast.error("Capacity must be between 1 and 20 seats");
      return;
    }

    setIsSaving(true);
    try {
      await updateTableCapacityAction(editingTable.id, editCapacity);
      toast.success(`Table ${editingTable.table_number} capacity updated to ${editCapacity} seats`);
      setEditingTable(null);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update table capacity");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
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

              {/* Edit Capacity Button for Managers */}
              {isManager && (
                <button
                  type="button"
                  onClick={(e) => handleOpenEditModal(e, table)}
                  title="Edit Table Capacity"
                  className="absolute top-3 right-3 p-1.5 rounded-lg text-zinc-400 opacity-0 group-hover:opacity-100 hover:text-zinc-100 hover:bg-zinc-800/80 transition-all z-10"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
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

      {/* Edit Table Capacity Modal */}
      {editingTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-sm animate-in fade-in">
          <GlassCard className="w-full max-w-sm p-6 border-white/10 shadow-2xl relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/5">
              <h3 className="text-lg font-bold text-zinc-100">
                Edit Table {editingTable.table_number} Capacity
              </h3>
              <button
                type="button"
                onClick={() => setEditingTable(null)}
                className="text-zinc-400 hover:text-zinc-100 text-lg leading-none"
              >
                ×
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider block mb-2">
                  Seating Capacity (1–20 Seats)
                </label>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0 bg-zinc-900 border-white/10 text-zinc-200 hover:bg-zinc-800"
                    onClick={() => setEditCapacity((prev) => Math.max(1, prev - 1))}
                    disabled={editCapacity <= 1 || isSaving}
                  >
                    <Minus className="w-4 h-4" />
                  </Button>

                  <Input
                    type="number"
                    min={1}
                    max={20}
                    value={editCapacity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setEditCapacity(isNaN(val) ? 1 : val);
                    }}
                    className="h-10 text-center font-bold text-base bg-zinc-900/60 border-white/10 text-zinc-100 focus-visible:ring-brand"
                  />

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="h-10 w-10 shrink-0 bg-zinc-900 border-white/10 text-zinc-200 hover:bg-zinc-800"
                    onClick={() => setEditCapacity((prev) => Math.min(20, prev + 1))}
                    disabled={editCapacity >= 20 || isSaving}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {(editCapacity < 1 || editCapacity > 20) && (
                  <p className="text-xs text-red-400 mt-1.5">
                    Please enter a capacity between 1 and 20 seats.
                  </p>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                  onClick={() => setEditingTable(null)}
                  disabled={isSaving}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  className="flex-1 bg-brand text-zinc-950 font-semibold hover:bg-brand/90"
                  onClick={handleSaveCapacity}
                  disabled={isSaving || editCapacity < 1 || editCapacity > 20}
                >
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Capacity"}
                </Button>
              </div>
            </div>
          </GlassCard>
        </div>
      )}
    </>
  );
}
