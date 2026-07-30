import { ChefHat } from "lucide-react";

export default function StaffLoading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[75vh] w-full bg-black text-zinc-50 relative overflow-hidden px-6">
      {/* Subtle ambient orange glow behind the chef hat */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-brand/5 blur-[80px] rounded-full pointer-events-none animate-pulse-slow" />
      
      <div className="relative flex flex-col items-center gap-6 z-10">
        <div className="p-5 rounded-3xl bg-zinc-950/40 border border-brand/20 shadow-[0_0_40px_rgba(234,179,8,0.08)] animate-float">
          <ChefHat className="size-16 text-brand" />
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-medium tracking-wide text-zinc-200 animate-pulse-slow">
            Cooking...
          </h2>
          <p className="text-xs text-zinc-500 font-mono tracking-widest uppercase">
            Preparing your workspace
          </p>
        </div>
      </div>
    </div>
  );
}
