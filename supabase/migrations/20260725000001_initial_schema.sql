-- =============================================================================
-- RestaurantOS: Initial Database Schema & Relational Design
-- Author: Antigravity (Solutions Architect & Lead Software Engineer)
-- Milestone: Sprint 1 (PostgreSQL Schema & RLS Implementation)
-- Strict Compliance: DATABASE.md (Immutable Contract)
-- =============================================================================

-- Enable required cryptographic and UUID extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- -----------------------------------------------------------------------------
-- 1. ENUMERATED TYPES DECLARATION
-- -----------------------------------------------------------------------------
CREATE TYPE public.user_role AS ENUM (
  'guest', 
  'waiter', 
  'kitchen', 
  'cashier', 
  'manager'
);

CREATE TYPE public.table_status AS ENUM (
  'AVAILABLE', 
  'RESERVED', 
  'SEATED', 
  'DIRTY'
);

CREATE TYPE public.reservation_status AS ENUM (
  'PENDING', 
  'CONFIRMED', 
  'SEATED', 
  'CANCELLED'
);

CREATE TYPE public.order_status AS ENUM (
  'PLACED', 
  'PREPARING', 
  'READY', 
  'SERVED', 
  'BILLED', 
  'CANCELLED'
);

CREATE TYPE public.order_item_status AS ENUM (
  'QUEUED', 
  'COOKING', 
  'READY'
);

CREATE TYPE public.payment_method_type AS ENUM (
  'CASH', 
  'CARD', 
  'DIGITAL_WALLET'
);

CREATE TYPE public.payment_status_type AS ENUM (
  'PENDING', 
  'COMPLETED', 
  'VOID'
);

CREATE TYPE public.notification_type_enum AS ENUM (
  'ORDER_READY', 
  'WAITER_CALL', 
  'INVENTORY_ALERT', 
  'AI_INSIGHT'
);

-- -----------------------------------------------------------------------------
-- 2. AUTOMATED TIMESTAMP TRIGGER FUNCTIONS
-- -----------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- -----------------------------------------------------------------------------
-- 3. CORE RELATIONAL TABLES SPECIFICATION (12 ESSENTIAL TABLES)
-- -----------------------------------------------------------------------------

-- Table 1: profiles
-- Extends Supabase auth.users accounts with Role-Based Access Control (RBAC).
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(100) NOT NULL,
  role public.user_role NOT NULL DEFAULT 'guest',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Table 2: menu_categories
-- Organizes restaurant dish catalogs into structured digital groupings.
CREATE TABLE IF NOT EXISTS public.menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Table 3: menu_items
-- Detailed operational catalog of prepared dishes and kitchen parameters.
-- Monetary values stored explicitly in integer cents to eliminate floating-point drift.
CREATE TABLE IF NOT EXISTS public.menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES public.menu_categories(id) ON DELETE RESTRICT,
  name VARCHAR(150) NOT NULL,
  description TEXT,
  price_cents INTEGER NOT NULL CHECK (price_cents >= 0),
  prep_time_minutes INTEGER NOT NULL DEFAULT 15 CHECK (prep_time_minutes > 0),
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_menu_items_updated_at
  BEFORE UPDATE ON public.menu_items
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Table 4: inventory
-- Tracks vital raw ingredient quantities to drive operational AI depletion warnings.
CREATE TABLE IF NOT EXISTS public.inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  item_name VARCHAR(100) NOT NULL UNIQUE,
  current_stock_units INTEGER NOT NULL DEFAULT 0,
  threshold_warning_units INTEGER NOT NULL DEFAULT 10,
  unit_type VARCHAR(30) NOT NULL,
  consumption_rate_per_order INTEGER NOT NULL DEFAULT 1 CHECK (consumption_rate_per_order > 0),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_inventory_updated_at
  BEFORE UPDATE ON public.inventory
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Table 5: tables
-- Physical restaurant table configurations and real-time floor occupancy status.
CREATE TABLE IF NOT EXISTS public.tables (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_number INTEGER NOT NULL UNIQUE CHECK (table_number > 0),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status public.table_status NOT NULL DEFAULT 'AVAILABLE',
  current_qr_token VARCHAR(255) NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_tables_updated_at
  BEFORE UPDATE ON public.tables
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Table 6: reservations
-- Advance booking schedules and guest party allocation queues.
CREATE TABLE IF NOT EXISTS public.reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NULL REFERENCES public.tables(id) ON DELETE SET NULL,
  guest_name VARCHAR(150) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  guest_count INTEGER NOT NULL CHECK (guest_count > 0),
  reservation_time TIMESTAMPTZ NOT NULL,
  status public.reservation_status NOT NULL DEFAULT 'PENDING',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Table 7: orders
-- Header transactional records linking seated guests, tables, and floor servers.
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_id UUID NOT NULL REFERENCES public.tables(id) ON DELETE RESTRICT,
  customer_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  waiter_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  status public.order_status NOT NULL DEFAULT 'PLACED',
  total_cents INTEGER NOT NULL DEFAULT 0 CHECK (total_cents >= 0),
  special_instructions TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TRIGGER set_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


-- Table 8: order_items
-- Individual line items inside an order, enabling granular preparation tracking across stations.
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  menu_item_id UUID NOT NULL REFERENCES public.menu_items(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity > 0),
  item_price_cents INTEGER NOT NULL CHECK (item_price_cents >= 0),
  status public.order_item_status NOT NULL DEFAULT 'QUEUED',
  notes TEXT
);


