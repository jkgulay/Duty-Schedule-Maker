import { supabase } from '@/lib/supabaseClient';
import type { ShiftType, ShiftTypeInput } from '@/types/shiftType.types';
import { unwrap } from '@/api/unwrap';

const TABLE = 'shift_types';

export async function fetchShiftTypes(): Promise<ShiftType[]> {
  const result = await supabase.from(TABLE).select('*').order('sort_order');
  return unwrap(result, 'Load shift types');
}

export async function createShiftType(
  hospitalId: string,
  input: ShiftTypeInput,
): Promise<ShiftType> {
  const result = await supabase
    .from(TABLE)
    .insert({
      hospital_id: hospitalId,
      code: input.code,
      label: input.label,
      color_hex: input.colorHex,
      hours_range: input.hoursRange,
      sort_order: input.sortOrder,
    })
    .select('*')
    .single();
  return unwrap(result, 'Create shift type');
}

export async function updateShiftType(
  shiftTypeId: string,
  input: ShiftTypeInput,
): Promise<ShiftType> {
  const result = await supabase
    .from(TABLE)
    .update({
      code: input.code,
      label: input.label,
      color_hex: input.colorHex,
      hours_range: input.hoursRange,
      sort_order: input.sortOrder,
    })
    .eq('id', shiftTypeId)
    .select('*')
    .single();
  return unwrap(result, 'Update shift type');
}

export async function deleteShiftType(shiftTypeId: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', shiftTypeId);
  if (error !== null) {
    throw new Error(`Delete shift type: ${error.message}`);
  }
}
