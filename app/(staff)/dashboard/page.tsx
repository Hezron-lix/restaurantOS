import { createServerSupabaseClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SummaryRow } from "@/components/dashboard/SummaryRow";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { KitchenStatus } from "@/components/dashboard/KitchenStatus";
import { RestaurantOverview } from "@/components/dashboard/RestaurantOverview";
import { StaffOnDuty } from "@/components/dashboard/StaffOnDuty";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user's profile to find their restaurant_id
  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id')
    .eq('id', user.id)
    .single();

  if (!profile?.restaurant_id) {
    redirect('/onboarding');
  }

  // Fetch all staff members belonging to the same restaurant
  const { data: staffData } = await supabase
    .from('profiles')
    .select('id, full_name, role')
    .eq('restaurant_id', profile.restaurant_id)
    .limit(5);

  const staff = staffData || [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Dashboard</h1>
        <p className="text-zinc-400 mt-1 text-sm">Welcome back to your command center.</p>
      </div>

      {/* Top Summary Row */}
      <SummaryRow />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Operational (Takes up 2/3 on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <QuickActions />
            </div>
            <div className="h-64">
              <RecentOrders />
            </div>
            <div className="h-64">
              <KitchenStatus />
            </div>
          </div>
        </div>

        {/* Right Column - Information & Timeline */}
        <div className="space-y-6">
          <RestaurantOverview />
          <StaffOnDuty staff={staff} />
          <ActivityTimeline />
        </div>
      </div>
    </div>
  );
}
