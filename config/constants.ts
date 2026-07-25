// =============================================================================
// RestaurantOS: Global System Constants & Operational Configuration
// Immutable Contract Reference: ARCHITECTURE.md, WORKFLOWS.md
// =============================================================================

/**
 * Valid Operational User Roles in RestaurantOS.
 */
export const USER_ROLES = ['guest', 'waiter', 'kitchen', 'cashier', 'manager'] as const;
export type UserRole = (typeof USER_ROLES)[number];

/**
 * Table Occupancy Lifecycle States.
 */
export const TABLE_STATUSES = ['AVAILABLE', 'RESERVED', 'SEATED', 'DIRTY'] as const;
export type TableStatus = (typeof TABLE_STATUSES)[number];

/**
 * Table Reservation Queue States.
 */
export const RESERVATION_STATUSES = ['PENDING', 'CONFIRMED', 'SEATED', 'CANCELLED'] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

/**
 * Order Header Lifecycle States (Finite State Machine).
 */
export const ORDER_STATUSES = [
  'PLACED',
  'PREPARING',
  'READY',
  'SERVED',
  'BILLED',
  'CANCELLED',
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

/**
 * Kitchen Display System (KDS) Item Cooking States.
 */
export const ORDER_ITEM_STATUSES = ['QUEUED', 'COOKING', 'READY'] as const;
export type OrderItemStatus = (typeof ORDER_ITEM_STATUSES)[number];

/**
 * Accepted POS Cashier Payment Methods.
 */
export const PAYMENT_METHODS = ['CASH', 'CARD', 'DIGITAL_WALLET'] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

/**
 * Transaction Ledger Statuses.
 */
export const PAYMENT_STATUSES = ['PENDING', 'COMPLETED', 'VOID'] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

/**
 * Realtime Notification Action Alert Types.
 */
export const NOTIFICATION_TYPES = [
  'ORDER_READY',
  'WAITER_CALL',
  'INVENTORY_ALERT',
  'AI_INSIGHT',
] as const;
export type NotificationType = (typeof NOTIFICATION_TYPES)[number];

/**
 * Operational AI Diagnostic Categories & Urgency Levels.
 */
export const AI_INSIGHT_TYPES = ['INVENTORY_DEPLETION', 'DEMAND_VELOCITY', 'PREP_BOTTLENECK'] as const;
export type AiInsightType = (typeof AI_INSIGHT_TYPES)[number];

export const AI_URGENCY_LEVELS = ['NORMAL', 'WARNING', 'CRITICAL'] as const;
export type AiUrgencyLevel = (typeof AI_URGENCY_LEVELS)[number];

/**
 * Finite State Machine (FSM) Valid Transition Rules.
 * Enforces strict idempotent security across Server Actions.
 */
export const VALID_ORDER_TRANSITIONS: Record<OrderStatus, readonly OrderStatus[]> = {
  PLACED: ['PREPARING', 'CANCELLED'],
  PREPARING: ['READY', 'CANCELLED'],
  READY: ['SERVED', 'CANCELLED'],
  SERVED: ['BILLED'],
  BILLED: [],
  CANCELLED: [],
};

export const VALID_TABLE_TRANSITIONS: Record<TableStatus, readonly TableStatus[]> = {
  AVAILABLE: ['RESERVED', 'SEATED'],
  RESERVED: ['SEATED', 'AVAILABLE'],
  SEATED: ['DIRTY'],
  DIRTY: ['AVAILABLE'],
};

/**
 * Default AI Warning Thresholds & System Constants
 */
export const DEFAULT_AI_INVENTORY_WARNING_THRESHOLD = 15;
export const REALTIME_CHANNELS = {
  ORDERS_LIVE: 'orders:live',
  NOTIFICATIONS_ALERTS: 'notifications:alerts',
  TABLES_STATUS: 'tables:status',
} as const;
