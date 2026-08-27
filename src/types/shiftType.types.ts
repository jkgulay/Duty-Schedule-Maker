import type { LegendAbbreviationRow, ShiftTypeRow } from '@/types/database.types';

export type ShiftType = ShiftTypeRow;
export type LegendAbbreviation = LegendAbbreviationRow;

/** Fields a user provides when configuring a shift type (legend entry). */
export interface ShiftTypeInput {
  code: string;
  label: string;
  colorHex: string;
  hoursRange: string;
  sortOrder: number;
}

/**
 * Resolved presentation of a single grid cell. Produced by
 * `resolveShiftDisplay` — the single source of truth shared by the on-screen
 * grid, the legend, and the PDF template.
 */
export interface ShiftDisplay {
  /** Text shown in the cell, e.g. "M", "OFF (R)", "NA", or "" when empty. */
  text: string;
  /** Cell background. `null` means "no fill" (render as white/transparent). */
  backgroundHex: string | null;
  /** Accessible description, e.g. "7am - 3pm (Request)". */
  label: string;
  isRequest: boolean;
  isNa: boolean;
}
