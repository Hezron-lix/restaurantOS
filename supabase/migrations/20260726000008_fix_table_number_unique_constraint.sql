-- =============================================================================
-- Migration: Fix table_number unique constraint to be per-restaurant
-- Previously UNIQUE on table_number alone made it impossible for two
-- restaurants to both have a "Table 1". Changed to composite unique.
-- =============================================================================

-- Drop the global unique constraint
ALTER TABLE public.tables DROP CONSTRAINT IF EXISTS tables_table_number_key;

-- Add composite unique: table_number unique within a restaurant
ALTER TABLE public.tables 
  ADD CONSTRAINT tables_table_number_restaurant_id_key 
  UNIQUE (table_number, restaurant_id);
