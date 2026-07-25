"use client";

import { usePathname } from "next/navigation";
import { Search, ChevronRight, Menu } from "lucide-react";
import { useAppStore } from "@/store/app-store";
import { RestaurantSwitcher } from "@/components/shell/RestaurantSwitcher";
import { NotificationCenter } from "@/components/shell/NotificationCenter";
import { ProfileMenu } from "@/components/shell/ProfileMenu";
import type { UserRole } from "@/types/database";

interface StaffHeaderProps {
  userName: string;
  userRole: UserRole;
  onMobileMenuToggle?: () => void;
}

export function StaffHeader({
  userName,
  userRole,
  onMobileMenuToggle,
}: StaffHeaderProps) {
  const pathname = usePathname();
  const { setCommandPaletteOpen } = useAppStore();

  // Generate simple breadcrumbs from pathname
  const paths = pathname.split("/").filter(Boolean);
  const breadcrumbs = paths.map((path) => {
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ");
  });

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border/60 bg-background/90 px-4 backdrop-blur-md md:px-6">
      
      {/* Left side: Mobile Toggle & Contexts */}
      <div className="flex items-center gap-3 md:gap-6">
        <button 
          onClick={onMobileMenuToggle}
          className="md:hidden p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-surface-hover"
        >
          <Menu className="h-5 w-5" />
        </button>

        <RestaurantSwitcher />

        {/* Desktop Breadcrumbs */}
        <nav className="hidden lg:flex items-center text-sm font-medium text-text-muted">
          <div className="flex items-center gap-2">
            <span className="hover:text-text-primary transition-colors cursor-default">RestaurantOS</span>
            {breadcrumbs.map((crumb, index) => (
              <div key={index} className="flex items-center gap-2">
                <ChevronRight className="h-3.5 w-3.5 text-zinc-600" />
                <span className={index === breadcrumbs.length - 1 ? "text-text-primary" : "hover:text-text-primary transition-colors cursor-default"}>
                  {crumb}
                </span>
              </div>
            ))}
          </div>
        </nav>
      </div>

      {/* Right side: Search, Notifications, Profile */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border/50 bg-surface-card hover:bg-surface-hover text-text-muted transition-colors mr-2"
        >
          <Search className="h-4 w-4" />
          <span className="text-xs font-medium">Search...</span>
          <kbd className="ml-4 px-1.5 py-0.5 text-[10px] font-mono bg-white/5 border border-white/10 rounded text-zinc-500">
            ⌘K
          </kbd>
        </button>

        {/* Mobile Search Icon */}
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="sm:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          <Search className="h-5 w-5" />
        </button>

        <NotificationCenter />
        
        <div className="h-6 w-px bg-border/60 mx-1 hidden sm:block" />
        
        <ProfileMenu userName={userName} userRole={userRole} />
      </div>
    </header>
  );
}
