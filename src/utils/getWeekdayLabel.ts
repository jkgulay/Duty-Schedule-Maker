const WEEKDAY_ABBREVIATIONS: readonly string[] = [
  'Sun',
  'Mon',
  'Tue',
  'Wed',
  'Thu',
  'Fri',
  'Sat',
];

/**
 * Three-letter weekday abbreviation for a date, e.g. "Tue".
 * Uses the date's local day-of-week.
 */
export function getWeekdayLabel(date: Date): string {
  const label = WEEKDAY_ABBREVIATIONS[date.getDay()];
  // getDay() is always 0-6, so this is unreachable — kept for exhaustiveness.
  if (label === undefined) {
    throw new Error(`Unexpected day index: ${date.getDay()}`);
  }
  return label;
}
