import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Bot } from "lucide-react";

export default function AiAgentPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">AI Agent</h1>
      <div className="flex-1">
        <PlaceholderState 
          title="Restaurant AI" 
          description="Your intelligent assistant for inventory forecasting, dynamic pricing, and staff scheduling." 
          icon={Bot} 
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
