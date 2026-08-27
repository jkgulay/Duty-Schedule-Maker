# Hospital Nursing Duty Schedule Maker

A React (Vite) + TypeScript SPA for building, reviewing, approving, and
exporting monthly nursing duty schedules for a hospital ward. All backend
concerns (database, auth, storage, PDF generation) run on Supabase.

See [`CLAUDE.md`](./CLAUDE.md) for the binding code standards and architecture.

The admin pages, `ScheduleListPage` (create + list schedules per ward),
`ScheduleEditorPage` (spreadsheet grid: per-cell shift picker, bulk-assign across
a staff/day range, autosave with a lock-aware error banner), and
`ScheduleViewPage` (full read-only document via `ScheduleDocument`, plus a
**Download PDF** button) are functional.

PDF export is done with the browser's own print dialog: the schedule view has a
**Print / Save as PDF** button (`window.print()`), and a `@media print` block in
`src/styles/index.css` prints only the `ScheduleDocument` at Long Bond landscape.
No server or external service. (An unused server-side alternative —
`supabase/functions/generate-schedule-pdf/` — is left in the repo but not wired
up.)

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

### Accounts and roles

Users register at `/signup` (or you add them in the Supabase dashboard). A
trigger creates their `profiles` row as `viewer` with no hospital, so they can
log in but see nothing until an **approver** adds them from the in-app
**Users** page (`/admin/users`): pending sign-ups appear there and the approver
assigns a hospital + role.

The **first** approver has to be promoted by hand once (chicken-and-egg):

```sql
update public.profiles
set hospital_id = '00000000-0000-0000-0000-0000000000a1',
    role = 'approver'
where email = 'you@example.com';
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
supabase/functions/   Edge Functions (generate-schedule-pdf)
```

`resolveShiftDisplay` in `src/utils/` is the single source of truth for
turning a schedule entry into a cell's text/colour/label — the grid and the
legend both consume it, and it prints as-is.

## Access model

Roles (`profiles.role`): `scheduler`, `approver`, `viewer`. Enforced by RLS on
every table — route guards in the SPA are UX only. Schedule status advances
`draft → noted → approved`; once a schedule leaves `draft`, its entries and
signatories are locked at the database level regardless of the UI.

## PDF export

The schedule view has a **Print / Save as PDF** button that calls
`window.print()`. A `@media print` block in `src/styles/index.css` hides all app
chrome and prints only `.schedule-document` at `@page { size: 13in 8.5in }`
(landscape Long Bond), with `print-color-adjust: exact` so the shift colours
render. Users pick "Save as PDF" (or a real printer) in the OS dialog. No server,
no external service, no configuration.

A server-side alternative lives unused at `supabase/functions/generate-schedule-pdf/`
(Edge Function → external headless-browser API). It's not wired into the app;
delete the folder if you don't want it.
