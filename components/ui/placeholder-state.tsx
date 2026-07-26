import { LucideIcon } from "lucide-react";
import { GlassCard } from "./glass-card";
import { Button } from "./button";
import Link from "next/link";

interface PlaceholderStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  className?: string;
  badge?: string;
  plannedCapabilities?: string[];
}

export function PlaceholderState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  className,
  badge,
  plannedCapabilities,
}: PlaceholderStateProps) {
  return (
    <GlassCard className={`flex flex-col items-center justify-center p-12 text-center h-full ${className || ""}`}>
      <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-brand/80" strokeWidth={1.5} />
      </div>
      {badge && (
        <span className="mb-4 px-3 py-1 rounded-full bg-brand/10 border border-brand/20 text-brand text-xs font-semibold uppercase tracking-wider">
          {badge}
        </span>
      )}
      <h3 className="text-xl font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm max-w-md mb-6 whitespace-pre-wrap">{description}</p>
      
      {plannedCapabilities && plannedCapabilities.length > 0 && (
        <div className="w-full max-w-sm mb-8 text-left bg-zinc-950/50 rounded-xl border border-white/5 p-5 shadow-inner">
          <p className="text-xs font-semibold text-zinc-300 mb-3 uppercase tracking-wider">Planned capabilities:</p>
          <ul className="space-y-2.5">
            {plannedCapabilities.map((cap, i) => (
              <li key={i} className="text-zinc-400 text-sm flex items-start gap-2.5">
                <span className="text-brand/80 font-bold mt-[-1px]">•</span>
                {cap}
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {actionLabel && actionHref && (
        <Link href={actionHref}>
          <Button 
            variant="outline" 
            className="bg-brand/10 text-brand border-brand/30 hover:bg-brand/20"
          >
            {actionLabel}
          </Button>
        </Link>
      )}
    </GlassCard>
  );
}
