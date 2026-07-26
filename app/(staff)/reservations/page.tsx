import { PlaceholderState } from "@/components/ui/placeholder-state";
import { Calendar } from "lucide-react";

export default function ReservationsPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100 mb-6">Reservations</h1>
      <div className="flex-1">
        <PlaceholderState 
          badge="Roadmap"
          title="Reservations" 
          description="Future customer reservation and waitlist management." 
          icon={Calendar} 
          plannedCapabilities={[
            "Online reservations",
            "Waitlist",
            "Table assignment",
            "Arrival notifications",
            "Reservation calendar"
          ]}
          actionLabel="Return to Dashboard"
          actionHref="/dashboard"
        />
      </div>
    </div>
  );
}
