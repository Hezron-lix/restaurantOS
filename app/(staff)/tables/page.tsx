import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Grid2x2 } from "lucide-react";

export default function TablesPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Tables</h1>
      <div className="flex-1">
        <PlaceholderState 
          title="Tables & Layout" 
          description="Table management and floor plan design are currently under construction." 
          icon={Grid2x2} 
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
