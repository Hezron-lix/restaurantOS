import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { StaffRoster } from "@/components/staff/StaffRoster";

export default async function StaffManagementPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from("profiles")
    .select("restaurant_id")
    .eq("id", user.id)
    .single();

  if (!profile?.restaurant_id) redirect('/onboarding');

  const admin = createAdminSupabaseClient();

  const { data: staffData } = await admin
    .from("profiles")
    .select("id, full_name, email, role, created_at")
    .eq("restaurant_id", profile.restaurant_id)
    .order("created_at", { ascending: true });

  const staff = (staffData || []).map(s => ({
    id: s.id,
    full_name: s.full_name,
    email: s.email,
    role: (s.role || "guest") as "manager" | "waiter" | "kitchen" | "cashier" | "guest",
    created_at: s.created_at
  }));

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Staff Management</h1>
        <p className="text-zinc-400 mt-1 text-sm">Manage employee roles, roster, and operational access permissions.</p>
      </div>

      <StaffRoster staff={staff} />
    </div>
  );
}
