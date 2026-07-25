"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "@/validations/auth";
import type { ActionResponse } from "@/types/database";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function loginWithEmail(data: LoginInput): Promise<ActionResponse<null>> {
  try {
    const validated = loginSchema.safeParse(data);
    
    if (!validated.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid email or password format.',
          fieldErrors: validated.error.flatten().fieldErrors,
        },
        timestamp: new Date().toISOString()
      };
    }

    const supabase = await createServerSupabaseClient();
    
    const { error } = await supabase.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

    if (error) {
      return {
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: error.message,
        },
        timestamp: new Date().toISOString()
      };
    }

    // Will redirect to dashboard in client, or we could redirect here.
    return {
      success: true,
      data: null,
      message: 'Successfully authenticated.',
      timestamp: new Date().toISOString()
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred during login.',
      },
      timestamp: new Date().toISOString()
    };
  }
}

export async function logoutAction() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}

export async function resetPasswordAction(email: string): Promise<ActionResponse<null>> {
  if (!email || !email.includes('@')) {
    return {
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Valid email is required.' },
      timestamp: new Date().toISOString()
    };
  }

  const supabase = await createServerSupabaseClient();
  
  // Assuming reset happens on the same domain
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/update-password`,
  });

  if (error) {
    return {
      success: false,
      error: { code: 'AUTHENTICATION_ERROR', message: error.message },
      timestamp: new Date().toISOString()
    };
  }

  return {
    success: true,
    data: null,
    message: 'Check your email for the password reset link.',
    timestamp: new Date().toISOString()
  };
}
