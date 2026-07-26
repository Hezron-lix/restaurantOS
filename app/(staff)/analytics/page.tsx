import { PlaceholderState } from "@/components/ui/placeholder-state";
import { BarChart4 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Analytics</h1>
      <div className="flex-1">
        <PlaceholderState 
          title="Analytics" 
          description="Sales reports, heatmaps, and trend forecasting will appear here." 
          icon={BarChart4} 
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
