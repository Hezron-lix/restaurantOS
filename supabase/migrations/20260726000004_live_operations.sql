-- =============================================================================
-- Migration: Add Live Operations & Realtime Capabilities
-- Description: Extends table states, adds activities table, enables Realtime
-- =============================================================================

-- 1. Extend table_status ENUM
-- PostgreSQL doesn't support IF NOT EXISTS for ADD VALUE directly inside a transaction block safely in all versions, 
-- but Supabase migrations typically run as blocks. We will use a DO block.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'table_status' AND e.enumlabel = 'PREPARING') THEN
    ALTER TYPE public.table_status ADD VALUE 'PREPARING';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'table_status' AND e.enumlabel = 'READY') THEN
    ALTER TYPE public.table_status ADD VALUE 'READY';
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_type t JOIN pg_enum e ON t.oid = e.enumtypid WHERE t.typname = 'table_status' AND e.enumlabel = 'CLEANING') THEN
    ALTER TYPE public.table_status ADD VALUE 'CLEANING';
  END IF;
END $$;

-- 2. Create Restaurant Activities (Timeline)
CREATE TABLE IF NOT EXISTS public.restaurant_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(150) NOT NULL,
  description TEXT,
  icon_name VARCHAR(50) DEFAULT 'Activity',
  color_class VARCHAR(50) DEFAULT 'text-brand',
  bg_class VARCHAR(50) DEFAULT 'bg-brand/10',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for timeline queries
CREATE INDEX IF NOT EXISTS idx_restaurant_activities_timeline ON public.restaurant_activities(restaurant_id, created_at DESC);

-- RLS for activities
ALTER TABLE public.restaurant_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Activities viewable by all staff"
  ON public.restaurant_activities FOR SELECT 
  USING (true); -- Application layer will filter by restaurant_id via StaffProviders

CREATE POLICY "Activities creatable by system and staff"
  ON public.restaurant_activities FOR INSERT 
  WITH CHECK (true);

-- 3. Enable Supabase Realtime Publication
-- Note: 'supabase_realtime' publication usually exists, we add tables to it.
-- If it doesn't exist, this will throw, but Supabase creates it by default.
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    CREATE PUBLICATION supabase_realtime FOR ALL TABLES;
  ELSE
    ALTER PUBLICATION supabase_realtime ADD TABLE orders, tables, restaurant_activities, notifications;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN
    -- Table might already be in the publication, ignore
    NULL;
END $$;
