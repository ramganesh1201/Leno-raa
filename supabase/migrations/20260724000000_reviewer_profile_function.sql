-- Create a computed column function for PostgREST to fetch reviewer profiles securely
-- This bypasses RLS on profiles since it uses SECURITY DEFINER
CREATE OR REPLACE FUNCTION reviewer_profile(reviews)
RETURNS jsonb
LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  SELECT jsonb_build_object(
    'user_id', p.id,
    'display_name', COALESCE(NULLIF(p.full_name, ''), split_part(p.email, '@', 1)),
    'avatar_url', p.avatar_url
  )
  FROM profiles p
  WHERE p.id = $1.user_id;
$$;
