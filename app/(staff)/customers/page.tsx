import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Users } from "lucide-react";

export default function CustomersPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Customers</h1>
      <div className="flex-1">
        <PlaceholderState 
          title="Customer CRM" 
          description="Guest history, preferences, and loyalty program details will appear here." 
          icon={Users} 
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
