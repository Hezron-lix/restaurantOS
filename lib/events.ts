/**
 * RestaurantOS Strongly Typed Lightweight Event Bus
 * 
 * Used for cross-component communication where React Context or Zustand is overkill.
 * Useful for triggering global notifications, print commands, or isolated UI updates.
 */

// Define the payload structure for each specific event
export type AppEventMap = {
  ORDER_CREATED: { orderId: string; tableId?: string };
  ORDER_UPDATED: { orderId: string; status: string };
  ORDER_COMPLETED: { orderId: string };
  TABLE_SEATED: { tableId: string; guests: number };
  TABLE_CLOSED: { tableId: string };
  NOTIFICATION_CREATED: { title: string; message: string; type?: "info" | "success" | "warning" | "error" };
  FORCE_REFRESH: { component?: string };
};

export type AppEventName = keyof AppEventMap;

type EventCallback<K extends AppEventName> = (payload: AppEventMap[K]) => void;

class EventBus {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private listeners: Record<string, EventCallback<any>[]> = {};

  on<K extends AppEventName>(event: K, callback: EventCallback<K>) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);

    // Provide a cleanup function
    return () => this.off(event, callback);
  }

  off<K extends AppEventName>(event: K, callback: EventCallback<K>) {
    if (!this.listeners[event]) return;
    this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback);
  }

  emit<K extends AppEventName>(event: K, payload: AppEventMap[K]) {
    if (!this.listeners[event]) return;
    this.listeners[event].forEach((callback) => callback(payload));
  }
}

export const appEvents = new EventBus();
