
-- Add new columns to user_addresses safely
ALTER TABLE IF EXISTS public.user_addresses 
  ADD COLUMN IF NOT EXISTS house_number text,
  ADD COLUMN IF NOT EXISTS building_name text,
  ADD COLUMN IF NOT EXISTS street_area text,
  ADD COLUMN IF NOT EXISTS landmark text,
  ADD COLUMN IF NOT EXISTS alt_phone text,
  ADD COLUMN IF NOT EXISTS address_type text;

-- Add new columns to shipping_addresses safely
ALTER TABLE IF EXISTS public.shipping_addresses 
  ADD COLUMN IF NOT EXISTS house_number text,
  ADD COLUMN IF NOT EXISTS building_name text,
  ADD COLUMN IF NOT EXISTS street_area text,
  ADD COLUMN IF NOT EXISTS landmark text,
  ADD COLUMN IF NOT EXISTS alt_phone text,
  ADD COLUMN IF NOT EXISTS address_type text;

-- Create an RPC to safely check if an email was registered via Google
CREATE OR REPLACE FUNCTION public.check_auth_provider(lookup_email text)
RETURNS text AS $\$
DECLARE
  provider text;
BEGIN
  SELECT raw_app_meta_data->>'provider' INTO provider
  FROM auth.users
  WHERE email = lookup_email;
  
  RETURN provider;
END;
$\$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute to anon and authenticated
GRANT EXECUTE ON FUNCTION public.check_auth_provider(text) TO anon, authenticated;
