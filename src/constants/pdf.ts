/**
 * Target page geometry for the exported PDF: Long Bond (8.5in x 13in),
 * landscape. Consumed by the `generate-schedule-pdf` Edge Function (later
 * phase); defined here so the frontend preview and the export agree.
 */
export const LONG_BOND_LANDSCAPE = {
  widthMm: 330.2,
  heightMm: 215.9,
  orientation: 'landscape',
} as const;

/** Fixed title lines on the document. */
export const DOCUMENT_TITLE = 'Nursing Service Duty Schedule';
