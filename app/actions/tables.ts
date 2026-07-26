"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTableCapacityAction(tableId: string, capacity: number) {
  if (!tableId || typeof capacity !== "number" || !Number.isInteger(capacity) || capacity < 1 || capacity > 20) {
    throw new Error("Capacity must be an integer between 1 and 20.");
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized");
  }

  // Verify manager role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role, restaurant_id")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "manager") {
    throw new Error("Only managers are authorized to edit table capacity.");
  }

  // Ensure table belongs to the user's restaurant
  const { data: table } = await supabase
    .from("tables")
    .select("restaurant_id")
    .eq("id", tableId)
    .single();

  if (!table || table.restaurant_id !== profile.restaurant_id) {
    throw new Error("Table not found or unauthorized.");
  }

  const { error } = await supabase
    .from("tables")
    .update({ capacity })
    .eq("id", tableId);

  if (error) {
    throw new Error(`Failed to update table capacity: ${error.message}`);
  }

  revalidatePath("/tables");
  revalidatePath("/dashboard");

  return { success: true };
}
