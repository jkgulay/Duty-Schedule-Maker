import { supabase } from '@/lib/supabaseClient';
import type { Database } from '@/types/database.types';
import type { ScheduleEntry, ScheduleEntryInput } from '@/types/schedule.types';
import { unwrap } from '@/api/unwrap';

const TABLE = 'schedule_entries';
const CONFLICT_TARGET = 'schedule_id,staff_id,day_of_month';

type ScheduleEntryInsert = Database['public']['Tables']['schedule_entries']['Insert'];

export async function fetchEntriesForSchedule(
  scheduleId: string,
): Promise<ScheduleEntry[]> {
  const result = await supabase.from(TABLE).select('*').eq('schedule_id', scheduleId);
  return unwrap(result, 'Load schedule entries');
}

function toRow(input: ScheduleEntryInput): ScheduleEntryInsert {
  return {
    schedule_id: input.scheduleId,
    staff_id: input.staffId,
    day_of_month: input.dayOfMonth,
    shift_type_id: input.shiftTypeId,
    shift_type_id_2: input.shiftTypeId2,
    custom_text: input.customText,
    is_request: input.isRequest,
    is_na: input.isNa,
  };
}

/** Creates or overwrites a single cell. */
export async function upsertEntry(input: ScheduleEntryInput): Promise<ScheduleEntry> {
  const result = await supabase
    .from(TABLE)
    .upsert(toRow(input), { onConflict: CONFLICT_TARGET })
    .select('*')
    .single();
  return unwrap(result, 'Save shift');
}

/** Creates or overwrites many cells in one round trip (bulk assign). */
export async function bulkUpsertEntries(
  inputs: readonly ScheduleEntryInput[],
): Promise<ScheduleEntry[]> {
  if (inputs.length === 0) {
    return [];
  }
  const result = await supabase
    .from(TABLE)
    .upsert(inputs.map(toRow), { onConflict: CONFLICT_TARGET })
    .select('*');
  return unwrap(result, 'Save shifts');
}

export async function deleteEntry(entryId: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', entryId);
  if (error !== null) {
    throw new Error(`Clear shift: ${error.message}`);
  }
}
