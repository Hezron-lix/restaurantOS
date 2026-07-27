"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";

export async function addStaffMemberAction(fullName: string, email: string, role: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanName = (fullName || "").trim();

  if (!cleanEmail || !emailRegex.test(cleanEmail)) {
    throw new Error("Invalid email format. Please provide a valid email address.");
  }

  if (!cleanName) {
    throw new Error("Full name is required.");
  }

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

  // 1. Attempt to create user in Supabase Auth using Admin Client
  let userId: string | null = null;
  try {
    const { data: authData } = await admin.auth.admin.createUser({
      email: cleanEmail,
      password: "Password123!",
      email_confirm: true,
      user_metadata: { full_name: cleanName },
    });

    if (authData?.user) {
      userId = authData.user.id;
    } else {
      const { data: usersList } = await admin.auth.admin.listUsers();
      const existingUser = usersList?.users?.find(u => u.email?.toLowerCase() === cleanEmail);
      userId = existingUser?.id || crypto.randomUUID();
    }
  } catch {
    userId = crypto.randomUUID();
  }

  // 2. Upsert profile record linked to auth.users
  const { error: profileError } = await admin.from("profiles").upsert({
    id: userId,
    email: cleanEmail,
    full_name: cleanName,
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