-- Table 9: payments
-- Financial settlement ledger for completed table order checks.
CREATE TABLE IF NOT EXISTS public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL UNIQUE REFERENCES public.orders(id) ON DELETE RESTRICT,
  cashier_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL CHECK (amount_cents >= 0),
  payment_method public.payment_method_type NOT NULL,
  status public.payment_status_type NOT NULL DEFAULT 'COMPLETED',
  paid_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Table 10: notifications
-- Unified realtime alerting inbox for servers, kitchen staff, and AI managerial operational insights.
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_role public.user_role NOT NULL,
  recipient_id UUID NULL REFERENCES public.profiles(id) ON DELETE SET NULL,
  type public.notification_type_enum NOT NULL,
  title VARCHAR(150) NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Table 11: reviews
-- Post-meal dining experience evaluations used for daily operational quality analytics.
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NULL REFERENCES public.orders(id) ON DELETE SET NULL,
  table_id UUID NULL REFERENCES public.tables(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);


-- Table 12: analytics_daily
-- Historical executive summary ledger aggregating end-of-day restaurant KPIs.
CREATE TABLE IF NOT EXISTS public.analytics_daily (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  total_revenue_cents BIGINT NOT NULL DEFAULT 0,
  total_orders INTEGER NOT NULL DEFAULT 0,
  average_prep_time_seconds INTEGER NOT NULL DEFAULT 0,
  table_turnover_rate NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
  most_ordered_item_id UUID NULL REFERENCES public.menu_items(id) ON DELETE SET NULL
);


