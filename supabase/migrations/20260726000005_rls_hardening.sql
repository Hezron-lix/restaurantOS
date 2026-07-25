-- =============================================================================
-- Migration: RLS Hardening for Multi-Tenancy
-- Description: Enforces restaurant_id isolation at the database row level
-- =============================================================================

-- Drop the overly permissive operational policies
DROP POLICY IF EXISTS "Orders viewable by guests and operational staff" ON public.orders;
DROP POLICY IF EXISTS "Orders updatable by waiter, kitchen, cashier, and manager" ON public.orders;
DROP POLICY IF EXISTS "Tables viewable by everyone" ON public.tables;
DROP POLICY IF EXISTS "Tables writable by waiter, cashier, and manager" ON public.tables;

-- Orders RLS (Strict Isolation)
CREATE POLICY "Orders viewable by restaurant staff and active guests"
  ON public.orders FOR SELECT USING (
    (public.get_auth_role() IN ('waiter', 'kitchen', 'cashier', 'manager') AND restaurant_id IN (SELECT restaurant_id FROM public.profiles WHERE profiles.id = auth.uid()))
    OR (customer_id = auth.uid())
  );

CREATE POLICY "Orders updatable by assigned restaurant staff"
  ON public.orders FOR UPDATE USING (
    public.get_auth_role() IN ('waiter', 'kitchen', 'cashier', 'manager') 
    AND restaurant_id IN (SELECT restaurant_id FROM public.profiles WHERE profiles.id = auth.uid())
  );

-- Tables RLS (Strict Isolation)
CREATE POLICY "Tables viewable by assigned restaurant staff"
  ON public.tables FOR SELECT USING (
    public.get_auth_role() IN ('waiter', 'kitchen', 'cashier', 'manager') 
    AND restaurant_id IN (SELECT restaurant_id FROM public.profiles WHERE profiles.id = auth.uid())
  );

CREATE POLICY "Tables writable by assigned restaurant staff"
  ON public.tables FOR ALL USING (
    public.get_auth_role() IN ('waiter', 'cashier', 'manager') 
    AND restaurant_id IN (SELECT restaurant_id FROM public.profiles WHERE profiles.id = auth.uid())
  );
