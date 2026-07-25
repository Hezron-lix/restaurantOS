-- =============================================================================
-- RestaurantOS: Database Schema Rollback & Teardown Contract (Down Migration)
-- Purpose: Safely rolls back the initial 12-table relational schema, triggers,
-- RLS policies, indexes, helper functions, and custom PostgreSQL ENUM types.
-- =============================================================================

-- 1. Drop operational tables in reverse dependency hierarchy to prevent FK constraint violations
DROP TABLE IF EXISTS public.analytics_daily CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;
DROP TABLE IF EXISTS public.payments CASCADE;
DROP TABLE IF EXISTS public.order_items CASCADE;
DROP TABLE IF EXISTS public.orders CASCADE;
DROP TABLE IF EXISTS public.reservations CASCADE;
DROP TABLE IF EXISTS public.tables CASCADE;
DROP TABLE IF EXISTS public.inventory CASCADE;
DROP TABLE IF EXISTS public.menu_items CASCADE;
DROP TABLE IF EXISTS public.menu_categories CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Drop RLS and Timestamp Helper Functions
DROP FUNCTION IF EXISTS public.get_auth_role() CASCADE;
DROP FUNCTION IF EXISTS public.handle_updated_at() CASCADE;

-- 3. Drop Custom PostgreSQL ENUM Domain Types
DROP TYPE IF EXISTS public.user_role CASCADE;
DROP TYPE IF EXISTS public.table_status CASCADE;
DROP TYPE IF EXISTS public.reservation_status CASCADE;
DROP TYPE IF EXISTS public.order_status CASCADE;
DROP TYPE IF EXISTS public.order_item_status CASCADE;
DROP TYPE IF EXISTS public.payment_method_type CASCADE;
DROP TYPE IF EXISTS public.payment_status_type CASCADE;
DROP TYPE IF EXISTS public.notification_type_enum CASCADE;

-- 4. Notify completion
DO $$
BEGIN
  RAISE NOTICE '✨ RestaurantOS schema rollback completed successfully. All 12 tables, indexes, functions, and custom enums have been removed.';
END $$;
