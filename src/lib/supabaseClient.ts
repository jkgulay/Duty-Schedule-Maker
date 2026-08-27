import { createClient, type SupabaseClient } from '@supabase/supabase-js';

import type { Database } from '@/types/database.types';

/**
 * The single Supabase client for the whole app. Uses the anon key only —
 * every table it touches is protected by RLS. The service-role key is never
 * imported into frontend code.
 *
 * Only `src/api/*` may import this module. Components and pages must go
 * through the `api/` wrappers.
 */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase config. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env (see .env.example).',
  );
}

export const supabase: SupabaseClient<Database> = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);
