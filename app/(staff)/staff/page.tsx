import { PlaceholderState } from "@/components/ui/placeholder-state";
import { UserCircle } from "lucide-react";

export default function StaffManagementPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Staff Management</h1>
      <div className="flex-1">
        <PlaceholderState 
          title="Staff CRM" 
          description="Employee schedules, roles, and performance will appear here." 
          icon={UserCircle} 
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
