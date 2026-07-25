"use client";

import * as React from "react";
import type { User } from "@supabase/supabase-js";

import type { RestaurantRecord } from "@/types/database";

// Context definitions for the application shell
type AuthContextType = { user: User | null; profile: Record<string, unknown> | null };
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

type RestaurantContextType = { 
  restaurant: RestaurantRecord | null; 
  setRestaurant: (restaurant: RestaurantRecord) => void 
};
const RestaurantContext = React.createContext<RestaurantContextType | undefined>(undefined);



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

export function RestaurantProvider({ children, initialRestaurant }: { children: React.ReactNode, initialRestaurant: RestaurantRecord | null }) {
  const [restaurant, setRestaurant] = React.useState<RestaurantRecord | null>(initialRestaurant);
  return (
    <RestaurantContext.Provider value={{ restaurant, setRestaurant }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = React.useContext(RestaurantContext);
  if (context === undefined) {
    throw new Error("useRestaurant must be used within a RestaurantProvider");
  }
  return context;
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



// Master Provider for Staff Shell
export function StaffProviders({ 
  children, 
  initialSession, 
  initialRestaurant 
}: { 
  children: React.ReactNode; 
  initialSession: AuthContextType;
  initialRestaurant?: RestaurantRecord;
}) {
  return (
    <AuthProvider initialSession={initialSession}>
      <RestaurantProvider initialRestaurant={initialRestaurant ?? null}>
        <RealtimeProvider>
          {children}
        </RealtimeProvider>
      </RestaurantProvider>
    </AuthProvider>
  );
}
