import { createClient } from '@supabase/supabase-js';

/**
 * Creates a Supabase client scoped to a specific user's JWT token.
 * Used in API routes where RLS policies must apply.
 */
export function createUserClient(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    throw new Error('Missing Supabase environment variables');
  }
  return createClient(url, key, {
    global: {
      headers: { Authorization: `Bearer ${token}` },
    },
  });
}
