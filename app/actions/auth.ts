"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { loginSchema, registerSchema, type LoginInput, type RegisterInput } from "@/validations/auth";
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

export async function registerWithEmail(data: RegisterInput): Promise<ActionResponse<null>> {
  try {
    const validated = registerSchema.safeParse(data);
    
    if (!validated.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input format.',
          fieldErrors: validated.error.flatten().fieldErrors,
        },
        timestamp: new Date().toISOString()
      };
    }

    const supabase = await createServerSupabaseClient();
    
    // 1. Create the auth user
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: validated.data.email,
      password: validated.data.password,
      options: {
        data: {
          full_name: validated.data.fullName,
        },
      }
    });

    if (signUpError) {
      return {
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: signUpError.message,
        },
        timestamp: new Date().toISOString()
      };
    }

    const newUser = signUpData?.user;

    // 2. Belt-and-suspenders profile creation via admin client (bypasses RLS).
    //    The DB trigger (handle_new_user on auth.users INSERT) should already
    //    create the profiles row. This upsert is a guaranteed fallback for any
    //    edge case where the trigger did not fire synchronously.
    if (newUser?.id) {
      const adminClient = createAdminSupabaseClient();
      const { error: profileError } = await adminClient
        .from('profiles')
        .upsert(
          {
            id: newUser.id,
            email: validated.data.email,
            full_name: validated.data.fullName,
            role: 'guest' as const,
          },
          { onConflict: 'id', ignoreDuplicates: true }
        );
      
      if (profileError) {
        // Non-fatal: the trigger may have already created the row.
        console.error('[registerWithEmail] profile upsert warning:', profileError.message);
      }
    }

    // 3. Immediately sign the user in so a valid session cookie is established.
    //    Without this step, signUp() alone does not guarantee a session cookie
    //    when "Confirm email" is enabled on the Supabase project. The subsequent
    //    /onboarding Server Action would then run with auth.uid() = NULL,
    //    causing the restaurants INSERT policy to reject with 42501.
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: validated.data.email,
      password: validated.data.password,
    });

    if (signInError) {
      // Sign-in failure after signUp means email confirmation is required.
      // Registration itself succeeded — the user must confirm then log in.
      console.warn('[registerWithEmail] post-signup sign-in failed:', signInError.message);
    }

    return {
      success: true,
      data: null,
      message: 'Account created successfully.',
      timestamp: new Date().toISOString()
    };
  } catch (err) {
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: err instanceof Error ? err.message : 'An unexpected error occurred during registration.',
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
