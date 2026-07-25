-- =============================================================================
-- Migration: Fix Chicken-and-Egg RLS on restaurants INSERT
-- Root Cause:
--   PostgREST translates `.insert().select()` into `INSERT ... RETURNING *`.
--   In PostgreSQL (and PostgREST's internal CTE view with WITH CHECK OPTION),
--   rows returned by RETURNING must pass the SELECT policy.
--   When a new restaurant is inserted, its ID is not yet linked in the user's
--   profile, so the SELECT policy evaluated to FALSE. This caused PostgREST
--   to raise '42501: new row violates row-level security policy'.
-- Fix:
--   Allow newly created (unclaimed) restaurants to be visible. Once the
--   application code updates the user's profile with the new restaurant_id
--   (immediately after the insert), the restaurant is claimed, and the strict
--   role-based isolation takes over.
-- =============================================================================

DROP POLICY IF EXISTS "Users can view their own restaurant" ON public.restaurants;
CREATE POLICY "Users can view their own restaurant" 
ON public.restaurants 
FOR SELECT 
USING (
  id IN (
    SELECT restaurant_id FROM public.profiles WHERE profiles.id = auth.uid()
  )
  OR
  NOT EXISTS (
    SELECT 1 FROM public.profiles WHERE restaurant_id = restaurants.id
  )
);
