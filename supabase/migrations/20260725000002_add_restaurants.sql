-- Create restaurants table
CREATE TABLE IF NOT EXISTS public.restaurants (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  phone text,
  email text,
  address text,
  city text,
  country text,
  timezone text DEFAULT 'UTC',
  currency text DEFAULT 'USD',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add restaurant_id to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS restaurant_id uuid REFERENCES public.restaurants(id) ON DELETE SET NULL;

-- Enable RLS
ALTER TABLE public.restaurants ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own restaurant" 
ON public.restaurants 
FOR SELECT 
USING (
  id IN (
    SELECT restaurant_id FROM public.profiles WHERE profiles.id = auth.uid()
  )
);

CREATE POLICY "Admins can update their restaurant" 
ON public.restaurants 
FOR UPDATE 
USING (
  id IN (
    SELECT restaurant_id FROM public.profiles WHERE profiles.id = auth.uid() AND role = 'admin'
  )
);

CREATE POLICY "Authenticated users can create restaurants" 
ON public.restaurants 
FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);
