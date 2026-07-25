"use server";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { restaurantOnboardingSchema, type RestaurantOnboardingInput } from "@/validations/onboarding";
import type { ActionResponse } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function createRestaurantAction(data: RestaurantOnboardingInput): Promise<ActionResponse<string>> {
  try {
    const validated = restaurantOnboardingSchema.safeParse(data);
    
    if (!validated.success) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Please check the form for errors.',
          fieldErrors: validated.error.flatten().fieldErrors,
        },
        timestamp: new Date().toISOString()
      };
    }

    const supabase = await createServerSupabaseClient();
    
    // 1. Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      return {
        success: false,
        error: { code: 'AUTHENTICATION_ERROR', message: 'You must be logged in to create a restaurant.' },
        timestamp: new Date().toISOString()
      };
    }

    // 2. Generate slug
    const slug = validated.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // 3. Create Restaurant
    const { data: restaurant, error: restaurantError } = await supabase
      .from('restaurants')
      .insert({
        name: validated.data.name,
        slug: `${slug}-${Math.floor(Math.random() * 10000)}`, // Basic collision avoidance
        phone: validated.data.phone,
        email: validated.data.email,
        address: validated.data.address,
        city: validated.data.city,
        country: validated.data.country,
        timezone: validated.data.timezone,
        currency: validated.data.currency,
      })
      .select('id')
      .single();

    if (restaurantError || !restaurant) {
      return {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to create restaurant record.' },
        timestamp: new Date().toISOString()
      };
    }

    // 4. Update Profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        restaurant_id: restaurant.id,
        role: 'manager' 
      })
      .eq('id', user.id);

    if (profileError) {
      return {
        success: false,
        error: { code: 'INTERNAL_ERROR', message: 'Failed to associate restaurant with your profile.' },
        timestamp: new Date().toISOString()
      };
    }

    // Note: Tables require a restaurant_id if we update that table later, but currently 'tables' doesn't have it in schema.
    // If 'tables' had restaurant_id, we would insert them here.

    revalidatePath("/", "layout");
    
    return {
      success: true,
      data: restaurant.id,
      message: 'Restaurant created successfully!',
      timestamp: new Date().toISOString()
    };
  } catch {
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred.',
      },
      timestamp: new Date().toISOString()
    };
  }
}
