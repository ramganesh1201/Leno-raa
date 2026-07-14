-- Migration: Fix relationships and RLS policies for Admin Dashboard

-- 1. Create a safe SECURITY DEFINER function to check for admin status without recursion.
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$;

-- 2. Add foreign key from orders.user_id to profiles(id) if it doesn't already exist.
-- PostgREST needs this to resolve relationships like `orders(..., profiles(...))`
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'orders_user_id_fkey'
        AND table_name = 'orders'
    ) THEN
        ALTER TABLE public.orders 
        ADD CONSTRAINT orders_user_id_fkey 
        FOREIGN KEY (user_id) 
        REFERENCES public.profiles(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Update Profiles RLS to avoid infinite recursion
-- We'll safely drop existing policies that might cause recursion
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile." ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile." ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Recreate policies cleanly
-- Everyone can view profiles (or we restrict to own + admin, but typically profiles are public or restricted)
-- For Lenoraa, let's restrict viewing to own profile OR if the user is an admin.
CREATE POLICY "Users can view own profile" 
ON public.profiles FOR SELECT 
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Users can insert their own profile" 
ON public.profiles FOR INSERT 
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "Admins can delete profiles" 
ON public.profiles FOR DELETE 
USING (public.is_admin());

-- Ensure RLS is enabled
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Ensure orders have proper admin read access without recursion
-- We'll also drop potentially recursive admin policies on orders if they existed
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON public.orders;

CREATE POLICY "Admins can view all orders" 
ON public.orders FOR SELECT 
USING (public.is_admin());

CREATE POLICY "Admins can update all orders" 
ON public.orders FOR UPDATE 
USING (public.is_admin());

-- (Users can view their own orders should already exist, but let's make sure it's safe)
-- CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
