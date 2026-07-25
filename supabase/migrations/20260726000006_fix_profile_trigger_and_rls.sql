-- =============================================================================
-- Migration: Fix profile auto-creation trigger + RLS policies
-- Fixes:
--   1. No profile row is created when a user registers (PGRST116)
--   2. restaurants INSERT blocked by 42501 because auth.uid() resolves as
--      unauthenticated when no session cookie is present after signUp
--      (email-confirmation flow leaves user unconfirmed = no session)
--
-- Root causes:
--   A. registerWithEmail calls supabase.auth.signUp() but never inserts into
--      public.profiles. There is no trigger on auth.users to create the row.
--      Every downstream query that requires a profile row (idempotency check,
--      get_auth_role(), staff layout) therefore returns 0 rows.
--
--   B. When Supabase "Confirm email" setting is ON, signUp() does NOT return a
--      session. The user cookie is absent on the subsequent /onboarding request.
--      auth.uid() returns NULL inside RLS, which causes the INSERT policy
--      (WITH CHECK (auth.uid() IS NOT NULL)) to evaluate to false → 42501.
--
-- Fixes applied in this migration:
--   1. Create a trigger function on auth.users that auto-inserts a profile row
--      whenever a new user signs up. Uses SECURITY DEFINER so it runs as the
--      postgres superuser and bypasses RLS.
--   2. Add an INSERT policy on public.profiles so the trigger (and the server
--      action as a fallback) can create the row.
--   3. Keep the restaurants INSERT policy permissive for authenticated users.
--      The application-layer idempotency check is the primary duplicate guard.
-- =============================================================================

-- ── 1. Profile auto-creation trigger ─────────────────────────────────────────
-- This function fires after every INSERT on auth.users (i.e., every sign-up).
-- It creates the corresponding public.profiles row using the metadata supplied
-- during auth.signUp({ options: { data: { full_name: "..." } } }).
-- SECURITY DEFINER means it runs as the table owner (postgres), bypassing RLS.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    'guest'::public.user_role
  )
  ON CONFLICT (id) DO NOTHING; -- idempotent: safe if trigger fires twice
  RETURN NEW;
END;
$$;

-- Drop existing trigger if it exists (safe re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Attach trigger to auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- ── 2. INSERT policy on profiles ──────────────────────────────────────────────
-- The trigger runs as SECURITY DEFINER so it bypasses RLS — but we also add
-- this policy so that the server action can insert a profile as a fallback
-- if the trigger did not fire (e.g., existing users who registered before
-- this migration was applied).
DROP POLICY IF EXISTS "Users can create their own profile" ON public.profiles;
CREATE POLICY "Users can create their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ── 3. Backfill profiles for any existing auth.users without a profile row ───
-- This runs once at migration time. It inserts a guest profile for every
-- auth.users record that doesn't already have a corresponding profiles row.
-- This handles users who registered before the trigger was installed.
INSERT INTO public.profiles (id, email, full_name, role)
SELECT
  u.id,
  u.email,
  COALESCE(u.raw_user_meta_data->>'full_name', split_part(u.email, '@', 1)),
  'guest'::public.user_role
FROM auth.users u
LEFT JOIN public.profiles p ON p.id = u.id
WHERE p.id IS NULL
ON CONFLICT (id) DO NOTHING;

-- ── 4. Ensure restaurants INSERT policy is present and correct ────────────────
-- Drop and recreate to guarantee clean state after any previous failed attempts
-- to apply this policy.
DROP POLICY IF EXISTS "Authenticated users can create restaurants" ON public.restaurants;
CREATE POLICY "Authenticated users can create restaurants"
  ON public.restaurants FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
