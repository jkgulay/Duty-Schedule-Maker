import { supabase } from '@/lib/supabaseClient';
import type { Ward } from '@/types/hospital.types';
import { unwrap } from '@/api/unwrap';

const TABLE = 'wards';

export async function fetchWards(): Promise<Ward[]> {
  const result = await supabase.from(TABLE).select('*').order('name');
  return unwrap(result, 'Load wards');
}

export async function createWard(hospitalId: string, name: string): Promise<Ward> {
  const result = await supabase
    .from(TABLE)
    .insert({ hospital_id: hospitalId, name })
    .select('*')
    .single();
  return unwrap(result, 'Create ward');
}

export async function renameWard(wardId: string, name: string): Promise<Ward> {
  const result = await supabase
    .from(TABLE)
    .update({ name })
    .eq('id', wardId)
    .select('*')
    .single();
  return unwrap(result, 'Rename ward');
}

export async function deleteWard(wardId: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', wardId);
  if (error !== null) {
    throw new Error(`Delete ward: ${error.message}`);
  }
}
