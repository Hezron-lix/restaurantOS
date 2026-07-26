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
}

export function PlaceholderState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  className,
}: PlaceholderStateProps) {
  return (
    <GlassCard className={`flex flex-col items-center justify-center p-12 text-center h-full ${className || ""}`}>
      <div className="w-16 h-16 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center mb-6">
        <Icon className="h-8 w-8 text-brand/80" strokeWidth={1.5} />
      </div>
      <h3 className="text-xl font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400 text-sm max-w-sm mb-6">{description}</p>
      
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
