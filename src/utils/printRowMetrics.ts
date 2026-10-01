/**
 * Row height + cell font size for the printed grid, scaled down as the
 * roster grows so the whole document — fixed-size header/title/legend/
 * signatures plus the table — always fits on the single
 * `@page { size: 13in 8.5in }` sheet instead of spilling onto a second page.
 *
 * The header, legend and signature block are never shrunk; only the table
 * rows are. To know how much vertical space is left for rows, this adds up
 * the real pixel height of those fixed parts (from their Tailwind classes in
 * `ScheduleHeader`, `ScheduleTitle`, `ShiftLegend`, `SignatoryBlock`) instead
 * of a single guessed constant — the legend's height depends on how many
 * shift types / abbreviations the hospital has configured, so a fixed
 * estimate was either wrong for small hospitals or overflowing for larger
 * ones.
 */
const PX_PER_IN = 96;
const PAGE_HEIGHT_IN = 8.5;
const PAGE_MARGIN_IN = 0.35;
/** Buffer against font-metric rounding differences between browsers. */
const SAFETY_MARGIN_IN = 0.15;

const HEADER_PX = 80; // ScheduleHeader: logo (64px) + py-2 (16px)
const TITLE_PX = 88; // ScheduleTitle: 3 lines @ 24px + py-2 (16px)
const GRID_GAP_PX = 8; // mt-2 before the grid
const THEAD_PX = 40; // 2-line day header + print padding
const FOOTER_GAP_PX = 12; // print:mt-3 before the legend/signature row
const LEGEND_HEADER_PX = 22; // "LEGEND" heading + mb-1
const LINE_PX = 18; // one text-xs line (12px * 1.5 line-height)
const ABBR_GAP_PX = 4; // mt-1 before the abbreviation list
const SIGNATORY_PX = 82; // one signatory column's fixed height

const MAX_ROW_HEIGHT_IN = 0.5;
const MIN_ROW_HEIGHT_IN = 0.16;
const MAX_FONT_PX = 9.5;
const MIN_FONT_PX = 6.5;
/**
 * The name column is wide (1.9in) and holds one line of text, unlike the
 * narrow day cells — it can stay comfortably larger than the shift-code font
 * even when rows get tight, so it gets its own, gentler floor/ceiling.
 */
const NAME_MIN_FONT_PX = 8;
const NAME_MAX_FONT_PX = 11;

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export interface PrintRowMetrics {
  rowHeightIn: number;
  fontPx: number;
  nameFontPx: number;
}

export function computePrintRowMetrics(
  staffCount: number,
  shiftTypeCount: number,
  abbreviationCount: number,
): PrintRowMetrics {
  const legendPx =
    LEGEND_HEADER_PX +
    shiftTypeCount * LINE_PX +
    (abbreviationCount > 0 ? ABBR_GAP_PX + abbreviationCount * LINE_PX : 0);
  const footerPx = FOOTER_GAP_PX + Math.max(legendPx, SIGNATORY_PX);
  const overheadIn =
    (HEADER_PX + TITLE_PX + GRID_GAP_PX + THEAD_PX + footerPx) / PX_PER_IN;

  const availableIn =
    PAGE_HEIGHT_IN - 2 * PAGE_MARGIN_IN - overheadIn - SAFETY_MARGIN_IN;
  const rowHeightIn =
    staffCount <= 0
      ? MAX_ROW_HEIGHT_IN
      : clamp(availableIn / staffCount, MIN_ROW_HEIGHT_IN, MAX_ROW_HEIGHT_IN);
  const fontPx = clamp(
    (rowHeightIn / MAX_ROW_HEIGHT_IN) * MAX_FONT_PX,
    MIN_FONT_PX,
    MAX_FONT_PX,
  );
  const nameFontPx = clamp(fontPx + 2, NAME_MIN_FONT_PX, NAME_MAX_FONT_PX);
  return { rowHeightIn, fontPx, nameFontPx };
}
