import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Receipt } from "lucide-react";

export default function OrdersPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Orders</h1>
      <div className="flex-1">
        <PlaceholderState 
          title="Orders Module" 
          description="The orders management interface is currently under construction. Check back soon." 
          icon={Receipt} 
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
