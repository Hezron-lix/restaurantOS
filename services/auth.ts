// =============================================================================
// RestaurantOS: Authentication & Role-Based Access Control (RBAC) Services
// =============================================================================

import type { UserRole, ActionResponse } from '../types/database';
import { createServerSupabaseClient } from '../lib/supabase/server';

/**
 * Role hierarchical classification groups for rapid domain validation.
 */
export const OPERATIONAL_STAFF_ROLES: readonly UserRole[] = ['waiter', 'kitchen', 'cashier', 'manager'];
export const KITCHEN_PERMITTED_ROLES: readonly UserRole[] = ['kitchen', 'manager'];
export const BILLING_PERMITTED_ROLES: readonly UserRole[] = ['cashier', 'manager'];

/**
 * Validates whether a designated role holds required target operational privileges.
 * @param userRole - The authenticated user's current RBAC role.
 * @param allowedRoles - Array of authorized roles for the specific transaction boundary.
 */
export function hasRolePermission(userRole: UserRole, allowedRoles: readonly UserRole[]): boolean {
  if (userRole === 'manager') return true; // Manager overrides all operational staff boundaries
  return allowedRoles.includes(userRole);
}

/**
 * Resolves current authenticated session profile and role from server-side cookies.
 */
export async function getCurrentUserProfile() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { user: null, role: 'guest' as UserRole };
  }

  const { data: profile } = (await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()) as { data: import('../types/database').ProfileRecord | null; error: unknown };

  return {
    user,
    profile,
    role: (profile?.role ?? 'guest') as UserRole,
  };
}

/**
 * Server Action guard enforcing operational RBAC boundaries before mutations execute.
 */
export async function enforceOperationalRoleGuard(
  requiredRoles: readonly UserRole[]
): Promise<ActionResponse<never> | null> {
  const { user, role } = await getCurrentUserProfile();

  if (!user) {
    return {
      success: false,
      error: {
        code: 'AUTHENTICATION_ERROR',
        message: 'Active staff authentication session required to execute this action.',
      },
      timestamp: new Date().toISOString(),
    };
  }

  if (!hasRolePermission(role, requiredRoles)) {
    return {
      success: false,
      error: {
        code: 'AUTHORIZATION_ERROR',
        message: `Insufficient RBAC permissions. Action requires role: [${requiredRoles.join(', ')}]. Current role: [${role}].`,
      },
      timestamp: new Date().toISOString(),
    };
  }

  return null; // Return null if authorization passed successfully without violations
}
