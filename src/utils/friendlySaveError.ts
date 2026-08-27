/**
 * Turns a raw Supabase/Postgres error into a message a scheduler can act on.
 * The most important case: the schedule was locked (left `draft`) mid-edit, so
 * an RLS policy rejected the write.
 */
export function friendlySaveError(error: Error): string {
  const message = error.message.toLowerCase();
  if (
    message.includes('row-level security') ||
    message.includes('violates row-level') ||
    message.includes('policy')
  ) {
    return 'Could not save: this schedule is no longer a draft and is locked. Reload the page to see its current status.';
  }
  return error.message;
}
