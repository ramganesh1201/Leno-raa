-- Add new columns to site_settings
ALTER TABLE public.site_settings
ADD COLUMN IF NOT EXISTS logo_url text,
ADD COLUMN IF NOT EXISTS favicon_url text,
ADD COLUMN IF NOT EXISTS return_policy text,
ADD COLUMN IF NOT EXISTS privacy_policy text,
ADD COLUMN IF NOT EXISTS terms_of_service text,
ADD COLUMN IF NOT EXISTS instagram_url text,
ADD COLUMN IF NOT EXISTS facebook_url text,
ADD COLUMN IF NOT EXISTS whatsapp_url text,
ADD COLUMN IF NOT EXISTS meta_title text,
ADD COLUMN IF NOT EXISTS meta_description text;
