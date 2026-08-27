import { supabase } from '@/lib/supabaseClient';
import type { Role } from '@/constants/roles';
import type { Member } from '@/types/member.types';
import { unwrap } from '@/api/unwrap';

const TABLE = 'profiles';

/** Members of the caller's hospital, plus hospital-less sign-ups (approver only). */
export async function fetchHospitalMembers(): Promise<Member[]> {
  const result = await supabase.from(TABLE).select('*').order('email', {
    nullsFirst: false,
  });
  return unwrap(result, 'Load users');
}

export async function updateMemberRole(userId: string, role: Role): Promise<Member> {
  const result = await supabase
    .from(TABLE)
    .update({ role })
    .eq('id', userId)
    .select('*')
    .single();
  return unwrap(result, 'Update role');
}

/** Adopts a pending sign-up into a hospital and assigns their role. */
export async function assignMemberToHospital(
  userId: string,
  hospitalId: string,
  role: Role,
): Promise<Member> {
  const result = await supabase
    .from(TABLE)
    .update({ hospital_id: hospitalId, role })
    .eq('id', userId)
    .select('*')
    .single();
  return unwrap(result, 'Add user to hospital');
}
