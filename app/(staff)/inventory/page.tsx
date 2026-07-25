import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Package } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Inventory</h1>
      <div className="flex-1">
        <PlaceholderState 
          title="Inventory Tracking" 
          description="Stock levels, alerts, and supplier management will be available here." 
          icon={Package} 
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
