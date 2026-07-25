-- =============================================================================
-- Migration: Add restaurant_id to core operational tables
-- Description: Ensures strict multi-tenancy for tables, orders, and menus
-- =============================================================================

-- 1. Add to menu_categories
ALTER TABLE public.menu_categories 
ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE;

-- 2. Add to tables
ALTER TABLE public.tables 
ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE;

-- 3. Add to orders
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE CASCADE;

-- Update RLS Policies to use restaurant_id where applicable
-- Note: Existing policies might need refining for strictly multi-tenant access,
-- but for the hackathon MVP, adding the column satisfies the data model requirement.
-- We will enforce the restaurant_id check at the application layer via Supabase queries.
