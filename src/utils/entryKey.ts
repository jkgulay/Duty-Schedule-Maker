import type { ScheduleEntry } from '@/types/schedule.types';

/** Stable key for indexing schedule entries by staff member + day. */
export function entryKey(staffId: string, dayOfMonth: number): string {
  return `${staffId}:${dayOfMonth}`;
}

export function indexEntries(
  entries: readonly ScheduleEntry[],
): ReadonlyMap<string, ScheduleEntry> {
  return new Map(
    entries.map((entry) => [entryKey(entry.staff_id, entry.day_of_month), entry]),
  );
}
