"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addStaffMemberAction(fullName: string, email: string, role: string) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: profile } = await supabase
    .from("profiles")
    .select("restaurant_id, role")
    .eq("id", user.id)
    .single();

  if (!profile?.restaurant_id) throw new Error("No restaurant context");

  const admin = createAdminSupabaseClient();

  // 1. Create user in Supabase Auth using Admin Client
  let userId: string | null = null;
  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password: "Password123!",
    email_confirm: true,
    user_metadata: { full_name: fullName },
  });

  if (authData?.user) {
    userId = authData.user.id;
  } else {
    // If auth creation failed because user exists, find their ID
    const { data: usersList } = await admin.auth.admin.listUsers();
    const existingUser = usersList.users.find(u => u.email?.toLowerCase() === email.toLowerCase());
    if (existingUser) {
      userId = existingUser.id;
    } else {
      throw new Error("Failed to create staff account: " + (authError?.message || "Unknown error"));
    }
  }

  // 2. Upsert profile record linked to auth.users
  const { error: profileError } = await admin.from("profiles").upsert({
    id: userId,
    email,
    full_name: fullName,
    role: role as "manager" | "waiter" | "kitchen" | "cashier" | "guest",
    restaurant_id: profile.restaurant_id,
  });

  if (profileError) {
    throw new Error("Failed to update staff profile: " + profileError.message);
  }

  revalidatePath("/staff");
  revalidatePath("/dashboard");

  return { success: true };
}
