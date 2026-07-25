// =============================================================================
// RestaurantOS: Centralized TypeScript Database & Domain Types
// Immutable Contract Reference: DATABASE.md, ARCHITECTURE.md, API.md, AI.md
// Note: Type aliases are used over interfaces to ensure structural index 
// assignability with @supabase/postgrest-js Record<string, unknown> generics.
// =============================================================================

import type {
  UserRole,
  TableStatus,
  ReservationStatus,
  OrderStatus,
  OrderItemStatus,
  PaymentMethod,
  PaymentStatus,
  NotificationType,
  AiInsightType,
  AiUrgencyLevel,
} from '../config/constants';

export type {
  UserRole,
  TableStatus,
  ReservationStatus,
  OrderStatus,
  OrderItemStatus,
  PaymentMethod,
  PaymentStatus,
  NotificationType,
  AiInsightType,
  AiUrgencyLevel,
};

// -----------------------------------------------------------------------------
// 1. DATABASE ENTITY RECORD TYPES (ROW TYPES)
// -----------------------------------------------------------------------------

export type ProfileRecord = {
  id: string; // UUID references auth.users(id)
  email: string;
  full_name: string;
  role: UserRole;
  restaurant_id: string | null;
  created_at: string;
  updated_at: string;
};

export type RestaurantRecord = {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  timezone: string;
  currency: string;
  created_at: string;
};

export type MenuCategoryRecord = {
  id: string;
  restaurant_id: string | null;
  name: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
};

export type MenuItemRecord = {
  id: string;
  category_id: string;
  name: string;
  description: string | null;
  price_cents: number;
  prep_time_minutes: number;
  image_url: string | null;
  is_available: boolean;
  created_at: string;
  updated_at: string;
};

export type InventoryRecord = {
  id: string;
  item_name: string;
  current_stock_units: number;
  threshold_warning_units: number;
  unit_type: string;
  consumption_rate_per_order: number;
  updated_at: string;
};

export type TableRecord = {
  id: string;
  restaurant_id: string | null;
  table_number: number;
  capacity: number;
  status: TableStatus;
  current_qr_token: string | null;
  updated_at: string;
};

export type ReservationRecord = {
  id: string;
  table_id: string | null;
  guest_name: string;
  phone: string;
  guest_count: number;
  reservation_time: string;
  status: ReservationStatus;
  created_at: string;
};

export type OrderRecord = {
  id: string;
  restaurant_id: string | null;
  table_id: string;
  customer_id: string | null;
  waiter_id: string | null;
  status: OrderStatus;
  total_cents: number;
  special_instructions: string | null;
  created_at: string;
  updated_at: string;
};

export type OrderItemRecord = {
  id: string;
  order_id: string;
  menu_item_id: string;
  quantity: number;
  item_price_cents: number;
  status: OrderItemStatus;
  notes: string | null;
};

export type PaymentRecord = {
  id: string;
  order_id: string;
  cashier_id: string | null;
  amount_cents: number;
  payment_method: PaymentMethod;
  status: PaymentStatus;
  paid_at: string;
};

