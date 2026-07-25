// =============================================================================
// RestaurantOS: Authentication & Role Validation Schemas
// =============================================================================

import { z } from 'zod';
import { USER_ROLES } from '../config/constants';

/**
 * Validator for checking user role permissions.
 */
export const roleSchema = z.enum(USER_ROLES);

/**
 * Schema for table QR code session token check-ins.
 * Guards against off-site order spam by validating token signatures and length.
 */
export const tableTokenCheckInSchema = z.object({
  table_id: z.string().uuid({ message: 'Valid Table UUID is required.' }),
  token: z.string().min(8, { message: 'Table security token must be at least 8 characters.' }),
  guest_count: z
    .number()
    .int()
    .min(1, { message: 'Guest count must be at least 1 person.' })
    .max(20, { message: 'For parties over 20, please contact floor host.' })
    .optional(),
});
export type TableTokenCheckInInput = z.infer<typeof tableTokenCheckInSchema>;

/**
 * Schema for updating user profile roles (Admin / Manager exclusive).
 */
export const updateProfileRoleSchema = z.object({
  user_id: z.string().uuid(),
  new_role: roleSchema,
});
export type UpdateProfileRoleInput = z.infer<typeof updateProfileRoleSchema>;

/**
 * Schema for user login.
 */
export const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email address.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});
export type LoginInput = z.infer<typeof loginSchema>;
