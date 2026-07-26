"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";

interface LogActivityParams {
  restaurantId: string;
  type: string;
  title: string;
  description?: string;
  iconName?: string;
  colorClass?: string;
  bgClass?: string;
}

export async function logActivityAction({
  restaurantId,
  type,
  title,
  description,
  iconName,
  colorClass,
  bgClass
}: LogActivityParams) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase.from("restaurant_activities").insert({
    restaurant_id: restaurantId,
    type,
    title,
    description: description || null,
    icon_name: iconName || "Activity",
    color_class: colorClass || "text-brand",
    bg_class: bgClass || "bg-brand/10"
  });

  if (error) {
    console.error("Failed to log activity:", error);
  }
}

export async function getDropdownInsights(restaurantId: string) {
  const supabase = await createServerSupabaseClient();
  
  // 1. Fetch live activity (recent activities from the timeline)
  const { data: activitiesData } = await supabase
    .from('restaurant_activities')
    .select('*')
    .eq('restaurant_id', restaurantId)
    .order('created_at', { ascending: false })
    .limit(5);

  const activities = activitiesData || [];

  // 2. Fetch insights using existing services/logic
  // For Insights, we can reuse dashboard queries directly here or import services.
  // We'll run the simple queries similar to the dashboard to avoid circular imports 
  // or issues with service contexts if they expect admin client. But wait, we can just use supabase.

  // Tables
  const { data: tablesData } = await supabase
    .from('tables')
    .select('id, status')
    .eq('restaurant_id', restaurantId);
    
  const tables = tablesData || [];
  const totalTablesCount = tables.length;
  const availableTables = tables.filter(t => t.status === 'AVAILABLE').length;

  let tableInsight = "🍽 Dining room has good availability.";
  if (totalTablesCount > 0) {
    if (availableTables === 0) {
      tableInsight = "⚠ Dining room is currently at full capacity.";
    } else if (availableTables <= totalTablesCount / 3) {
      tableInsight = "⚠ Dining room is almost full.";
    }
  }

  // Kitchen
  const { data: kitchenOrders } = await supabase
    .from('orders')
    .select('id')
    .eq('restaurant_id', restaurantId)
    .in('status', ['PREPARING', 'READY']);
    
  const activeTicketsCount = kitchenOrders?.length || 0;
  let kitchenInsight = "👨‍🍳 Kitchen is operating normally.";
  if (activeTicketsCount === 0) {
    kitchenInsight = "👨‍🍳 Kitchen is currently clear.";
  } else if (activeTicketsCount > 5) {
    kitchenInsight = "⚠ Kitchen has several active tickets.";
  }

  // Sales
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const { data: todayOrders } = await supabase
    .from('orders')
    .select('total_cents')
    .eq('restaurant_id', restaurantId)
    .in('status', ['BILLED', 'SERVED'])
    .gte('created_at', today.toISOString());
    
  const revenueTodayCents = (todayOrders || []).reduce((sum, o) => sum + (o.total_cents || 0), 0);
  const revenueToday = revenueTodayCents / 100;
  const salesInsight = `💰 Today's revenue is $${revenueToday.toFixed(2)}.`;

  return {
    activities: activities.map(a => ({
      id: a.id,
      title: a.title,
      message: a.description || '',
      type: a.type.toLowerCase().includes('alert') ? 'warning' : 'info',
      time: a.created_at
    })),
    insights: [
      tableInsight,
      kitchenInsight,
      salesInsight
    ]
  };
}
