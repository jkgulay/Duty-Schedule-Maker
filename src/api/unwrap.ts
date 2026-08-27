import type { PostgrestError } from '@supabase/supabase-js';

interface SupabaseResult<T> {
  data: T | null;
  error: PostgrestError | null;
}

/**
 * Turns a Supabase `{ data, error }` result into either the data or a thrown
 * `Error`. Every `api/` call funnels through this so there are no
 * fire-and-forget writes and failures always surface.
 */
export function unwrap<T>(result: SupabaseResult<T>, context: string): T {
  if (result.error !== null) {
    throw new Error(`${context}: ${result.error.message}`);
  }
  if (result.data === null) {
    throw new Error(`${context}: no data returned`);
  }
  return result.data;
}
