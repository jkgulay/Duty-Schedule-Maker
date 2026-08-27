const SUNDAY = 0;
const SATURDAY = 6;

/** True for Saturday or Sunday — those day headers render in red. */
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === SATURDAY || day === SUNDAY;
}
