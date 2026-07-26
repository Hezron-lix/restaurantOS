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
  | "manage:orders"
  | "view:kds"
  | "update:kds"
  | "manage:kitchen"
  | "manage:tables"
  | "manage:reservations"
  | "manage:customers"
  | "manage:staff"
  | "view:analytics"
  | "manage:ai"
  | "process:payments"
  | "view:reports";

// Map roles to permissions
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  manager: [
    "view:dashboard", "manage:users", "manage:menu", "manage:inventory",
    "view:orders", "create:orders", "edit:orders", "delete:orders", "manage:orders",
    "view:kds", "update:kds", "manage:kitchen", "manage:tables", "manage:reservations",
    "manage:customers", "manage:staff", "view:analytics", "manage:ai",
    "process:payments", "view:reports"
  ],
  waiter: [
    "view:dashboard", "view:orders", "create:orders", "edit:orders", "manage:orders",
    "manage:tables", "process:payments"
  ],
  kitchen: [
    "view:kds", "update:kds", "manage:kitchen", "view:orders"
  ],
  cashier: [
    "view:dashboard", "view:orders", "process:payments", "manage:orders"
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
