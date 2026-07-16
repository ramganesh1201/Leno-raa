-- Add new columns for the 3-step customization flow
ALTER TABLE public.soap_customizations
ADD COLUMN IF NOT EXISTS skin_type TEXT,
ADD COLUMN IF NOT EXISTS core_active TEXT;

-- Mark old columns as legacy in comments (no constraints dropped per requirements)
COMMENT ON COLUMN public.soap_customizations.base_soap IS 'LEGACY: Handled by app layer for backwards compatibility';
COMMENT ON COLUMN public.soap_customizations.color IS 'LEGACY: Handled by app layer for backwards compatibility';
COMMENT ON COLUMN public.soap_customizations.shape IS 'LEGACY: Handled by app layer for backwards compatibility';
COMMENT ON COLUMN public.soap_customizations.packaging IS 'LEGACY: Handled by app layer for backwards compatibility';
COMMENT ON COLUMN public.soap_customizations.essential_oils IS 'LEGACY: Handled by app layer for backwards compatibility';
COMMENT ON COLUMN public.soap_customizations.ingredients IS 'LEGACY: Handled by app layer for backwards compatibility';
COMMENT ON COLUMN public.soap_customizations.ribbon IS 'LEGACY: Handled by app layer for backwards compatibility';
COMMENT ON COLUMN public.soap_customizations.message IS 'LEGACY: Handled by app layer for backwards compatibility';
COMMENT ON COLUMN public.soap_customizations.gift_wrap IS 'LEGACY: Handled by app layer for backwards compatibility';

NOTIFY pgrst, 'reload schema';
