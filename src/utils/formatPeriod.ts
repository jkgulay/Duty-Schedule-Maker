import { MONTH_LABELS } from '@/constants/months';

/**
 * Formats a half-month schedule period as the document's title line,
 * e.g. (10, 2026, 1) -> "OCTOBER 1-15, 2026", (10, 2026, 2) -> "OCTOBER 16-31, 2026".
 */
export function formatPeriod(month: number, year: number, period: 1 | 2): string {
  const name = MONTH_LABELS[month - 1];
  if (name === undefined) {
    throw new Error(`Month out of range (expected 1-12): ${month}`);
  }
  const lastDay = new Date(year, month, 0).getDate();
  const range = period === 1 ? '1-15' : `16-${lastDay}`;
  return `${name.toUpperCase()} ${range}, ${year}`;
}
