import { PlaceholderState } from "@/components/ui/placeholder-state";
import { BarChart4, DollarSign, Calendar, TrendingUp, CheckCircle, Hash, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getAnalyticsSummary } from "@/services/analytics";
import { redirect } from "next/navigation";
import { CurrencyDisplay } from "@/components/shared/CurrencyDisplay";

export default async function AnalyticsPage() {
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

  const summary = await getAnalyticsSummary(supabase, profile.restaurant_id);

  return (
    <div className="p-6 h-full flex flex-col overflow-y-auto space-y-6">
      <h1 className="text-2xl font-bold tracking-tight text-zinc-100">Analytics</h1>
      
      {/* Metrics Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Revenue Cards */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Today&apos;s Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100"><CurrencyDisplay cents={summary.revenueToday} /></div>
            <p className="text-xs text-zinc-500 mt-1">Realized today</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Weekly Revenue</CardTitle>
            <Calendar className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100"><CurrencyDisplay cents={summary.revenueWeekly} /></div>
            <p className="text-xs text-zinc-500 mt-1">Last 7 days</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Monthly Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-purple-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100"><CurrencyDisplay cents={summary.revenueMonthly} /></div>
            <p className="text-xs text-zinc-500 mt-1">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Average Order Value</CardTitle>
            <DollarSign className="h-4 w-4 text-amber-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100"><CurrencyDisplay cents={summary.averageOrderValue} /></div>
            <p className="text-xs text-zinc-500 mt-1">Across all completed orders</p>
          </CardContent>
        </Card>

        {/* Operational Cards */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Today&apos;s Orders</CardTitle>
            <Hash className="h-4 w-4 text-indigo-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{summary.ordersToday}</div>
            <p className="text-xs text-zinc-500 mt-1">Active and completed today</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Completed Orders</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{summary.completedOrdersTotal}</div>
            <p className="text-xs text-zinc-500 mt-1">Total billed & served</p>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Occupied Tables</CardTitle>
            <Users className="h-4 w-4 text-rose-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-zinc-100">{summary.occupiedTables}</div>
            <p className="text-xs text-zinc-500 mt-1">Currently serving</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex-1">
        <PlaceholderState 
          badge="Roadmap"
          title="Advanced Analytics" 
          description={"The MVP dashboard above provides live operational metrics.\nThese upcoming features are intended for advanced reporting and business intelligence."}
          icon={BarChart4} 
          plannedCapabilities={[
            "Sales Trends",
            "Peak-Hour Analysis",
            "AI Business Insights"
          ]}
        />
      </div>
    </div>
  );
}
