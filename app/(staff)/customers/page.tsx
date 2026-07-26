import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Customers</h1>
      <div className="flex-1">
        <PlaceholderState 
          badge="Roadmap"
          title="Customer CRM" 
          description="Guest profiles and relationship management." 
          icon={Users} 
          plannedCapabilities={[
            "Customer history",
            "Preferences",
            "Loyalty program",
            "Visit history",
            "Spending insights"
          ]}
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
