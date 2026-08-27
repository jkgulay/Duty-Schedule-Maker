import { MONTH_LABELS } from '@/constants/months';

/**
 * Formats a 1-based month and a year as the document's title line,
 * e.g. (9, 2026) -> "SEPTEMBER 2026".
 */
export function formatMonth(month: number, year: number): string {
  const name = MONTH_LABELS[month - 1];
  if (name === undefined) {
    throw new Error(`Month out of range (expected 1-12): ${month}`);
  }
  return `${name.toUpperCase()} ${year}`;
}