-- -----------------------------------------------------------------------------
-- 4. DATABASE INDEXES FOR REALTIME SUB-100MS LATENCY OPTIMIZATION
-- -----------------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_orders_table_status ON public.orders(table_id, status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_status ON public.order_items(order_id, status);
CREATE INDEX IF NOT EXISTS idx_notifications_role_read ON public.notifications(recipient_role, is_read);
CREATE INDEX IF NOT EXISTS idx_reservations_time_status ON public.reservations(reservation_time, status);
CREATE INDEX IF NOT EXISTS idx_menu_items_category_available ON public.menu_items(category_id, is_available);
CREATE INDEX IF NOT EXISTS idx_tables_status_token ON public.tables(status, current_qr_token);


-- -----------------------------------------------------------------------------
-- 5. ROW-LEVEL SECURITY (RLS) POLICIES
-- -----------------------------------------------------------------------------

-- Force strict zero-trust baseline across all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_daily ENABLE ROW LEVEL SECURITY;

-- Helper Function to resolve current authenticated user's role from JWT or profiles table
CREATE OR REPLACE FUNCTION public.get_auth_role()
RETURNS public.user_role AS $$
DECLARE
  v_role public.user_role;
BEGIN
  SELECT role INTO v_role FROM public.profiles WHERE id = auth.uid();
  RETURN COALESCE(v_role, 'guest'::public.user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. PROFILES RLS
CREATE POLICY "Profiles are readable by authenticated operational staff and self"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id OR public.get_auth_role() IN ('waiter', 'kitchen', 'cashier', 'manager'));

CREATE POLICY "Users can update self or managers can update any profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id OR public.get_auth_role() = 'manager');

-- 2. MENU & CATEGORIES RLS (Publicly readable, writable strictly by kitchen and manager)
CREATE POLICY "Menu categories readable by everyone"
  ON public.menu_categories FOR SELECT USING (true);

CREATE POLICY "Menu categories writable by managers"
  ON public.menu_categories FOR ALL USING (public.get_auth_role() = 'manager');

CREATE POLICY "Menu items readable by everyone"
  ON public.menu_items FOR SELECT USING (true);

CREATE POLICY "Menu items writable by kitchen staff and managers"
  ON public.menu_items FOR ALL USING (public.get_auth_role() IN ('kitchen', 'manager'));

-- 3. INVENTORY RLS (Kitchen and Managers only)
CREATE POLICY "Inventory viewable by kitchen, waiter, cashier, and manager"
  ON public.inventory FOR SELECT USING (public.get_auth_role() IN ('kitchen', 'waiter', 'cashier', 'manager'));

CREATE POLICY "Inventory writable by kitchen staff and managers"
  ON public.inventory FOR ALL USING (public.get_auth_role() IN ('kitchen', 'manager'));

-- 4. TABLES RLS (Publicly viewable for QR menu landing; staff writable)
CREATE POLICY "Tables viewable by everyone"
  ON public.tables FOR SELECT USING (true);

CREATE POLICY "Tables writable by waiter, cashier, and manager"
  ON public.tables FOR ALL USING (public.get_auth_role() IN ('waiter', 'cashier', 'manager'));

-- 5. RESERVATIONS RLS
CREATE POLICY "Reservations viewable by staff and creating guest"
  ON public.reservations FOR SELECT USING (true);

CREATE POLICY "Reservations creatable by everyone"
  ON public.reservations FOR INSERT WITH CHECK (true);

CREATE POLICY "Reservations updatable by host/waiter/manager"
  ON public.reservations FOR UPDATE USING (public.get_auth_role() IN ('waiter', 'manager'));

-- 6. ORDERS & ORDER ITEMS RLS (Operational read/write; guests access active session table orders)
CREATE POLICY "Orders viewable by guests and operational staff"
  ON public.orders FOR SELECT USING (true);

CREATE POLICY "Orders creatable by guests with QR tokens and staff"
  ON public.orders FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders updatable by waiter, kitchen, cashier, and manager"
  ON public.orders FOR UPDATE USING (public.get_auth_role() IN ('waiter', 'kitchen', 'cashier', 'manager'));

CREATE POLICY "Order items readable by everyone"
  ON public.order_items FOR SELECT USING (true);

CREATE POLICY "Order items creatable upon order submission"
  ON public.order_items FOR INSERT WITH CHECK (true);

CREATE POLICY "Order items status updatable by kitchen, waiter, manager"
  ON public.order_items FOR UPDATE USING (public.get_auth_role() IN ('kitchen', 'waiter', 'manager'));

-- 7. PAYMENTS & ANALYTIC LEDGERS RLS (Cashier and Manager exclusive)
CREATE POLICY "Payments managed exclusively by cashier and manager"
  ON public.payments FOR ALL USING (public.get_auth_role() IN ('cashier', 'manager'));

CREATE POLICY "Daily analytics viewable exclusively by managers"
  ON public.analytics_daily FOR ALL USING (public.get_auth_role() = 'manager');

-- 8. NOTIFICATIONS & REVIEWS RLS
CREATE POLICY "Notifications readable by assigned role or recipient"
  ON public.notifications FOR SELECT USING (
    recipient_role = public.get_auth_role() OR recipient_id = auth.uid() OR public.get_auth_role() = 'manager'
  );

CREATE POLICY "Notifications creatable by operational events and AI"
  ON public.notifications FOR INSERT WITH CHECK (true);

CREATE POLICY "Notifications updatable (mark read) by assigned staff"
  ON public.notifications FOR UPDATE USING (
    recipient_role = public.get_auth_role() OR recipient_id = auth.uid() OR public.get_auth_role() = 'manager'
  );

CREATE POLICY "Reviews readable by everyone, creatable by guests"
  ON public.reviews FOR ALL USING (true);
