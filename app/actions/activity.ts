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
