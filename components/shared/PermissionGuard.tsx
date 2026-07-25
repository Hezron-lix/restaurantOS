"use client";

import { ReactNode } from "react";
import { usePermissions } from "@/hooks/usePermissions";
import { Permission } from "@/config/permissions";

interface PermissionGuardProps {
  permission: Permission;
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard({ permission, children, fallback = null }: PermissionGuardProps) {
  const { can, isLoading } = usePermissions();

  if (isLoading) {
    // Return null or a subtle loading state while resolving permissions
    return null;
  }

  if (!can(permission)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
