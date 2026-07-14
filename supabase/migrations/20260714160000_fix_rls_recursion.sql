-- 1. Hardened is_admin() function to prevent inlining and recursion
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
STABLE
AS $$
DECLARE
  is_adm boolean;
BEGIN
  SELECT (role = 'admin') INTO is_adm
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(is_adm, false);
END;
$$;

-- 2. Clean old policies dynamically for specific tables to prevent duplicates
DO $$
DECLARE
    t text;
    pol record;
BEGIN
    FOR t IN SELECT unnest(ARRAY['profiles', 'orders', 'wishlist', 'cart_items', 'notifications', 'reviews', 'coupons', 'collections', 'product_collections'])
    LOOP
        IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = t) THEN
            FOR pol IN SELECT policyname FROM pg_policies WHERE schemaname = 'public' AND tablename = t
            LOOP
                EXECUTE format('DROP POLICY IF EXISTS %I ON public.%I', pol.policyname, t);
            END LOOP;
        END IF;
    END LOOP;
END $$;

-- 3. Profiles Policies (No recursion)
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles') THEN
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view own profile or admins can view all" ON public.profiles FOR SELECT USING (auth.uid() = id OR public.is_admin());
        CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
        CREATE POLICY "Users can update own profile or admins can update all" ON public.profiles FOR UPDATE USING (auth.uid() = id OR public.is_admin());
        CREATE POLICY "Admins can delete profiles" ON public.profiles FOR DELETE USING (public.is_admin());
    END IF;
END $$;

-- 4. Admin Only Tables (Coupons, Collections, Product Collections)
-- Coupons
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'coupons') THEN
        ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public can view active coupons" ON public.coupons FOR SELECT USING (is_active = true AND (valid_until IS NULL OR valid_until > now()));
        CREATE POLICY "Admins can manage all coupons" ON public.coupons FOR ALL USING (public.is_admin());
    END IF;
END $$;

-- Collections
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'collections') THEN
        ALTER TABLE public.collections ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public can view active collections" ON public.collections FOR SELECT USING (is_active = true);
        CREATE POLICY "Admins can manage all collections" ON public.collections FOR ALL USING (public.is_admin());
    END IF;
END $$;

-- Product Collections
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'product_collections') THEN
        ALTER TABLE public.product_collections ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public can view product collections" ON public.product_collections FOR SELECT USING (true);
        CREATE POLICY "Admins can manage all product collections" ON public.product_collections FOR ALL USING (public.is_admin());
    END IF;
END $$;


-- 5. User Data Tables (Orders, Reviews, Wishlist, Cart Items, Notifications)
-- Orders
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'orders') THEN
        ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view own orders or admins can view all" ON public.orders FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
        CREATE POLICY "Users can insert own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Admins can update orders" ON public.orders FOR UPDATE USING (public.is_admin());
        CREATE POLICY "Admins can delete orders" ON public.orders FOR DELETE USING (public.is_admin());
    END IF;
END $$;

-- Reviews
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'reviews') THEN
        ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Public can view approved reviews" ON public.reviews FOR SELECT USING (status = 'approved' OR auth.uid() = user_id OR public.is_admin());
        CREATE POLICY "Users can insert own reviews" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update own pending reviews" ON public.reviews FOR UPDATE USING (auth.uid() = user_id AND status = 'pending') WITH CHECK (auth.uid() = user_id AND status = 'pending');
        CREATE POLICY "Admins can manage all reviews" ON public.reviews FOR ALL USING (public.is_admin());
    END IF;
END $$;

-- Wishlist
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'wishlist') THEN
        ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view own wishlist" ON public.wishlist FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
        CREATE POLICY "Users can insert own wishlist" ON public.wishlist FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can delete own wishlist" ON public.wishlist FOR DELETE USING (auth.uid() = user_id OR public.is_admin());
    END IF;
END $$;

-- Cart Items
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'cart_items') THEN
        ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view own cart items" ON public.cart_items FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
        CREATE POLICY "Users can insert own cart items" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update own cart items" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
        CREATE POLICY "Users can delete own cart items" ON public.cart_items FOR DELETE USING (auth.uid() = user_id OR public.is_admin());
    END IF;
END $$;

-- Notifications
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'notifications') THEN
        ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
        CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id OR public.is_admin());
        CREATE POLICY "Users can insert own notifications" ON public.notifications FOR INSERT WITH CHECK (auth.uid() = user_id);
        CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id OR public.is_admin());
        CREATE POLICY "Users can delete own notifications" ON public.notifications FOR DELETE USING (auth.uid() = user_id OR public.is_admin());
    END IF;
END $$;
