-- ==============================================================================
-- LENORAA SUPABASE REBUILD SCRIPT
-- WARNING: THIS SCRIPT WILL IRREVERSIBLY DELETE ALL EXISTING DATA AND STRUCTURES
-- IN THE 'public' SCHEMA. DO NOT RUN THIS IN PRODUCTION UNLESS YOU MEAN IT.
-- ==============================================================================

-- ==============================================================================
-- 1. TOTAL TEARDOWN (CLEAN SLATE)
-- ==============================================================================
DO $$ DECLARE
    r RECORD;
BEGIN
    -- Drop all tables in public schema safely via CASCADE
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP TABLE IF EXISTS public.' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
    
    -- Drop all views
    FOR r IN (SELECT viewname FROM pg_views WHERE schemaname = 'public') LOOP
        EXECUTE 'DROP VIEW IF EXISTS public.' || quote_ident(r.viewname) || ' CASCADE';
    END LOOP;
    
    -- Drop known functions
    DROP FUNCTION IF EXISTS public.handle_new_user CASCADE;
    DROP FUNCTION IF EXISTS public.update_modified_column CASCADE;
    DROP FUNCTION IF EXISTS public.create_user_policies CASCADE;
END $$;

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 2. SCHEMA DEFINITION (NORMALIZED)
-- ==============================================================================

