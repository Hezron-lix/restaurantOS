export type FeatureFlag = 
  | "enable_ai_assistant"
  | "enable_advanced_analytics"
  | "enable_inventory_tracking"
  | "new_kds_layout";

// In a real app, this might come from a DB or Edge Config like LaunchDarkly/Vercel Edge Config.
// For RestaurantOS, we keep a hardcoded local map for early access control.
export const DEFAULT_FLAGS: Record<FeatureFlag, boolean> = {
  enable_ai_assistant: false,
  enable_advanced_analytics: true,
  enable_inventory_tracking: false,
  new_kds_layout: true,
};
