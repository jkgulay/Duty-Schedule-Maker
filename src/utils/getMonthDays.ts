/**
 * Every calendar day of a given 1-based month, as local `Date` objects.
 * Handles 28-31 day months (including leap-year February).
 */
export function getMonthDays(month: number, year: number): Date[] {
  if (month < 1 || month > 12) {
    throw new Error(`Month out of range (expected 1-12): ${month}`);
  }
  // Day 0 of the next month is the last day of this month.
  const dayCount = new Date(year, month, 0).getDate();
  const days: Date[] = [];
  for (let day = 1; day <= dayCount; day += 1) {
    days.push(new Date(year, month - 1, day));
  }
  return days;
}
