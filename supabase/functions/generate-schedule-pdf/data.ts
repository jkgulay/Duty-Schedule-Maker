import { createClient } from '@supabase/supabase-js';

import type {
  HospitalRow,
  LegendAbbreviationRow,
  ResolvedSignatory,
  ScheduleEntryRow,
  ScheduleRow,
  ScheduleSignatoryRow,
  ShiftTypeRow,
  SignatoryRow,
  StaffRow,
  WardRow,
} from './_lib/domain.ts';
import { resolveSignatories } from './_lib/layout.ts';

export interface ScheduleBundle {
  schedule: ScheduleRow;
  ward: WardRow;
  hospital: HospitalRow;
  staff: StaffRow[];
  shiftTypes: ShiftTypeRow[];
  legendAbbreviations: LegendAbbreviationRow[];
  entries: ScheduleEntryRow[];
  signatories: ResolvedSignatory[];
}

export class PdfDataError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'PdfDataError';
    this.status = status;
  }
}

interface Env {
  url: string;
  anonKey: string;
  serviceKey: string;
  authHeader: string;
}

/**
 * Authorises the caller against RLS, then loads everything the template needs
 * with the service-role key. The service-role key never leaves this function.
 */
export async function loadScheduleBundle(
  scheduleId: string,
  env: Env,
): Promise<ScheduleBundle> {
  const callerClient = createClient(env.url, env.anonKey, {
    global: { headers: { Authorization: env.authHeader } },
    auth: { persistSession: false },
  });

  const { data: userData } = await callerClient.auth.getUser();
  if (userData.user === null) {
    throw new PdfDataError('Not signed in', 401);
  }

  // RLS decides whether this caller may see the schedule at all.
  const { data: allowed, error: allowedError } = await callerClient
    .from('schedules')
    .select('id')
    .eq('id', scheduleId)
    .maybeSingle();
  if (allowedError !== null) {
    throw new PdfDataError(`Authorisation check failed: ${allowedError.message}`, 500);
  }
  if (allowed === null) {
    throw new PdfDataError('Schedule not found or not accessible', 404);
  }

  const admin = createClient(env.url, env.serviceKey, {
    auth: { persistSession: false },
  });

  const schedule = await one<ScheduleRow>(
    admin.from('schedules').select('*').eq('id', scheduleId).maybeSingle(),
    'schedule',
  );
  const ward = await one<WardRow>(
    admin.from('wards').select('*').eq('id', schedule.ward_id).maybeSingle(),
    'ward',
  );
  const hospital = await one<HospitalRow>(
    admin.from('hospitals').select('*').eq('id', ward.hospital_id).maybeSingle(),
    'hospital',
  );

  const hospitalId = ward.hospital_id;
  const [staff, shiftTypes, legendAbbreviations, entries, signatories, overrides] =
    await Promise.all([
      many<StaffRow>(
        admin.from('staff').select('*').eq('hospital_id', hospitalId).order('full_name'),
      ),
      many<ShiftTypeRow>(
        admin
          .from('shift_types')
          .select('*')
          .eq('hospital_id', hospitalId)
          .order('sort_order'),
      ),
      many<LegendAbbreviationRow>(
        admin
          .from('legend_abbreviations')
          .select('*')
          .eq('hospital_id', hospitalId)
          .order('sort_order'),
      ),
      many<ScheduleEntryRow>(
        admin.from('schedule_entries').select('*').eq('schedule_id', scheduleId),
      ),
      many<SignatoryRow>(
        admin.from('signatories').select('*').eq('hospital_id', hospitalId),
      ),
      many<ScheduleSignatoryRow>(
        admin.from('schedule_signatories').select('*').eq('schedule_id', scheduleId),
      ),
    ]);

  const staffWithEntries = new Set(entries.map((entry) => entry.staff_id));
  const visibleStaff = staff.filter(
    (member) => member.active || staffWithEntries.has(member.id),
  );

  return {
    schedule,
    ward,
    hospital,
    staff: visibleStaff,
    shiftTypes,
    legendAbbreviations,
    entries,
    signatories: resolveSignatories(signatories, overrides),
  };
}

interface Result<T> {
  data: T | null;
  error: { message: string } | null;
}

async function one<T>(query: PromiseLike<Result<T>>, label: string): Promise<T> {
  const { data, error } = await query;
  if (error !== null) {
    throw new PdfDataError(`Load ${label}: ${error.message}`, 500);
  }
  if (data === null) {
    throw new PdfDataError(`Load ${label}: not found`, 404);
  }
  return data;
}

async function many<T>(query: PromiseLike<Result<T[]>>): Promise<T[]> {
  const { data, error } = await query;
  if (error !== null) {
    throw new PdfDataError(error.message, 500);
  }
  return data ?? [];
}
