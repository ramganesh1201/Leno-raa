-- 1. Ensure foreign key from orders to profiles exists and is correct
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

-- 2. Ensure foreign key from payment_proofs to orders exists and is correct
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.table_constraints 
        WHERE constraint_name = 'payment_proofs_order_id_fkey'
        AND table_name = 'payment_proofs'
    ) THEN
        ALTER TABLE public.payment_proofs 
        ADD CONSTRAINT payment_proofs_order_id_fkey 
        FOREIGN KEY (order_id) 
        REFERENCES public.orders(id) 
        ON DELETE CASCADE;
    END IF;
END $$;

-- 3. Notify PostgREST to reload the schema cache so relationship errors disappear immediately
NOTIFY pgrst, 'reload schema';
