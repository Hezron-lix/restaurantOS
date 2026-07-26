import { PlaceholderState } from "@/components/ui/placeholder-state";
import { BarChart4 } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Analytics</h1>
      <div className="flex-1">
        <PlaceholderState 
          badge="Roadmap"
          title="Analytics" 
          description={"The dashboard already provides live operational metrics.\nThis module is intended for advanced reporting and business intelligence."}
          icon={BarChart4} 
          plannedCapabilities={[
            "Sales trends",
            "Peak-hour analysis",
            "Revenue reports",
            "Exportable reports",
            "Business insights"
          ]}
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
