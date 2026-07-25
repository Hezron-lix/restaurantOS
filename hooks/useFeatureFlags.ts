"use client";

import { DEFAULT_FLAGS, type FeatureFlag } from "@/config/flags";
import { useMemo } from "react";

export function useFeatureFlags() {
  // In the future, this hook could fetch from Context or an API.
  // Currently, it evaluates the local hardcoded flags.
  
  const flags = DEFAULT_FLAGS;

  const isEnabled = useMemo(() => {
    return (flag: FeatureFlag) => Boolean(flags[flag]);
  }, [flags]);

  return { isEnabled, flags };
}
