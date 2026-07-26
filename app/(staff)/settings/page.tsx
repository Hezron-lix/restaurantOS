import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Settings } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Settings</h1>
      <div className="flex-1">
        <PlaceholderState 
          title="Restaurant Settings" 
          description="Configuration for taxes, receipts, branding, and billing will appear here." 
          icon={Settings} 
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
