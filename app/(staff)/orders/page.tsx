import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Receipt } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Orders</h1>
      <div className="flex-1">
        <PlaceholderState 
          badge="Roadmap"
          title="Order Management" 
          description="Historical order tracking and operational management." 
          icon={Receipt} 
          plannedCapabilities={[
            "Order history",
            "Bills & receipts",
            "Search & filtering",
            "Refunds",
            "Daily reports"
          ]}
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
