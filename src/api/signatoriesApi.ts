import { supabase } from '@/lib/supabaseClient';
import type { SignatoryRole } from '@/constants/signatoryRoles';
import type {
  ScheduleSignatory,
  Signatory,
  SignatoryInput,
} from '@/types/signatory.types';
import { unwrap } from '@/api/unwrap';

const SIGNATORIES_TABLE = 'signatories';
const SCHEDULE_SIGNATORIES_TABLE = 'schedule_signatories';

export async function fetchSignatories(): Promise<Signatory[]> {
  const result = await supabase.from(SIGNATORIES_TABLE).select('*').order('default_role');
  return unwrap(result, 'Load signatories');
}

export async function createSignatory(
  hospitalId: string,
  input: SignatoryInput,
): Promise<Signatory> {
  const result = await supabase
    .from(SIGNATORIES_TABLE)
    .insert({
      hospital_id: hospitalId,
      full_name: input.fullName,
      title: input.title,
      default_role: input.defaultRole,
    })
    .select('*')
    .single();
  return unwrap(result, 'Create signatory');
}

export async function updateSignatory(
  signatoryId: string,
  input: SignatoryInput,
): Promise<Signatory> {
  const result = await supabase
    .from(SIGNATORIES_TABLE)
    .update({
      full_name: input.fullName,
      title: input.title,
      default_role: input.defaultRole,
    })
    .eq('id', signatoryId)
    .select('*')
    .single();
  return unwrap(result, 'Update signatory');
}

export async function fetchScheduleSignatories(
  scheduleId: string,
): Promise<ScheduleSignatory[]> {
  const result = await supabase
    .from(SCHEDULE_SIGNATORIES_TABLE)
    .select('*')
    .eq('schedule_id', scheduleId);
  return unwrap(result, 'Load schedule signatories');
}

export async function setScheduleSignatory(
  scheduleId: string,
  role: SignatoryRole,
  signatoryId: string,
): Promise<ScheduleSignatory> {
  const result = await supabase
    .from(SCHEDULE_SIGNATORIES_TABLE)
    .upsert(
      { schedule_id: scheduleId, role, signatory_id: signatoryId },
      { onConflict: 'schedule_id,role' },
    )
    .select('*')
    .single();
  return unwrap(result, 'Set schedule signatory');
}
