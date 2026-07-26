"use client";

import { useState, useTransition, useEffect } from "react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, UserCircle, Shield, ChefHat, Utensils, Receipt, Loader2, Mail, CheckCircle2 } from "lucide-react";
import { addStaffMemberAction } from "@/app/actions/staff";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface StaffMember {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "manager" | "waiter" | "kitchen" | "cashier" | "guest";
  created_at?: string;
}

const ROLE_ICONS = {
  manager: { icon: Shield, color: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-500/30" },
  waiter: { icon: Utensils, color: "text-blue-400", bg: "bg-blue-400/10", border: "border-blue-500/30" },
  kitchen: { icon: ChefHat, color: "text-orange-400", bg: "bg-orange-400/10", border: "border-orange-500/30" },
  cashier: { icon: Receipt, color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-500/30" },
  guest: { icon: UserCircle, color: "text-zinc-400", bg: "bg-zinc-400/10", border: "border-zinc-500/30" },
};

export function StaffRoster({ staff }: { staff: StaffMember[] }) {
  const [isAdding, setIsAdding] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"manager" | "waiter" | "kitchen" | "cashier">("waiter");
  const [isPending, startTransition] = useTransition();
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [staffList, setStaffList] = useState<StaffMember[]>(staff);
  const router = useRouter();

  useEffect(() => {
    setStaffList(staff);
  }, [staff]);

  const handleAddStaff = () => {
    if (!fullName || !email) {
      toast.error("Please provide both name and email.");
      return;
    }

    const tempMember: StaffMember = {
      id: crypto.randomUUID(),
      full_name: fullName,
      email,
      role,
    };

    setStaffList(prev => [...prev, tempMember]);

    startTransition(async () => {
      try {
        await addStaffMemberAction(fullName, email, role);
        toast.success(`Added ${fullName} as ${role.toUpperCase()}`);
        setFullName("");
        setEmail("");
        setIsAdding(false);
        router.refresh();
      } catch (err: any) {
        toast.error(err?.message || "Failed to add staff member.");
        setStaffList(staff);
      }
    });
  };

  const filteredStaff = activeFilter === "ALL" 
    ? staffList 
    : staffList.filter(s => s.role.toUpperCase() === activeFilter);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        {/* Role Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {["ALL", "MANAGER", "WAITER", "KITCHEN", "CASHIER"].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors",
                activeFilter === f 
                  ? "bg-brand text-zinc-950" 
                  : "bg-zinc-900/50 text-zinc-400 hover:text-zinc-200 border border-white/5"
              )}
            >
              {f}
            </button>
          ))}
        </div>

        <Button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-brand text-zinc-950 hover:bg-brand/90 font-semibold text-sm flex items-center gap-2"
        >
          <UserPlus className="w-4 h-4" /> Add Staff Member
        </Button>
      </div>

      {/* Add Staff Form Card */}
      {isAdding && (
        <GlassCard className="p-6 border-brand/30 bg-brand/5">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5 text-brand" /> Add New Staff Member
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Full Name</label>
              <Input 
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                placeholder="e.g. Alex Morgan"
                className="bg-zinc-900/60 border-white/10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Email Address</label>
              <Input 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="alex@restaurant.com"
                className="bg-zinc-900/60 border-white/10"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 block mb-1">Assigned Role</label>
              <select 
                value={role}
                onChange={e => setRole(e.target.value as any)}
                className="w-full h-10 rounded-md bg-zinc-900/60 border border-white/10 px-3 text-sm text-zinc-200 focus:outline-none focus:border-brand"
              >
                <option value="waiter">Waiter / Floor Staff</option>
                <option value="kitchen">Kitchen Staff</option>
                <option value="cashier">Cashier</option>
                <option value="manager">Manager</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="ghost" onClick={() => setIsAdding(false)} className="text-zinc-400 hover:text-white">
              Cancel
            </Button>
            <Button onClick={handleAddStaff} disabled={isPending} className="bg-brand text-zinc-950 hover:bg-brand/90 font-bold px-6">
              {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save & Assign"}
            </Button>
          </div>
        </GlassCard>
      )}

      {/* Staff Grid Roster */}
      {filteredStaff.length === 0 ? (
        <GlassCard className="p-12 text-center flex flex-col items-center justify-center border-white/5 bg-zinc-950/30">
          <UserCircle className="w-12 h-12 text-zinc-600 mb-3" />
          <h4 className="text-base font-semibold text-zinc-300">No {activeFilter.toLowerCase()} staff members yet</h4>
          <p className="text-sm text-zinc-500 max-w-sm mt-1 mb-4">
            Click &quot;Add Staff Member&quot; above to invite and assign a {activeFilter.toLowerCase()} to your restaurant.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 min-h-[380px] items-start">
          {filteredStaff.map((member) => {
            const config = ROLE_ICONS[member.role] || ROLE_ICONS.guest;
            const RoleIcon = config.icon;

            return (
              <GlassCard key={member.id} className="p-5 flex flex-col justify-between hover:bg-white/5 transition-all group border-white/5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center border", config.bg, config.border, config.color)}>
                      <RoleIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-zinc-100 text-base group-hover:text-white">{member.full_name || "Staff Member"}</h4>
                      <p className="text-xs text-zinc-400 flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-zinc-500" />
                        {member.email || "No email"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className={cn("px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider border", config.bg, config.border, config.color)}>
                    {member.role}
                  </span>
                  <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 className="w-3 h-3" /> Active
                  </span>
                </div>
              </GlassCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
