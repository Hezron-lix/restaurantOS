import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Package } from "lucide-react";

export default function InventoryPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Inventory</h1>
      <div className="flex-1">
        <PlaceholderState 
          badge="Roadmap"
          title="Inventory Management" 
          description="Stock monitoring and supply management." 
          icon={Package} 
          plannedCapabilities={[
            "Stock levels",
            "Low-stock alerts",
            "Supplier management",
            "Purchase orders",
            "Ingredient tracking"
          ]}
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
