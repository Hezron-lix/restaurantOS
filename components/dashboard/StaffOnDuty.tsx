"use client";

import { GlassCard } from "@/components/ui/glass-card";
import { UserCircle } from "lucide-react";

interface StaffMember {
  id: string;
  full_name: string;
  role: string;
}

export function StaffOnDuty({ staff }: { staff: StaffMember[] }) {
  return (
    <GlassCard className="p-6">
      <h3 className="text-lg font-semibold text-zinc-100 mb-4">Staff on Duty</h3>
      
      {staff.length === 0 ? (
        <p className="text-sm text-zinc-500">No staff information available.</p>
      ) : (
        <div className="space-y-3">
          {staff.map((user) => (
            <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
              <div className="w-8 h-8 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center">
                <UserCircle className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-200 truncate">{user.full_name || "Unknown"}</p>
                <p className="text-xs text-zinc-500 capitalize">{user.role}</p>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            </div>
          ))}
        </div>
      )}
    </GlassCard>
  );
}
