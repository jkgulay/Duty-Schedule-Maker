# Hospital Nursing Duty Schedule Maker

A React (Vite) + TypeScript SPA for building, reviewing, approving, and
exporting monthly nursing duty schedules for a hospital ward. All backend
concerns (database, auth, storage, PDF generation) run on Supabase.

See [`CLAUDE.md`](./CLAUDE.md) for the binding code standards and architecture.

## Status

| Phase | Scope | State |
| ----- | ----- | ----- |
| 1 | Supabase schema + RLS policies + seed | ✅ done |
| 2 | Vite/React scaffold: client, `api/`, `hooks/`, routing shell | ✅ done |
| 3 | Admin pages (hospital+wards, staff, shift types, signatories) | ✅ done |
| 4 | Schedule editor grid (create schedule, assign/bulk-assign, autosave) | ✅ done |
| 5 | Read-only schedule view page (header, grid, legend, signatories) | ✅ done |
| 6 | `generate-schedule-pdf` Edge Function + download button | ⬜ not started |
| 7 | Auth + role-based access + approval workflow lock | ⬜ partial (RLS + guards in place) |

The admin pages, `ScheduleListPage` (create + list schedules per ward),
`ScheduleEditorPage` (spreadsheet grid: per-cell shift picker, bulk-assign across
a staff/day range, autosave with a lock-aware error banner), and
`ScheduleViewPage` (full read-only document: `ScheduleHeader` + `ScheduleTitle` +
`ScheduleGrid` + `ShiftLegend` + `SignatoryBlock`, composed by `ScheduleDocument`)
are functional. `ScheduleDocument` is the shared layout the phase-6 PDF template
will mirror.

## Prerequisites

- Node 20+
- A Supabase project (cloud) or the Supabase CLI for a local stack

## Frontend setup

```bash
npm install
cp .env.example .env      # fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
npm run dev               # http://localhost:5173
```

Scripts: `npm run build`, `npm run typecheck`, `npm run lint`, `npm run format`.

## Database setup

Migrations live in `supabase/migrations/` and are applied in filename order.
The seed in `supabase/seed.sql` loads a sample hospital (Nasipit District
Hospital, General Ward) with staff, shift types, and signatories matching the
reference layout.

### Against a cloud project

```bash
supabase link --project-ref <your-project-ref>
supabase db push          # applies migrations/*.sql
psql "<connection-string>" -f supabase/seed.sql
```

### Local stack

```bash
supabase start            # applies migrations + seed.sql automatically
```

### After a user signs up

Profiles are not seeded. A new user self-provisions a `profiles` row as
`viewer`; an admin then elevates them via a privileged connection:

```sql
update public.profiles
set hospital_id = '00000000-0000-0000-0000-0000000000a1',
    role = 'scheduler'
where id = '<auth.users.id>';
```

## Architecture (per `CLAUDE.md`)

```
src/api/      Supabase query wrappers — the only place that imports the client
src/hooks/    Data fetching + state (React Query), consumed by pages
src/pages/    Route-level components — layout only
src/components/  Presentational UI
src/utils/    Pure helpers (formatMonth, getWeekdayLabel, resolveShiftDisplay …)
src/types/    Shared types mirroring the Postgres schema
src/constants/  Named constants for roles, statuses, shift/legend semantics
supabase/migrations/  SQL schema, RLS helpers, policies, storage
supabase/functions/   Edge Functions (PDF export — phase 6)
```

`resolveShiftDisplay` in `src/utils/` is the single source of truth for
turning a schedule entry into a cell's text/colour/label — the on-screen grid,
the legend, and the future PDF template all consume it.

## Access model

Roles (`profiles.role`): `scheduler`, `approver`, `viewer`. Enforced by RLS on
every table — route guards in the SPA are UX only. Schedule status advances
`draft → noted → approved`; once a schedule leaves `draft`, its entries and
signatories are locked at the database level regardless of the UI.

## PDF export (phase 6)

Target page: **landscape Long Bond, 8.5in × 13in**. The `generate-schedule-pdf`
Edge Function will build the schedule HTML and POST it to an external
headless-browser API (e.g. Browserless) to render the PDF; the service-role key
and the rendering token stay server-side (`supabase/functions/.env`).
