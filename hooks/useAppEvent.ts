"use client";

import { useEffect, useCallback } from "react";
import { appEvents, type AppEventName, type AppEventMap } from "@/lib/events";

/**
 * Hook to listen for global application events.
 * The payload type is automatically inferred from the event name.
 */
export function useAppEventListener<K extends AppEventName>(
  event: K,
  callback: (payload: AppEventMap[K]) => void
) {
  useEffect(() => {
    const unsubscribe = appEvents.on(event, callback);
    return () => {
      unsubscribe();
    };
  }, [event, callback]);
}

/**
 * Hook to emit global application events.
 * Provides strict type checking for the payload based on the event name.
 */
export function useAppEventEmit() {
  const emit = useCallback(<K extends AppEventName>(event: K, payload: AppEventMap[K]) => {
    appEvents.emit(event, payload);
  }, []);
  return emit;
}
