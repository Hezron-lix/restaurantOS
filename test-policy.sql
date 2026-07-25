-- test-policy.sql
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

DROP TRIGGER IF EXISTS on_restaurant_insert ON public.restaurants;
DROP FUNCTION IF EXISTS public.handle_test_restaurant_insert();
