import React from "react";
import { cn } from "@/lib/utils";

const STAGES = [
  "Restaurant",
  "Tables",
  "Kitchen",
  "Analytics",
  "RestaurantOS"
];

interface ProgressIndicatorProps {
  progress: number;
  className?: string;
}

export function ProgressIndicator({ progress, className }: ProgressIndicatorProps) {
  // We have 5 stages, so 4 segments.
  const totalSegments = STAGES.length - 1;
  const currentStageIndex = Math.min(
    Math.floor(progress * STAGES.length),
    totalSegments
  );

  return (
    <div className={cn("flex flex-col items-start gap-0", className)}>
      {STAGES.map((stage, index) => {
        const isActive = index <= currentStageIndex;
        const isCurrent = index === currentStageIndex;
        const isLast = index === STAGES.length - 1;

        // Calculate segment progress for the line below this node
        let segmentProgress = 0;
        if (progress * totalSegments > index) {
          if (progress * totalSegments >= index + 1) {
            segmentProgress = 1;
          } else {
            segmentProgress = (progress * totalSegments) - index;
          }
        }

        return (
          <div key={stage} className="flex flex-col items-start">
            <div className="flex items-center gap-4">
              <div 
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-300",
                  isActive ? "bg-brand scale-125 shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "bg-zinc-800",
                  isCurrent && "ring-2 ring-brand/30 ring-offset-2 ring-offset-black"
                )} 
              />
              <span 
                className={cn(
                  "text-xs uppercase tracking-[0.2em] transition-all duration-300 font-mono",
                  isActive ? "text-zinc-300 translate-x-1" : "text-zinc-700",
                  isCurrent && "text-brand font-medium"
                )}
              >
                {stage}
              </span>
            </div>
            
            {!isLast && (
              <div className="w-[1px] h-12 ml-[3px] my-1 bg-zinc-900 relative overflow-hidden">
                <div 
                  className="absolute top-0 left-0 w-full bg-brand shadow-[0_0_8px_rgba(234,179,8,0.4)]"
                  style={{ height: `${segmentProgress * 100}%` }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