-- A. CORE USERS
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin')) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.user_preferences (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  theme TEXT DEFAULT 'system',
  language TEXT DEFAULT 'en',
  marketing_emails BOOLEAN DEFAULT false,
  notifications BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.user_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  country TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.shipping_addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID NOT NULL, -- Will add foreign key after orders table is created
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- B. CATALOG
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  short_description TEXT,
  description TEXT,
  price NUMERIC(10, 2) NOT NULL,
  discount_price NUMERIC(10, 2),
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0 NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'draft', 'archived')),
  featured BOOLEAN DEFAULT false,
  new_arrival BOOLEAN DEFAULT false,
  rating NUMERIC(3, 2) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  seo_metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.product_images (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  alt_text TEXT,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.product_variants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL, -- e.g., 'Size'
  value TEXT NOT NULL, -- e.g., '100g'
  price_adjustment NUMERIC(10, 2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.product_ingredients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  is_key_ingredient BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- C. CUSTOM SOAP BUILDER
CREATE TABLE public.soap_customizations (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  base_soap TEXT NOT NULL,
  color TEXT NOT NULL,
  shape TEXT NOT NULL,
  fragrance TEXT NOT NULL,
  essential_oils TEXT[] DEFAULT '{}',
  ingredients TEXT[] DEFAULT '{}',
  packaging TEXT NOT NULL,
  ribbon TEXT,
  message TEXT,
  gift_wrap BOOLEAN DEFAULT false,
  quantity INTEGER DEFAULT 1,
  preview_image TEXT,
  calculated_price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- D. SHOPPING
CREATE TABLE public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

CREATE TABLE public.cart_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  customization_id UUID REFERENCES public.soap_customizations(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  -- Check constraint to ensure either product_id OR customization_id is present, but not both
  CHECK ((product_id IS NOT NULL AND customization_id IS NULL) OR (product_id IS NULL AND customization_id IS NOT NULL))
);
-- Create unique indexes for upsert conflict handling
CREATE UNIQUE INDEX cart_items_user_product_idx ON public.cart_items(user_id, product_id) WHERE product_id IS NOT NULL;
CREATE UNIQUE INDEX cart_items_user_customization_idx ON public.cart_items(user_id, customization_id) WHERE customization_id IS NOT NULL;

-- E. ORDERS (Manual System)
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  address_id UUID REFERENCES public.user_addresses(id) ON DELETE SET NULL,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) NOT NULL,
  discount NUMERIC(10, 2) DEFAULT 0,
  tax NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  payment_method TEXT DEFAULT 'Manual Transfer' NOT NULL,
  payment_status TEXT DEFAULT 'Pending' NOT NULL,
  order_status TEXT DEFAULT 'Awaiting Payment' NOT NULL,
  courier_name TEXT,
  tracking_number TEXT,
  internal_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add foreign key constraint to shipping_addresses
ALTER TABLE public.shipping_addresses ADD CONSTRAINT fk_shipping_addresses_order FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;

CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  customization_id UUID REFERENCES public.soap_customizations(id) ON DELETE SET NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.manual_payment_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  transaction_reference TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.payment_proofs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  screenshot_url TEXT NOT NULL,
  utr_number TEXT NOT NULL,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rejection_reason TEXT
);

-- F. ENGAGEMENT & ANALYTICS
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.recently_viewed (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

CREATE TABLE public.search_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  query TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT false NOT NULL,
  type TEXT DEFAULT 'system',
  action_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.contact_messages (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Optional user
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.support_chat (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  is_from_admin BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- G. SYSTEM & FUTURE PROOFING
CREATE TABLE public.website_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.site_settings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  merchant_name TEXT NOT NULL,
  upi_id TEXT NOT NULL,
  upi_qr_url TEXT,
  support_phone TEXT,
  support_email TEXT,
  shipping_charge NUMERIC(10, 2) DEFAULT 0,
  free_shipping_threshold NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.coupon_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value NUMERIC(10, 2) NOT NULL,
  max_uses INTEGER,
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.payment_methods (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  details JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.analytics_events (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. TRIGGERS & AUTOMATION
-- ==============================================================================

-- Updated At Trigger
CREATE OR REPLACE FUNCTION public.update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER modtime_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER modtime_user_preferences BEFORE UPDATE ON public.user_preferences FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER modtime_user_addresses BEFORE UPDATE ON public.user_addresses FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER modtime_products BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER modtime_soap_customizations BEFORE UPDATE ON public.soap_customizations FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER modtime_cart_items BEFORE UPDATE ON public.cart_items FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER modtime_orders BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER modtime_website_settings BEFORE UPDATE ON public.website_settings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();
CREATE TRIGGER modtime_site_settings BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE PROCEDURE update_modified_column();

-- Auth Signup Trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  -- Insert into profiles
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)), 
    new.raw_user_meta_data->>'avatar_url'
  );
  
  -- Insert into user_preferences
  INSERT INTO public.user_preferences (id)
  VALUES (new.id);
  
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Recreate Auth Trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ==============================================================================
-- 4. ROW LEVEL SECURITY (RLS)
-- ==============================================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soap_customizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.manual_payment_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_proofs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recently_viewed ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.support_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupon_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Generic Policy Helper Function
CREATE OR REPLACE FUNCTION public.create_user_policies(table_name text, col_name text DEFAULT 'user_id') RETURNS void AS $$
BEGIN
  EXECUTE format('CREATE POLICY "Users can view own %I" ON public.%I FOR SELECT USING (auth.uid() = %I OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin'')))', table_name, table_name, col_name);
  EXECUTE format('CREATE POLICY "Users can insert own %I" ON public.%I FOR INSERT WITH CHECK (auth.uid() = %I OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin'')))', table_name, table_name, col_name);
  EXECUTE format('CREATE POLICY "Users can update own %I" ON public.%I FOR UPDATE USING (auth.uid() = %I OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin'')))', table_name, table_name, col_name);
  EXECUTE format('CREATE POLICY "Users can delete own %I" ON public.%I FOR DELETE USING (auth.uid() = %I OR (EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = ''admin'')))', table_name, table_name, col_name);
END;
$$ LANGUAGE plpgsql;

-- A. PUBLIC READ ACCESS
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public read products" ON public.products FOR SELECT USING (status = 'active');
CREATE POLICY "Public read product_images" ON public.product_images FOR SELECT USING (true);
CREATE POLICY "Public read product_variants" ON public.product_variants FOR SELECT USING (true);
CREATE POLICY "Public read product_ingredients" ON public.product_ingredients FOR SELECT USING (true);
CREATE POLICY "Public read reviews" ON public.reviews FOR SELECT USING (status = 'approved');
CREATE POLICY "Public read website_settings" ON public.website_settings FOR SELECT USING (true);
CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Public read payment_methods" ON public.payment_methods FOR SELECT USING (is_active = true);

-- B. USER ISOLATED ACCESS
SELECT public.create_user_policies('profiles', 'id');
SELECT public.create_user_policies('user_preferences', 'id');
SELECT public.create_user_policies('user_addresses');
SELECT public.create_user_policies('soap_customizations');
SELECT public.create_user_policies('wishlist');
SELECT public.create_user_policies('cart_items');
SELECT public.create_user_policies('orders');
SELECT public.create_user_policies('manual_payment_requests');

-- Custom RLS for shipping_addresses based on orders
CREATE POLICY "Users can view own shipping addresses" ON public.shipping_addresses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = shipping_addresses.order_id AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);
CREATE POLICY "Users can insert own shipping addresses" ON public.shipping_addresses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = shipping_addresses.order_id AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);
CREATE POLICY "Users can update own shipping addresses" ON public.shipping_addresses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = shipping_addresses.order_id AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);

-- Custom RLS for payment_proofs based on orders
CREATE POLICY "Users can view own payment proofs" ON public.payment_proofs FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payment_proofs.order_id AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);
CREATE POLICY "Users can insert own payment proofs" ON public.payment_proofs FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = payment_proofs.order_id AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);
CREATE POLICY "Admins can update payment proofs" ON public.payment_proofs FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
SELECT public.create_user_policies('recently_viewed');
SELECT public.create_user_policies('search_history');
SELECT public.create_user_policies('notifications');
SELECT public.create_user_policies('support_chat');
SELECT public.create_user_policies('analytics_events');

-- Allow users to create reviews but only view their own if pending, or public if approved (handled above)
CREATE POLICY "Users can insert own review" ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own pending reviews" ON public.reviews FOR SELECT USING (auth.uid() = user_id);