export type NotificationRecord = {
  id: string;
  recipient_role: UserRole;
  recipient_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export type ReviewRecord = {
  id: string;
  order_id: string | null;
  table_id: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type AnalyticsDailyRecord = {
  id: string;
  date: string;
  total_revenue_cents: number;
  total_orders: number;
  average_prep_time_seconds: number;
  table_turnover_rate: number;
  most_ordered_item_id: string | null;
};

export type RestaurantActivityRecord = {
  id: string;
  restaurant_id: string;
  type: string;
  title: string;
  description: string | null;
  icon_name: string | null;
  color_class: string | null;
  bg_class: string | null;
  created_at: string;
};

// -----------------------------------------------------------------------------
// 2. EXPLICIT INSERT & UPDATE TYPES
// -----------------------------------------------------------------------------

export type ProfileInsert = {
  id: string;
  email: string;
  full_name: string;
  role?: UserRole;
  restaurant_id?: string | null;
  created_at?: string;
  updated_at?: string;
};
export type ProfileUpdate = Partial<ProfileInsert>;

export type RestaurantInsert = {
  id?: string;
  name: string;
  slug: string;
  logo_url?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  country?: string | null;
  timezone?: string;
  currency?: string;
  created_at?: string;
};
export type RestaurantUpdate = Partial<RestaurantInsert>;

export type MenuCategoryInsert = {
  id?: string;
  restaurant_id?: string | null;
  name: string;
  description?: string | null;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
};
export type MenuCategoryUpdate = Partial<MenuCategoryInsert>;

export type MenuItemInsert = {
  id?: string;
  category_id: string;
  name: string;
  description?: string | null;
  price_cents: number;
  prep_time_minutes?: number;
  image_url?: string | null;
  is_available?: boolean;
  created_at?: string;
  updated_at?: string;
};
export type MenuItemUpdate = Partial<MenuItemInsert>;

export type InventoryInsert = {
  id?: string;
  item_name: string;
  current_stock_units?: number;
  threshold_warning_units?: number;
  unit_type: string;
  consumption_rate_per_order?: number;
  updated_at?: string;
};
export type InventoryUpdate = Partial<InventoryInsert>;

export type TableInsert = {
  id?: string;
  restaurant_id?: string | null;
  table_number: number;
  capacity: number;
  status?: TableStatus;
  current_qr_token?: string | null;
  updated_at?: string;
};
export type TableUpdate = Partial<TableInsert>;

export type ReservationInsert = {
  id?: string;
  table_id?: string | null;
  guest_name: string;
  phone: string;
  guest_count: number;
  reservation_time: string;
  status?: ReservationStatus;
  created_at?: string;
};
export type ReservationUpdate = Partial<ReservationInsert>;

export type OrderInsert = {
  id?: string;
  restaurant_id?: string | null;
  table_id: string;
  customer_id?: string | null;
  waiter_id?: string | null;
  status?: OrderStatus;
  total_cents?: number;
  special_instructions?: string | null;
  created_at?: string;
  updated_at?: string;
};
export type OrderUpdate = Partial<OrderInsert>;

export type OrderItemInsert = {
  id?: string;
  order_id: string;
  menu_item_id: string;
  quantity?: number;
  item_price_cents: number;
  status?: OrderItemStatus;
  notes?: string | null;
};
export type OrderItemUpdate = Partial<OrderItemInsert>;

export type PaymentInsert = {
  id?: string;
  order_id: string;
  cashier_id?: string | null;
  amount_cents: number;
  payment_method: PaymentMethod;
  status?: PaymentStatus;
  paid_at?: string;
};
export type PaymentUpdate = Partial<PaymentInsert>;

export type NotificationInsert = {
  id?: string;
  recipient_role: UserRole;
  recipient_id?: string | null;
  type: NotificationType;
  title: string;
  message: string;
  is_read?: boolean;
  created_at?: string;
};
export type NotificationUpdate = Partial<NotificationInsert>;

export type ReviewInsert = {
  id?: string;
  order_id?: string | null;
  table_id?: string | null;
  rating: number;
  comment?: string | null;
  created_at?: string;
};
export type ReviewUpdate = Partial<ReviewInsert>;

export type AnalyticsDailyInsert = {
  id?: string;
  date: string;
  total_revenue_cents?: number;
  total_orders?: number;
  average_prep_time_seconds?: number;
  table_turnover_rate?: number;
  most_ordered_item_id?: string | null;
};
export type AnalyticsDailyUpdate = Partial<AnalyticsDailyInsert>;

export type RestaurantActivityInsert = {
  id?: string;
  restaurant_id: string;
  type: string;
  title: string;
  description?: string | null;
  icon_name?: string | null;
  color_class?: string | null;
  bg_class?: string | null;
  created_at?: string;
};
export type RestaurantActivityUpdate = Partial<RestaurantActivityInsert>;

export type Relationship = {
  foreignKeyName: string;
  columns: string[];
  isOneToOne?: boolean;
  referencedRelation: string;
  referencedColumns: string[];
};

// -----------------------------------------------------------------------------
// 3. SUPABASE DATABASE SCHEMA MAPPING
// -----------------------------------------------------------------------------

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: RestaurantRecord;
        Insert: RestaurantInsert;
        Update: RestaurantUpdate;
        Relationships: Relationship[];
      };
      profiles: {
        Row: ProfileRecord;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
        Relationships: Relationship[];
      };
      menu_categories: {
        Row: MenuCategoryRecord;
        Insert: MenuCategoryInsert;
        Update: MenuCategoryUpdate;
        Relationships: Relationship[];
      };
      menu_items: {
        Row: MenuItemRecord;
        Insert: MenuItemInsert;
        Update: MenuItemUpdate;
        Relationships: Relationship[];
      };
      inventory: {
        Row: InventoryRecord;
        Insert: InventoryInsert;
        Update: InventoryUpdate;
        Relationships: Relationship[];
      };
      tables: {
        Row: TableRecord;
        Insert: TableInsert;
        Update: TableUpdate;
        Relationships: Relationship[];
      };
      reservations: {
        Row: ReservationRecord;
        Insert: ReservationInsert;
        Update: ReservationUpdate;
        Relationships: Relationship[];
      };
      orders: {
        Row: OrderRecord;
        Insert: OrderInsert;
        Update: OrderUpdate;
        Relationships: Relationship[];
      };
      order_items: {
        Row: OrderItemRecord;
        Insert: OrderItemInsert;
        Update: OrderItemUpdate;
        Relationships: Relationship[];
      };
      payments: {
        Row: PaymentRecord;
        Insert: PaymentInsert;
        Update: PaymentUpdate;
        Relationships: Relationship[];
      };
      notifications: {
        Row: NotificationRecord;
        Insert: NotificationInsert;
        Update: NotificationUpdate;
        Relationships: Relationship[];
      };
      reviews: {
        Row: ReviewRecord;
        Insert: ReviewInsert;
        Update: ReviewUpdate;
        Relationships: Relationship[];
      };
      analytics_daily: {
        Row: AnalyticsDailyRecord;
        Insert: AnalyticsDailyInsert;
        Update: AnalyticsDailyUpdate;
        Relationships: Relationship[];
      };
      restaurant_activities: {
        Row: RestaurantActivityRecord;
        Insert: RestaurantActivityInsert;
        Update: RestaurantActivityUpdate;
        Relationships: Relationship[];
      };
    };
    Views: {
      [_ in never]: {
        Row: Record<string, unknown>;
        Relationships: Relationship[];
      };
    };
    Functions: {
      [_ in never]: {
        Args: Record<string, unknown>;
        Returns: unknown;
      };
    };
    Enums: {
      user_role: UserRole;
      table_status: TableStatus;
      reservation_status: ReservationStatus;
      order_status: OrderStatus;
      order_item_status: OrderItemStatus;
      payment_method_type: PaymentMethod;
      payment_status_type: PaymentStatus;
      notification_type_enum: NotificationType;
    };
    CompositeTypes: {
      [_ in never]: Record<string, unknown>;
    };
  };
};

// -----------------------------------------------------------------------------
// 4. SPECIALIZED APPLICATION DTOs & RESPONSE ENVELOPES
// -----------------------------------------------------------------------------

export type ActionError = {
  code:
    | 'VALIDATION_ERROR'
    | 'AUTHENTICATION_ERROR'
    | 'AUTHORIZATION_ERROR'
    | 'NOT_FOUND'
    | 'STATE_CONFLICT'
    | 'INTERNAL_ERROR';
  message: string;
  fieldErrors?: Record<string, string[]>;
};

export type ActionResponse<T = void> =
  | {
      success: true;
      data: T;
      message?: string;
      timestamp: string;
    }
  | {
      success: false;
      error: ActionError;
      timestamp: string;
    };

export type OrderDTO = OrderRecord & {
  items: OrderItemRecord[];
  table?: TableRecord;
  customer?: ProfileRecord;
  waiter?: ProfileRecord;
};

export type BillSummaryDTO = {
  order_id: string;
  table_number: number;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  items_count: number;
  is_paid: boolean;
};

export type AiOperationalInsightDTO = {
  insight_type: AiInsightType;
  urgency_level: AiUrgencyLevel;
  title: string;
  message: string;
  recommended_action?: string;
  affected_entity_id?: string;
};
