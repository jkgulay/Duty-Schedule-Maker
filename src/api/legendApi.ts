import { supabase } from '@/lib/supabaseClient';
import type { LegendAbbreviation } from '@/types/shiftType.types';
import { unwrap } from '@/api/unwrap';

const TABLE = 'legend_abbreviations';

export async function fetchLegendAbbreviations(): Promise<LegendAbbreviation[]> {
  const result = await supabase.from(TABLE).select('*').order('sort_order');
  return unwrap(result, 'Load legend abbreviations');
}
