import { supabase } from '@/lib/supabaseClient';
import type { Staff, StaffInput } from '@/types/staff.types';
import { unwrap } from '@/api/unwrap';

const TABLE = 'staff';

export async function fetchStaff(includeInactive = false): Promise<Staff[]> {
  let query = supabase.from(TABLE).select('*').order('full_name');
  if (!includeInactive) {
    query = query.eq('active', true);
  }
  const result = await query;
  return unwrap(result, 'Load staff');
}

export async function createStaff(hospitalId: string, input: StaffInput): Promise<Staff> {
  const result = await supabase
    .from(TABLE)
    .insert({
      hospital_id: hospitalId,
      full_name: input.fullName,
      credentials: input.credentials,
      active: input.active,
    })
    .select('*')
    .single();
  return unwrap(result, 'Create staff');
}

export async function updateStaff(staffId: string, input: StaffInput): Promise<Staff> {
  const result = await supabase
    .from(TABLE)
    .update({
      full_name: input.fullName,
      credentials: input.credentials,
      active: input.active,
    })
    .eq('id', staffId)
    .select('*')
    .single();
  return unwrap(result, 'Update staff');
}
