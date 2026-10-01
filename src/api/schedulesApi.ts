import { supabase } from '@/lib/supabaseClient';
import type { ScheduleStatus } from '@/constants/scheduleStatus';
import { SCHEDULE_STATUS } from '@/constants/scheduleStatus';
import type { CreateScheduleInput, Schedule } from '@/types/schedule.types';
import { unwrap } from '@/api/unwrap';

const TABLE = 'schedules';

export async function fetchSchedulesForWard(wardId: string): Promise<Schedule[]> {
  const result = await supabase
    .from(TABLE)
    .select('*')
    .eq('ward_id', wardId)
    .order('year', { ascending: false })
    .order('month', { ascending: false })
    .order('period', { ascending: false });
  return unwrap(result, 'Load schedules');
}

export async function fetchScheduleById(scheduleId: string): Promise<Schedule> {
  const result = await supabase.from(TABLE).select('*').eq('id', scheduleId).single();
  return unwrap(result, 'Load schedule');
}

export async function createSchedule(input: CreateScheduleInput): Promise<Schedule> {
  const result = await supabase
    .from(TABLE)
    .insert({
      ward_id: input.wardId,
      month: input.month,
      year: input.year,
      period: input.period,
      status: SCHEDULE_STATUS.DRAFT,
    })
    .select('*')
    .single();
  return unwrap(result, 'Create schedule');
}

/**
 * Advances or sends back a schedule's status. The legal transitions are
 * enforced by a Postgres trigger; an illegal one surfaces here as an error.
 */
export async function updateScheduleStatus(
  scheduleId: string,
  status: ScheduleStatus,
): Promise<Schedule> {
  const result = await supabase
    .from(TABLE)
    .update({ status })
    .eq('id', scheduleId)
    .select('*')
    .single();
  return unwrap(result, 'Update schedule status');
}
