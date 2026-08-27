/**
 * Builds the print HTML for a schedule. This MUST stay visually in sync with
 * the React `ScheduleDocument` component tree
 * (`src/components/ScheduleDocument/…`). The data-shaping helpers in `_lib/`
 * mirror the app's `src/utils` / `src/constants`; only the markup + CSS are
 * restated here for print.
 */
import type { ScheduleBundle } from './data.ts';
import {
  DOCUMENT_TITLE,
  entryKey,
  formatMonth,
  getMonthDays,
  getWeekdayLabel,
  indexEntries,
  indexShiftTypes,
  isWeekend,
  readableTextColor,
  resolveShiftDisplay,
  SIGNATORY_ROLE_LABEL,
} from './_lib/layout.ts';

const PAGE_CSS = `
  @page { size: 13in 8.5in; margin: 0.4in; }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: Calibri, Carlito, "Segoe UI", Arial, sans-serif;
    color: #111827;
    font-size: 10px;
  }
  .doc { border: 1px solid #9ca3af; padding: 16px; }
  header.doc-head {
    display: flex; align-items: center; justify-content: center; gap: 24px;
    padding: 4px 0;
  }
  .doc-head .seal { width: 64px; height: 64px; object-fit: contain; }
  .doc-head .identity { text-align: center; line-height: 1.25; font-size: 12px; }
  .doc-head .identity .name { font-weight: 700; text-transform: uppercase; }
  .doc-title { text-align: center; font-weight: 700; padding: 6px 0; }
  .doc-title .month { color: #c00000; }
  .doc-title .ward { color: #0000ff; text-transform: uppercase; }
  table.grid { border-collapse: collapse; width: 100%; font-size: 9px; }
  table.grid th, table.grid td {
    border: 1px solid #9ca3af; padding: 2px; text-align: center;
  }
  table.grid th.name { text-align: left; min-width: 150px; white-space: nowrap; }
  table.grid td.name { text-align: left; white-space: nowrap; font-weight: 400; }
  table.grid thead th { background: #f3f4f6; }
  table.grid th.weekend { color: #dc2626; }
  .foot { display: flex; justify-content: space-between; gap: 32px; margin-top: 16px; }
  .legend { font-size: 9px; }
  .legend h2 { margin: 0 0 4px; font-size: 9px; text-transform: uppercase; }
  .legend ul { list-style: none; margin: 0; padding: 0; }
  .legend li { display: flex; align-items: center; gap: 6px; }
  .legend .swatch { width: 10px; height: 10px; border: 1px solid #9ca3af; display: inline-block; }
  .legend .abbr { margin-top: 4px; }
  .sign { display: flex; gap: 32px; font-size: 9px; }
  .sign .col { min-width: 150px; text-align: center; }
  .sign .role { text-align: left; }
  .sign .name { margin-top: 24px; border-top: 1px solid #1f2937; padding-top: 2px; font-weight: 700; }
`;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderHeader(bundle: ScheduleBundle): string {
  const { hospital } = bundle;
  const seal = (url: string | null, alt: string): string =>
    url === null ? '<span class="seal"></span>' : `<img class="seal" src="${escapeHtml(url)}" alt="${escapeHtml(alt)}" />`;
  return `
    <header class="doc-head">
      ${seal(hospital.logo_left_url, `${hospital.name} left seal`)}
      <div class="identity">
        <div>Republic of the Philippines</div>
        <div>Province of ${escapeHtml(hospital.province)}</div>
        <div class="name">${escapeHtml(hospital.name)}</div>
      </div>
      ${seal(hospital.logo_right_url, `${hospital.name} right seal`)}
    </header>`;
}

function renderTitle(bundle: ScheduleBundle): string {
  const monthLabel = formatMonth(bundle.schedule.month, bundle.schedule.year);
  return `
    <div class="doc-title">
      <div>${escapeHtml(DOCUMENT_TITLE)}</div>
      <div class="month">${escapeHtml(monthLabel)}</div>
      <div class="ward">${escapeHtml(bundle.ward.name)}</div>
    </div>`;
}

function renderGrid(bundle: ScheduleBundle): string {
  const days = getMonthDays(bundle.schedule.month, bundle.schedule.year);
  const shiftTypesIndex = indexShiftTypes(bundle.shiftTypes);
  const entriesByKey = indexEntries(bundle.entries);

  const headCells = days
    .map((day) => {
      const cls = isWeekend(day) ? 'weekend' : '';
      return `<th class="${cls}"><div>${day.getDate()}</div><div>${getWeekdayLabel(day)}</div></th>`;
    })
    .join('');

  const rows = bundle.staff
    .map((member) => {
      const label =
        member.credentials !== ''
          ? `${member.full_name}, ${member.credentials}`
          : member.full_name;
      const cells = days
        .map((day) => {
          const entry = entriesByKey.get(entryKey(member.id, day.getDate()));
          const display = resolveShiftDisplay(entry, shiftTypesIndex);
          const bg = display.backgroundHex ?? 'transparent';
          const fg =
            display.backgroundHex === null
              ? 'inherit'
              : readableTextColor(display.backgroundHex);
          return `<td style="background:${bg};color:${fg}">${escapeHtml(display.text)}</td>`;
        })
        .join('');
      return `<tr><td class="name">${escapeHtml(label)}</td>${cells}</tr>`;
    })
    .join('');

  return `
    <table class="grid">
      <thead><tr><th class="name">Name of Staff</th>${headCells}</tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderLegend(bundle: ScheduleBundle): string {
  const shiftItems = bundle.shiftTypes
    .map((shiftType) => {
      const hours = shiftType.hours_range !== '' ? ` (${escapeHtml(shiftType.hours_range)})` : '';
      return `<li><span class="swatch" style="background:${shiftType.color_hex}"></span><strong>${escapeHtml(shiftType.code)}</strong><span>${escapeHtml(shiftType.label)}${hours}</span></li>`;
    })
    .join('');
  const abbrItems = bundle.legendAbbreviations
    .map(
      (abbr) =>
        `<li><strong>${escapeHtml(abbr.abbreviation)}</strong> = ${escapeHtml(abbr.meaning)}</li>`,
    )
    .join('');
  return `
    <section class="legend">
      <h2>Legend</h2>
      <ul>${shiftItems}</ul>
      ${abbrItems === '' ? '' : `<ul class="abbr">${abbrItems}</ul>`}
    </section>`;
}

function renderSignatories(bundle: ScheduleBundle): string {
  const cols = bundle.signatories
    .map(
      (signatory) => `
      <div class="col">
        <div class="role">${escapeHtml(SIGNATORY_ROLE_LABEL[signatory.role])}:</div>
        <div class="name">${escapeHtml(signatory.fullName || ' ')}</div>
        <div>${escapeHtml(signatory.title)}</div>
      </div>`,
    )
    .join('');
  return `<div class="sign">${cols}</div>`;
}

export function renderScheduleHtml(bundle: ScheduleBundle): string {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8" /><style>${PAGE_CSS}</style></head>
<body>
  <div class="doc">
    ${renderHeader(bundle)}
    ${renderTitle(bundle)}
    ${renderGrid(bundle)}
    <div class="foot">
      ${renderLegend(bundle)}
      ${renderSignatories(bundle)}
    </div>
  </div>
</body>
</html>`;
}
