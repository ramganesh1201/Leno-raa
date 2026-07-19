-- 1. Modify `reviews` table schema
ALTER TABLE public.reviews
  RENAME COLUMN comment TO review_text;

ALTER TABLE public.reviews
  ADD COLUMN IF NOT EXISTS title TEXT,
  ADD COLUMN IF NOT EXISTS review_images TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  ADD COLUMN IF NOT EXISTS verified_purchase BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS helpful_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS is_anonymous BOOLEAN DEFAULT false;

-- Add updated_at trigger for reviews
CREATE OR REPLACE FUNCTION update_reviews_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_reviews_updated_at ON public.reviews;
CREATE TRIGGER trg_reviews_updated_at
BEFORE UPDATE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_reviews_updated_at();

-- 2. Trigger: Calculate Product Rating dynamically
-- This calculates the average rating and review_count on the products table
CREATE OR REPLACE FUNCTION update_product_rating()
RETURNS TRIGGER AS $$
BEGIN
    -- If an approved review is inserted, updated, or deleted
    -- We recalculate for the affected product_id
    
    IF TG_OP = 'DELETE' THEN
        -- Recalculate based on OLD.product_id
        UPDATE public.products
        SET 
            rating = COALESCE((SELECT AVG(rating)::numeric(3,1) FROM public.reviews WHERE product_id = OLD.product_id AND status = 'approved'), 0),
            review_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = OLD.product_id AND status = 'approved')
        WHERE id = OLD.product_id;
        RETURN OLD;
    ELSE
        -- Recalculate based on NEW.product_id
        UPDATE public.products
        SET 
            rating = COALESCE((SELECT AVG(rating)::numeric(3,1) FROM public.reviews WHERE product_id = NEW.product_id AND status = 'approved'), 0),
            review_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = NEW.product_id AND status = 'approved')
        WHERE id = NEW.product_id;
        
        -- If product_id changed during an update, recalculate for the old product_id too
        IF TG_OP = 'UPDATE' AND OLD.product_id != NEW.product_id THEN
            UPDATE public.products
            SET 
                rating = COALESCE((SELECT AVG(rating)::numeric(3,1) FROM public.reviews WHERE product_id = OLD.product_id AND status = 'approved'), 0),
                review_count = (SELECT COUNT(*) FROM public.reviews WHERE product_id = OLD.product_id AND status = 'approved')
            WHERE id = OLD.product_id;
        END IF;
        
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_update_product_rating ON public.reviews;
CREATE TRIGGER trg_update_product_rating
AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_rating();


-- 3. Trigger: Automatically Determine Verified Purchase
-- A purchase is verified if the user has an order containing this product and the order is paid
CREATE OR REPLACE FUNCTION check_verified_purchase()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM public.orders o
        JOIN public.order_items oi ON o.id = oi.order_id
        WHERE o.user_id = NEW.user_id
          AND oi.product_id = NEW.product_id
          AND o.payment_status = 'paid'
    ) THEN
        NEW.verified_purchase := true;
    ELSE
        NEW.verified_purchase := false;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_check_verified_purchase ON public.reviews;
CREATE TRIGGER trg_check_verified_purchase
BEFORE INSERT ON public.reviews
FOR EACH ROW
EXECUTE FUNCTION check_verified_purchase();


-- 4. Supabase Storage for Review Images
-- Create the bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public) 
VALUES ('review_images', 'review_images', true)
ON CONFLICT (id) DO NOTHING;

-- RLS for Storage Bucket
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'review_images');

CREATE POLICY "Authenticated users can upload review images" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'review_images');

CREATE POLICY "Users can update their own review images" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'review_images' AND auth.uid() = owner);

CREATE POLICY "Users can delete their own review images" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'review_images' AND auth.uid() = owner);
