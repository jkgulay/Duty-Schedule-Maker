/**
 * Row shapes the PDF renderer needs. Mirrors `src/types/*` — the app's real
 * types stay the source of truth; these are a Deno-side copy because the Edge
 * Function cannot import the app's aliased, extensionless modules.
 * Keep field names in sync with `supabase/migrations/0001_core_schema.sql`.
 */
export type SignatoryRole = 'prepared_by' | 'noted_by' | 'approved_by';

export interface HospitalRow {
  id: string;
  name: string;
  province: string;
  logo_left_url: string | null;
  logo_right_url: string | null;
}

export interface WardRow {
  id: string;
  hospital_id: string;
  name: string;
}

export interface StaffRow {
  id: string;
  hospital_id: string;
  full_name: string;
  credentials: string;
  active: boolean;
}

export interface ShiftTypeRow {
  id: string;
  hospital_id: string;
  code: string;
  label: string;
  color_hex: string;
  hours_range: string;
  sort_order: number;
}

export interface LegendAbbreviationRow {
  id: string;
  hospital_id: string;
  abbreviation: string;
  meaning: string;
  sort_order: number;
}

export interface ScheduleRow {
  id: string;
  ward_id: string;
  month: number;
  year: number;
  status: string;
}

export interface ScheduleEntryRow {
  id: string;
  schedule_id: string;
  staff_id: string;
  day_of_month: number;
  shift_type_id: string | null;
  is_request: boolean;
  is_na: boolean;
}

export interface SignatoryRow {
  id: string;
  hospital_id: string;
  full_name: string;
  title: string;
  default_role: SignatoryRole;
}

export interface ScheduleSignatoryRow {
  id: string;
  schedule_id: string;
  signatory_id: string;
  role: SignatoryRole;
}

export interface ResolvedSignatory {
  role: SignatoryRole;
  fullName: string;
  title: string;
}

export interface ShiftDisplay {
  text: string;
  backgroundHex: string | null;
  label: string;
  isRequest: boolean;
  isNa: boolean;
}
