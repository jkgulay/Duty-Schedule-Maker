/**
 * Row shapes mirroring the Supabase Postgres schema
 * (`supabase/migrations/0001_core_schema.sql`).
 *
 * These are `type` aliases (not `interface`) on purpose: PostgREST's generics
 * require table row types to be assignable to `Record<string, unknown>`, which
 * interfaces are not.
 *
 * Hand-written for now. Once the migrations are applied you can regenerate a
 * fuller version with:
 *   supabase gen types typescript --project-id <ref> > src/types/database.types.ts
 * and adapt the domain type files to point at it.
 */
import type { Role } from '@/constants/roles';
import type { ScheduleStatus } from '@/constants/scheduleStatus';
import type { SignatoryRole } from '@/constants/signatoryRoles';

export type HospitalRow = {
  id: string;
  name: string;
  province: string;
  logo_left_url: string | null;
  logo_right_url: string | null;
  created_at: string;
};

export type WardRow = {
  id: string;
  hospital_id: string;
  name: string;
  created_at: string;
};

export type StaffRow = {
  id: string;
  hospital_id: string;
  full_name: string;
  credentials: string;
  active: boolean;
  created_at: string;
};

export type ShiftTypeRow = {
  id: string;
  hospital_id: string;
  code: string;
  label: string;
  color_hex: string;
  hours_range: string;
  sort_order: number;
  created_at: string;
};

export type LegendAbbreviationRow = {
  id: string;
  hospital_id: string;
  abbreviation: string;
  meaning: string;
  sort_order: number;
  created_at: string;
};

export type ScheduleRow = {
  id: string;
  ward_id: string;
  month: number;
  year: number;
  status: ScheduleStatus;
  created_by: string | null;
  created_at: string;
};

export type ScheduleEntryRow = {
  id: string;
  schedule_id: string;
  staff_id: string;
  day_of_month: number;
  shift_type_id: string | null;
  is_request: boolean;
  is_na: boolean;
  created_at: string;
  updated_at: string;
};

export type SignatoryRow = {
  id: string;
  hospital_id: string;
  full_name: string;
  title: string;
  default_role: SignatoryRole;
  created_at: string;
};

export type ScheduleSignatoryRow = {
  id: string;
  schedule_id: string;
  signatory_id: string;
  role: SignatoryRole;
  created_at: string;
};

export type ProfileRow = {
  id: string;
  hospital_id: string | null;
  role: Role;
  email: string | null;
  created_at: string;
};

// ---------------------------------------------------------------------------
// `Database` type for `createClient<Database>()`. Keeps the whole `api/` layer
// type-safe with no `any`. `Insert` makes DB-defaulted / nullable columns
// optional; `Update` makes everything optional.
// ---------------------------------------------------------------------------

/** Columns Postgres fills in itself, so they are optional on insert. */
type DbManaged = 'id' | 'created_at' | 'updated_at';

/** Keys whose type admits `null` — safe to omit on insert (they default null). */
type NullableKeys<TRow> = {
  [K in keyof TRow]-?: null extends TRow[K] ? K : never;
}[keyof TRow];

type OptionalInsertKeys<TRow> = Extract<keyof TRow, DbManaged> | NullableKeys<TRow>;

type InsertOf<TRow> = Omit<TRow, OptionalInsertKeys<TRow>> &
  Partial<Pick<TRow, OptionalInsertKeys<TRow>>>;

type TableShape<TRow> = {
  Row: TRow;
  Insert: InsertOf<TRow>;
  Update: Partial<InsertOf<TRow>>;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      hospitals: TableShape<HospitalRow>;
      wards: TableShape<WardRow>;
      staff: TableShape<StaffRow>;
      shift_types: TableShape<ShiftTypeRow>;
      legend_abbreviations: TableShape<LegendAbbreviationRow>;
      schedules: TableShape<ScheduleRow>;
      schedule_entries: TableShape<ScheduleEntryRow>;
      signatories: TableShape<SignatoryRow>;
      schedule_signatories: TableShape<ScheduleSignatoryRow>;
      profiles: TableShape<ProfileRow>;
    };
    Views: { [key: string]: never };
    Functions: { [key: string]: never };
    Enums: { [key: string]: never };
    CompositeTypes: { [key: string]: never };
  };
};
