-- test-trigger-after.sql
CREATE OR REPLACE FUNCTION public.handle_test_restaurant_insert()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.profiles SET restaurant_id = NEW.id WHERE id = auth.uid();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_restaurant_insert ON public.restaurants;
CREATE TRIGGER on_restaurant_insert
  AFTER INSERT ON public.restaurants
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_test_restaurant_insert();
