import { FunctionsHttpError } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabaseClient';

const FUNCTION_NAME = 'generate-schedule-pdf';
const GENERIC_MESSAGE = 'Could not generate the PDF. Please try again.';

/**
 * Calls the `generate-schedule-pdf` Edge Function and returns the PDF blob.
 * All rendering happens server-side; the browser only downloads the result.
 */
export async function requestSchedulePdf(scheduleId: string): Promise<Blob> {
  const result = await supabase.functions.invoke<Blob>(FUNCTION_NAME, {
    body: { scheduleId },
  });

  if (result.error !== null) {
    throw new Error(await readInvokeError(result.error as unknown));
  }
  if (!(result.data instanceof Blob)) {
    throw new Error('The PDF service returned an unexpected response.');
  }
  return result.data;
}

/** The Edge Function reports failures as `{ "error": "…" }` with a 4xx/5xx. */
async function readInvokeError(error: unknown): Promise<string> {
  if (error instanceof FunctionsHttpError) {
    const context = error.context as { json?: () => Promise<unknown> };
    if (typeof context.json === 'function') {
      const parsed = await context.json().catch(() => null);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'error' in parsed &&
        typeof parsed.error === 'string'
      ) {
        return parsed.error;
      }
    }
  }
  return error instanceof Error ? error.message : GENERIC_MESSAGE;
}