-- Order Items (Indirect RLS)
CREATE POLICY "Users can view own order items" ON public.order_items FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);
CREATE POLICY "Users can insert own order items" ON public.order_items FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')))
);

-- Anyone can insert a contact message (even guests)
CREATE POLICY "Anyone can insert contact message" ON public.contact_messages FOR INSERT WITH CHECK (true);

-- ==============================================================================
-- 5. STORAGE BUCKETS & POLICIES
-- ==============================================================================
-- (Assuming standard supabase storage schema access)
-- Note: You might need to run these individually depending on your storage schema configuration.

INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('customizations', 'customizations', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('reviews', 'reviews', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('categories', 'categories', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('payment-proofs', 'payment-proofs', false) ON CONFLICT DO NOTHING;

-- Allow public viewing of files
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id IN ('avatars', 'products', 'customizations', 'reviews', 'categories'));

-- Allow admins to view payment proofs
CREATE POLICY "Admin Payment Proofs Access" ON storage.objects FOR SELECT USING (bucket_id = 'payment-proofs' AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'));

-- Allow authenticated uploads to avatars/customizations/reviews
CREATE POLICY "Authenticated users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload customizations" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'customizations' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload reviews" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'reviews' AND auth.role() = 'authenticated');
CREATE POLICY "Authenticated users can upload payment proofs" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'payment-proofs' AND auth.role() = 'authenticated');

-- ==============================================================================
-- 6. SEED DATA (PRODUCTS & CATEGORIES)
-- ==============================================================================

-- Categories
INSERT INTO public.categories (id, name, slug, image, description) VALUES
('b3a9c7b9-1f4a-4b9b-9c5a-2e3d4c5b6a71', 'The Signature Collection', 'signature', 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214', 'Our timeless formulations.'),
('c4b0d8ca-205b-4c0c-ad6b-3f4e5d6c7b82', 'The Botanical Series', 'botanical', 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273', 'Harnessing the power of nature.')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO public.products (id, name, slug, short_description, description, price, category_id, stock, status, featured, rating, review_count) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Midnight Orchid', 'midnight-orchid', 'Deep, mysterious, intoxicating.', 'A luxurious blend of dark florals and grounding woods.', 1850.00, 'b3a9c7b9-1f4a-4b9b-9c5a-2e3d4c5b6a71', 50, 'active', true, 4.9, 128),
('d4c3b2a1-6f5e-b5a4-d9c8-d5c4b3a2f1e0', 'Oat & Honey Cloud', 'oat-honey', 'Soothing, gentle, nourishing.', 'Colloidal oatmeal and raw manuka honey.', 1450.00, 'b3a9c7b9-1f4a-4b9b-9c5a-2e3d4c5b6a71', 40, 'active', false, 4.8, 95),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Rose Quartz Glow', 'rose-quartz', 'Brightening, floral, elegant.', 'Infused with real rose extract and pink clay.', 1650.00, 'c4b0d8ca-205b-4c0c-ad6b-3f4e5d6c7b82', 30, 'active', true, 4.7, 84)
ON CONFLICT (id) DO NOTHING;

-- Product Images
INSERT INTO public.product_images (product_id, url, display_order) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'https://images.unsplash.com/photo-1600857062241-98e5dba7f214', 1),
('d4c3b2a1-6f5e-b5a4-d9c8-d5c4b3a2f1e0', 'https://images.unsplash.com/photo-1607006411066-414ae5b869d8', 1),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'https://images.unsplash.com/photo-1547484451-b84499d3ba69', 1);

-- Product Ingredients
INSERT INTO public.product_ingredients (product_id, name, is_key_ingredient) VALUES
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Black Orchid Extract', true),
('a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d', 'Sandalwood Essential Oil', true),
('d4c3b2a1-6f5e-b5a4-d9c8-d5c4b3a2f1e0', 'Colloidal Oatmeal', true),
('d4c3b2a1-6f5e-b5a4-d9c8-d5c4b3a2f1e0', 'Raw Manuka Honey', true),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'Rose Absolute', true),
('e5f6a7b8-c9d0-1e2f-3a4b-5c6d7e8f9a0b', 'French Pink Clay', true);

-- Site Settings
INSERT INTO public.site_settings (merchant_name, upi_id, upi_qr_url, support_phone, support_email, shipping_charge, free_shipping_threshold) VALUES
('Lenoraa Artisan Soaps', 'merchant@placeholder.upi', 'https://images.unsplash.com/photo-1547484451-b84499d3ba69', '+91 98765 43210', 'support@lenoraa.com', 50.00, 1500.00);

-- Realtime Publication for specific tables
BEGIN;
  DROP PUBLICATION IF EXISTS supabase_realtime;
  CREATE PUBLICATION supabase_realtime FOR TABLE public.cart_items, public.wishlist, public.notifications, public.orders, public.profiles, public.soap_customizations;
COMMIT;
