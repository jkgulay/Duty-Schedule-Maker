-- seed.sql
-- Sample data mirroring the reference schedule (Nasipit District Hospital,
-- General Ward). Runs as the service role, so RLS does not apply here.
--
-- NOTE: profiles are intentionally NOT seeded. After a user signs up:
--   1. they self-provision a profile row as 'viewer' (allowed by RLS), then
--   2. an admin elevates them, e.g.
--        update public.profiles
--        set hospital_id = '00000000-0000-0000-0000-0000000000a1',
--            role = 'scheduler'
--        where id = '<auth.users.id>';

-- ---------------------------------------------------------------------------
-- hospital
-- ---------------------------------------------------------------------------
insert into public.hospitals (id, name, province, logo_left_url, logo_right_url)
values (
  '00000000-0000-0000-0000-0000000000a1',
  'NASIPIT DISTRICT HOSPITAL',
  'Agusan del Norte',
  null,
  null
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- ward
-- ---------------------------------------------------------------------------
insert into public.wards (id, hospital_id, name)
values (
  '00000000-0000-0000-0000-0000000000b1',
  '00000000-0000-0000-0000-0000000000a1',
  'GENERAL WARD'
)
on conflict (id) do nothing;

-- ---------------------------------------------------------------------------
-- staff
-- ---------------------------------------------------------------------------
insert into public.staff (hospital_id, full_name, credentials, active)
values
  ('00000000-0000-0000-0000-0000000000a1', 'Aguilera, Sheena Marie Joy L.', 'RN', true),
  ('00000000-0000-0000-0000-0000000000a1', 'Bau, Janeth P.',                'RN', true),
  ('00000000-0000-0000-0000-0000000000a1', 'Emata, Ruby',                   'RN', true),
  ('00000000-0000-0000-0000-0000000000a1', 'Flores, Roschille',             'RN', true),
  ('00000000-0000-0000-0000-0000000000a1', 'Gerona, Abegail',               'RN', true),
  ('00000000-0000-0000-0000-0000000000a1', 'Luna, Kristine S.',             'RN', true),
  ('00000000-0000-0000-0000-0000000000a1', 'Macomao, Mary Anne',            'RN', true),
  ('00000000-0000-0000-0000-0000000000a1', 'Miculob, Gretchen R.',          'RN', true),
  ('00000000-0000-0000-0000-0000000000a1', 'Noh, Jin Mae',                  'RN', true)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- shift_types  (the configurable legend)
--   A   red     7am-3pm
--   P   yellow  3pm-11pm
--   N   green   11pm-7am
--   L   blue    On-Leave
--   OFF white   Off Duty
-- ---------------------------------------------------------------------------
insert into public.shift_types
  (hospital_id, code, label, color_hex, hours_range, sort_order)
values
  ('00000000-0000-0000-0000-0000000000a1', 'A',   '7am - 3pm',   '#FF0000', '7am-3pm',   1),
  ('00000000-0000-0000-0000-0000000000a1', 'P',   '3pm - 11pm',  '#FFFF00', '3pm-11pm',  2),
  ('00000000-0000-0000-0000-0000000000a1', 'N',   '11pm - 7am',  '#00B050', '11pm-7am',  3),
  ('00000000-0000-0000-0000-0000000000a1', 'L',   'On-Leave',    '#00B0F0', '',          4),
  ('00000000-0000-0000-0000-0000000000a1', 'OFF', 'Off Duty',    '#FFFFFF', '',          5)
on conflict (hospital_id, code) do nothing;

-- ---------------------------------------------------------------------------
-- legend_abbreviations
-- ---------------------------------------------------------------------------
insert into public.legend_abbreviations
  (hospital_id, abbreviation, meaning, sort_order)
values
  ('00000000-0000-0000-0000-0000000000a1', 'R',  'Request',       1)
on conflict (hospital_id, abbreviation) do nothing;

-- ---------------------------------------------------------------------------
-- signatories  (hospital defaults)
-- ---------------------------------------------------------------------------
insert into public.signatories (hospital_id, full_name, title, default_role)
values
  ('00000000-0000-0000-0000-0000000000a1', 'Alma A. Dominguez, RN',      'Nurse II',            'prepared_by'),
  ('00000000-0000-0000-0000-0000000000a1', 'Mila A. Casio, RN',          'Chief Nurse',         'noted_by'),
  ('00000000-0000-0000-0000-0000000000a1', 'Gertrudes R. Cembrano, MD',  'Chief of Hospital I', 'approved_by')
on conflict do nothing;