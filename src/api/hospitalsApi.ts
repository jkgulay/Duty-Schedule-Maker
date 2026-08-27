import { supabase } from '@/lib/supabaseClient';
import type { Hospital } from '@/types/hospital.types';
import type { HospitalIdentityInput } from '@/types/hospital.types';
import { unwrap } from '@/api/unwrap';

const TABLE = 'hospitals';

/** The caller's hospital (RLS returns only the row they belong to). */
export async function fetchMyHospital(): Promise<Hospital | null> {
  const { data, error } = await supabase.from(TABLE).select('*').maybeSingle();
  if (error !== null) {
    throw new Error(`Load hospital: ${error.message}`);
  }
  return data;
}

export async function updateHospitalIdentity(
  hospitalId: string,
  input: HospitalIdentityInput,
): Promise<Hospital> {
  const result = await supabase
    .from(TABLE)
    .update({
      name: input.name,
      province: input.province,
      logo_left_url: input.logoLeftUrl,
      logo_right_url: input.logoRightUrl,
    })
    .eq('id', hospitalId)
    .select('*')
    .single();
  return unwrap(result, 'Update hospital');
}
