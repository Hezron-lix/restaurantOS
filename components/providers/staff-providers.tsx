"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";

// Context definitions for the application shell
type AuthContextType = { user: User | null; profile: Record<string, unknown> | null };
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

type RestaurantContextType = { restaurantId: string | null; setRestaurantId: (id: string) => void };
const RestaurantContext = React.createContext<RestaurantContextType | undefined>(undefined);

type CommandPaletteContextType = { isOpen: boolean; setIsOpen: (v: boolean) => void };
const CommandPaletteContext = React.createContext<CommandPaletteContextType | undefined>(undefined);

// Providers
export function AuthProvider({ children, initialSession }: { children: React.ReactNode; initialSession: AuthContextType }) {
  // In a real implementation, this would listen to Supabase auth state changes
  return <AuthContext.Provider value={initialSession}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [restaurantId, setRestaurantId] = React.useState<string | null>(null);
  return (
    <RestaurantContext.Provider value={{ restaurantId, setRestaurantId }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  // Setup Supabase WebSocket connections globally for the staff session
  React.useEffect(() => {
    // connect realtime channels
    return () => {
      // disconnect
    };
  }, []);
  
  return <>{children}</>;
}

export function CommandPaletteProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = React.useState(false);
  
  // Listen for Cmd+K globally
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <CommandPaletteContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
      {/* Command Palette UI would render here if isOpen is true */}
    </CommandPaletteContext.Provider>
  );
}

// Master Provider for Staff Shell
export function StaffProviders({ children, initialSession }: { children: React.ReactNode; initialSession: AuthContextType }) {
  return (
    <AuthProvider initialSession={initialSession}>
      <RestaurantProvider>
        <RealtimeProvider>
          <CommandPaletteProvider>
            {children}
          </CommandPaletteProvider>
        </RealtimeProvider>
      </RestaurantProvider>
    </AuthProvider>
  );
}
