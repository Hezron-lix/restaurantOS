"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { restaurantOnboardingSchema, type RestaurantOnboardingInput } from "@/validations/onboarding";
import type { ActionResponse } from "@/types/database";
import { revalidatePath } from "next/cache";
import { seedRestaurantData } from "./seed";

// ─── Server-side diagnostics ─────────────────────────────────────────────────
// All output appears in the Next.js server terminal (not the browser console).
function dbLog(step: string, data: Record<string, unknown>) {
  console.log(`[createRestaurantAction] ${step}`, JSON.stringify(data, null, 2));
}
// ─────────────────────────────────────────────────────────────────────────────

export async function createRestaurantAction(data: RestaurantOnboardingInput): Promise<ActionResponse<string>> {
  dbLog("ENTERED", { timestamp: new Date().toISOString() });

  try {
    const validated = restaurantOnboardingSchema.safeParse(data);
    
    if (!validated.success) {
      const fieldErrors = validated.error.flatten().fieldErrors;
      dbLog("VALIDATION_FAILED", { fieldErrors });
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please check the form for errors.',
          fieldErrors,
        },
        timestamp: new Date().toISOString()
      };
    }

    dbLog("VALIDATION_PASSED", { input: validated.data });

    const supabase = await createServerSupabaseClient();
    
    // ── Step 1: Authenticate ─────────────────────────────────────────────────
    dbLog("AUTH_GETUSER — calling supabase.auth.getUser()", {});
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    dbLog("AUTH_GETUSER — result", {
      userId: user?.id ?? null,
      email: user?.email ?? null,
      error: userError ? { message: userError.message, status: userError.status } : null,
    });

    if (userError || !user) {
      return {
        success: false,
        error: { code: 'AUTHENTICATION_ERROR', message: userError?.message ?? 'No authenticated user found.' },
        timestamp: new Date().toISOString()
      };
    }

    // ── Step 2: Idempotency check ────────────────────────────────────────────
    dbLog("IDEMPOTENCY — checking profiles.restaurant_id", { userId: user.id });
    const { data: existingProfile, error: profileReadError } = await supabase
      .from('profiles')
      .select('restaurant_id')
      .eq('id', user.id)
      .single();

    dbLog("IDEMPOTENCY — result", {
      existingRestaurantId: existingProfile?.restaurant_id ?? null,
      error: profileReadError ? {
        message: profileReadError.message,
        code: profileReadError.code,
        details: profileReadError.details,
        hint: profileReadError.hint,
      } : null,
    });

    if (existingProfile?.restaurant_id) {
      dbLog("IDEMPOTENCY — short-circuit: user already has a restaurant", {
        restaurantId: existingProfile.restaurant_id,
      });
      return {
        success: true,
        data: existingProfile.restaurant_id,
        message: 'Restaurant already exists. Returning existing record.',
        timestamp: new Date().toISOString()
      };
    }

    // ── Step 3: INSERT restaurant ────────────────────────────────────────────
    const slug = validated.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const slugWithSuffix = `${slug}-${Math.floor(Math.random() * 10000)}`;
    const restaurantPayload = {
      name: validated.data.name,
      slug: slugWithSuffix,
      phone: validated.data.phone,
      email: validated.data.email,
      address: validated.data.address,
      city: validated.data.city,
      country: validated.data.country,
      timezone: validated.data.timezone,
      currency: validated.data.currency,
    };

    dbLog("INSERT restaurants — calling", { payload: restaurantPayload });
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert(restaurantPayload)
      .select('id')
      .single();

    dbLog("INSERT restaurants — result", {
      restaurantId: restaurant?.id ?? null,
      error: restaurantError ? {
        message: restaurantError.message,
        code: restaurantError.code,
        details: restaurantError.details,
        hint: restaurantError.hint,
      } : null,
    });

    if (restaurantError || !restaurant) {
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: `[INSERT restaurants FAILED] ${restaurantError?.message ?? 'No data returned'} | code=${restaurantError?.code} | details=${restaurantError?.details}`,
        },
        timestamp: new Date().toISOString()
      };
    }

    // ── Step 4: UPDATE profile ───────────────────────────────────────────────
    dbLog("UPDATE profiles — calling", {
      userId: user.id,
      restaurant_id: restaurant.id,
      role: 'manager',
    });
    const { data: updatedProfile, error: profileError } = await supabase
      .from('profiles')
      .update({ 
        restaurant_id: restaurant.id,
        role: 'manager' 
      })
      .eq('id', user.id)
      .select('id, restaurant_id, role');

    dbLog("UPDATE profiles — result", {
      updatedProfile,
      error: profileError ? {
        message: profileError.message,
        code: profileError.code,
        details: profileError.details,
        hint: profileError.hint,
      } : null,
    });

    if (profileError) {
      return {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: `[UPDATE profiles FAILED] ${profileError.message} | code=${profileError.code} | details=${profileError.details}`,
        },
        timestamp: new Date().toISOString()
      };
    }

    // ── Step 5: Seed data ────────────────────────────────────────────────────
    dbLog("SEED — calling seedRestaurantData", { restaurantId: restaurant.id });
    const seedResult = await seedRestaurantData(restaurant.id);
    dbLog("SEED — result", { seedResult });

    revalidatePath("/dashboard", "layout");

    dbLog("SUCCESS", { restaurantId: restaurant.id, updatedProfile });

    return {
      success: true,
      data: restaurant.id,
      message: 'Restaurant created successfully!',
      timestamp: new Date().toISOString()
    };

  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    const stack = err instanceof Error ? err.stack : undefined;
    dbLog("UNHANDLED_EXCEPTION", { message: errorMessage, stack });
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: errorMessage,
      },
      timestamp: new Date().toISOString()
    };
  }
}
