-- ==============================================================================
-- Lenoraa: Contact Messages Table & RLS Policies
-- ==============================================================================

-- 1. Create the contact_messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone_number TEXT,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    status TEXT DEFAULT 'New' NOT NULL,
    admin_notes TEXT
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow anyone (public/anon) to insert new messages
-- The user submits the form unauthenticated.
CREATE POLICY "Allow public insert to contact_messages"
    ON public.contact_messages
    FOR INSERT
    TO public
    WITH CHECK (true);

-- 4. Policy: Allow authenticated users (Admins) to read messages
-- (Assuming authenticated users using Supabase dashboard or admin panel)
CREATE POLICY "Allow authenticated read contact_messages"
    ON public.contact_messages
    FOR SELECT
    TO authenticated
    USING (true);

-- 5. Policy: Allow authenticated users to update messages (e.g., changing status)
CREATE POLICY "Allow authenticated update contact_messages"
    ON public.contact_messages
    FOR UPDATE
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 6. Policy: Allow authenticated users to delete messages
CREATE POLICY "Allow authenticated delete contact_messages"
    ON public.contact_messages
    FOR DELETE
    TO authenticated
    USING (true);

-- ==============================================================================
-- End of Script
-- ==============================================================================
