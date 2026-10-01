import { getMonthDays } from '@/utils/getMonthDays';

/**
 * The calendar days of one half-month period: 1 = days 1-15, 2 = day 16 to
 * the end of the month.
 */
export function getPeriodDays(month: number, year: number, period: 1 | 2): Date[] {
  const monthDays = getMonthDays(month, year);
  return period === 1 ? monthDays.slice(0, 15) : monthDays.slice(15);
}
