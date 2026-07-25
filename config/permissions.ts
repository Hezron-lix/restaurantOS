import type { UserRole } from "@/types/database";

// Define all fine-grained permissions here
export type Permission = 
  | "view:dashboard"
  | "manage:users"
  | "manage:menu"
  | "manage:inventory"
  | "view:orders"
  | "create:orders"
  | "edit:orders"
  | "delete:orders"
  | "view:kds"
  | "update:kds"
  | "process:payments"
  | "view:reports";

// Map roles to permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  manager: [
    "view:dashboard", "manage:users", "manage:menu", "manage:inventory",
    "view:orders", "create:orders", "edit:orders", "delete:orders",
    "view:kds", "update:kds", "process:payments", "view:reports"
  ],
  waiter: [
    "view:dashboard", "view:orders", "create:orders", "edit:orders", "process:payments"
  ],
  kitchen: [
    "view:kds", "update:kds", "view:orders"
  ],
  cashier: [
    "view:dashboard", "view:orders", "process:payments"
  ],
  guest: []
};

/**
 * Checks if a role has a specific permission.
 */
export function hasPermission(role: UserRole | undefined, permission: Permission): boolean {
  if (!role) return false;
  const perms = ROLE_PERMISSIONS[role];
  return perms ? perms.includes(permission) : false;
}
