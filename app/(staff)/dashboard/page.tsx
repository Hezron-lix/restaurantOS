import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { SummaryRow } from "@/components/dashboard/SummaryRow";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { RecentOrders } from "@/components/dashboard/RecentOrders";
import { InventoryAlerts } from "@/components/dashboard/InventoryAlerts";
import { RestaurantOverview } from "@/components/dashboard/RestaurantOverview";
import { StaffOnDuty } from "@/components/dashboard/StaffOnDuty";
import { ActivityTimeline } from "@/components/dashboard/ActivityTimeline";
import type { ActivityEntry } from "@/components/dashboard/ActivityTimeline";

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Get user's profile to find their restaurant_id and role
  const { data: profile } = await supabase
    .from('profiles')
    .select('restaurant_id, role')
    .eq('id', user.id)
    .single();

  if (!profile?.restaurant_id) {
    redirect('/onboarding');
  }

  // Redirect non-manager roles away from the dashboard to their primary page.
  // Fires before any admin-client queries so redirected users pay no DB cost.
  const roleRedirects: Partial<Record<string, string>> = {
    kitchen: '/kitchen',
    cashier: '/billing',
    waiter: '/tables',
  };
  const roleDestination = roleRedirects[profile.role ?? ''];
  if (roleDestination) {
    redirect(roleDestination);
  }

  const admin = createAdminSupabaseClient();

  // Fetch all staff members belonging to the same restaurant
  const { data: staffData } = await admin
    .from('profiles')
    .select('id, full_name, role')
    .eq('restaurant_id', profile.restaurant_id)
    .limit(5);
  const staff = staffData || [];

  // Fetch Table metrics
  const { data: tablesData } = await admin
    .from('tables')
    .select('id, status')
    .eq('restaurant_id', profile.restaurant_id);

  const tables = tablesData || [];
  const totalTablesCount = tables.length;
  const occupiedTablesCount = tables.filter(t => t.status !== 'AVAILABLE').length;

  // Fetch Order metrics
  const { data: recentOrdersData } = await admin
    .from('orders')
    .select('id, table_id, status, total_cents, created_at, tables(table_number)')
    .eq('restaurant_id', profile.restaurant_id)
    .gt('total_cents', 0)
    .order('created_at', { ascending: false })
    .limit(5);

  const recentOrders = (recentOrdersData || []).map(o => ({
    id: o.id,
    table_number: (o.tables as unknown as { table_number: number } | null)?.table_number,
    status: o.status,
    total_cents: o.total_cents,
    created_at: o.created_at
  }));

  // Kitchen active tickets (PREPARING, READY)
  const { data: kitchenOrders } = await admin
    .from('orders')
    .select('id')
    .eq('restaurant_id', profile.restaurant_id)
    .in('status', ['PREPARING', 'READY']);

  const activeTicketsCount = kitchenOrders?.length || 0;
  const activeOrdersCount = activeTicketsCount;

  // Calculate today's revenue (only completed/billed/served orders count as realized revenue)
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: todayOrders } = await admin
    .from('orders')
    .select('total_cents')
    .eq('restaurant_id', profile.restaurant_id)
    .in('status', ['BILLED', 'SERVED'])
    .gte('created_at', today.toISOString());

  const revenueTodayCents = (todayOrders || []).reduce((sum, o) => sum + (o.total_cents || 0), 0);
  const revenueToday = revenueTodayCents;

  // Fetch recent activities
  const { data: activitiesData } = await admin
    .from('restaurant_activities')
    .select('*')
    .eq('restaurant_id', profile.restaurant_id)
    .order('created_at', { ascending: false })
    .limit(10);

  const activities = activitiesData || [];

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-100">Dashboard</h1>
        <p className="text-zinc-400 mt-1 text-sm">Welcome back to your command center.</p>
      </div>

      {/* Top Summary Row */}
      <SummaryRow
        activeOrdersCount={activeOrdersCount}
        occupiedTablesCount={occupiedTablesCount}
        totalTablesCount={totalTablesCount}
        revenueToday={revenueToday}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Operational (Takes up 2/3 on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <QuickActions />
            </div>
            <div className="h-52">
              <RecentOrders orders={recentOrders} />
            </div>
            <div className="h-52">
              <InventoryAlerts />
            </div>
          </div>
        </div>

        {/* Right Column - Information & Timeline */}
        <div className="space-y-6">
          <RestaurantOverview />
          <StaffOnDuty staff={staff} />
          <ActivityTimeline activities={activities as ActivityEntry[]} />
        </div>
      </div>
    </div>
  );
}
