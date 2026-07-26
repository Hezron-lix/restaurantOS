"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Receipt, 
  UtensilsCrossed, 
  Grid2X2, 
  Calendar, 
  MenuSquare, 
  Box, 
  Users, 
  Contact, 
  UserCircle, 
  BarChart4, 
  Sparkles, 
  Settings,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/layout/sidebar";
import { usePermissions } from "@/hooks/usePermissions";
import type { Permission } from "@/config/permissions";

const NAV_MODULES = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, permission: "view:dashboard" },
  { name: "Orders", href: "/orders", icon: Receipt, permission: "manage:orders" },
  { name: "Kitchen", href: "/kitchen", icon: UtensilsCrossed, permission: "manage:kitchen" },
  { name: "Tables", href: "/tables", icon: Grid2X2, permission: "manage:tables" },
  { name: "Reservations", href: "/reservations", icon: Calendar, permission: "manage:reservations" },
  { name: "Menu", href: "/menu", icon: MenuSquare, permission: "manage:menu" },
  { name: "Inventory", href: "/inventory", icon: Box, permission: "manage:inventory" },
  { name: "Customers", href: "/customers", icon: Contact, permission: "manage:customers" },
  { name: "Staff", href: "/staff", icon: Users, permission: "manage:staff" },
  { name: "Analytics", href: "/analytics", icon: BarChart4, permission: "view:analytics" },
  { name: "Restaurant Copilot", href: "/ai", icon: Sparkles, permission: "manage:ai" },
] as const;

export function StaffSidebar({ className }: { className?: string }) {
  const pathname = usePathname();
  const { can } = usePermissions();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <Sidebar className={cn("hidden md:flex transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)]", isCollapsed ? "w-[72px]" : "w-64", className)}>
      <SidebarHeader className="flex justify-between items-center pr-2">
        {!isCollapsed && <span className="font-bold text-lg text-text-primary tracking-tight">RestaurantOS</span>}
        {isCollapsed && <span className="font-bold text-lg text-brand tracking-tight mx-auto">R</span>}
      </SidebarHeader>
      
      <SidebarContent className="px-2">
        <nav className="flex flex-col gap-1">
          {NAV_MODULES.map((item) => {
            // Check permission, cast to any because permission strings might not strictly match the type yet
            // In a production app, the NAV_MODULES type would map strictly to Permission type
            const hasAccess = can(item.permission as Permission);
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={hasAccess ? item.href : "#"}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium group relative overflow-hidden",
                  !hasAccess && "opacity-50 cursor-not-allowed",
                  isActive && hasAccess
                    ? "bg-brand/10 text-brand"
                    : hasAccess 
                      ? "text-text-secondary hover:text-text-primary hover:bg-surface-hover" 
                      : "text-text-muted"
                )}
                title={isCollapsed ? item.name : undefined}
                onClick={(e) => !hasAccess && e.preventDefault()}
              >
                <div className="relative z-10 flex items-center justify-center min-w-[20px]">
                  <Icon className={cn(
                    "w-[18px] h-[18px] transition-transform duration-200", 
                    isActive && hasAccess ? "text-brand" : "text-text-muted group-hover:text-text-primary"
                  )} />
                </div>
                
                <span className={cn(
                  "relative z-10 whitespace-nowrap transition-opacity duration-200",
                  isCollapsed ? "opacity-0 w-0 hidden" : "opacity-100"
                )}>
                  {item.name}
                </span>

                {!hasAccess && !isCollapsed && (
                  <span className="ml-auto text-[10px] uppercase tracking-wider font-bold text-text-muted bg-white/5 px-1.5 py-0.5 rounded">
                    Lock
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

      <SidebarFooter className="flex-col gap-2 p-2">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium w-full text-text-secondary hover:text-text-primary hover:bg-surface-hover",
            pathname.startsWith("/settings") && "bg-brand/10 text-brand"
          )}
          title={isCollapsed ? "Settings" : undefined}
        >
          <div className="flex items-center justify-center min-w-[20px]">
            <Settings className="w-[18px] h-[18px]" />
          </div>
          {!isCollapsed && <span className="whitespace-nowrap">Settings</span>}
        </Link>
        
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center w-full p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </SidebarFooter>
    </Sidebar>
  );
}
