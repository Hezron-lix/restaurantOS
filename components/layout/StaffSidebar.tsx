"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, UtensilsCrossed, Receipt, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sidebar, SidebarHeader, SidebarContent, SidebarFooter } from "@/components/layout/sidebar";

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Tables & Orders", href: "/tables", icon: Users },
  { name: "Kitchen (KDS)", href: "/kds", icon: UtensilsCrossed },
  { name: "Billing", href: "/billing", icon: Receipt },
  { name: "Settings", href: "/settings", icon: Settings },
];

export function StaffSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar className="hidden md:flex">
      <SidebarHeader>
        <span className="font-semibold text-lg text-zinc-100">Staff Console</span>
      </SidebarHeader>
      <SidebarContent>
        <nav className="flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors text-sm font-medium",
                  isActive
                    ? "bg-brand/10 text-brand"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-4 h-4", isActive ? "text-brand" : "text-zinc-500")} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </SidebarContent>
      <SidebarFooter>
        <div className="text-xs text-zinc-500 font-medium">RestaurantOS v0.1</div>
      </SidebarFooter>
    </Sidebar>
  );
}
