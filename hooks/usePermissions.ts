"use client";

import { useMemo } from "react";
import { useAuth } from "@/components/providers/staff-providers";
import { hasPermission, type Permission } from "@/config/permissions";
import type { UserRole } from "@/types/database";

export function usePermissions() {
  const { profile } = useAuth();
  
  // Default to guest if no profile or role is found
  const role = (profile?.role as UserRole) || "guest";
  
  const can = useMemo(() => {
    return (permission: Permission) => hasPermission(role, permission);
  }, [role]);

  // isLoading is no longer needed since AuthContext is populated server-side
  return { can, role, isLoading: false };
}
