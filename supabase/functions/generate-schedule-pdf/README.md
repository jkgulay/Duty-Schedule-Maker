# generate-schedule-pdf

Builds the print HTML for a schedule (mirroring `src/components/ScheduleDocument`)
and renders it to a PDF through an external headless-browser service. No browser
runs in the Edge Function.

## Request

`POST` with a signed-in user's JWT (the frontend calls it via
`supabase.functions.invoke`):

```json
{ "scheduleId": "<uuid>" }
```

Response: `application/pdf` (200) or `{ "error": "…" }` with a 4xx/5xx status.

## Flow

1. Authorise the caller: a request-scoped client (`SUPABASE_ANON_KEY` + the
   caller's `Authorization` header) must be able to `select` the schedule under
   RLS, otherwise `404`.
2. Load the full dataset with `SUPABASE_SERVICE_ROLE_KEY` (never sent to the
   browser): schedule, ward, hospital, staff, shift types, legend, entries,
   signatories (+ per-schedule overrides).
3. `renderHtml.ts` builds the HTML using the data-shaping helpers in `_lib/`
   (`resolveShiftDisplay`, `resolveSignatories`, `formatMonth`, …). These are a
   Deno-side **mirror** of `src/utils/*` and `src/constants/*` — the app cannot
   import its aliased, extensionless modules into a Deno function, so the copies
   carry `// mirrors src/…` markers and must be updated in the same commit as
   their counterparts (CLAUDE.md: one source of truth for the layout).
4. `pdf.ts` POSTs `{ html, options }` to `HEADLESS_PDF_API_URL` with
   `HEADLESS_PDF_API_TOKEN`. Page size: Long Bond 13in × 8.5in (landscape).

## Secrets

```bash
supabase secrets set \
  HEADLESS_PDF_API_URL="https://production-sfo.browserless.io/pdf" \
  HEADLESS_PDF_API_TOKEN="<token>"
```

`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` are injected by
the platform.

## Deploy

```bash
supabase functions deploy generate-schedule-pdf
```

## Files

| File | Role |
| --- | --- |
| `index.ts` | HTTP handler: CORS, validation, orchestration, error → JSON |
| `data.ts` | auth check + service-role data load → `ScheduleBundle` |
| `renderHtml.ts` | `ScheduleBundle` → print HTML (mirrors `ScheduleDocument`) |
| `pdf.ts` | POST HTML to the headless-browser service → PDF bytes |
| `_lib/domain.ts` | row types (mirror of `src/types/*`) |
| `_lib/layout.ts` | pure helpers (mirror of `src/utils/*`, `src/constants/*`) |
