import { useMemo } from 'react';

import { useHospital } from '@/hooks/useHospital';
import { useLegendAbbreviations } from '@/hooks/useLegendAbbreviations';
import { useSchedule } from '@/hooks/useSchedule';
import { useScheduleSignatories, useSignatories } from '@/hooks/useSignatories';
import { useShiftTypes } from '@/hooks/useShiftTypes';
import { useStaff } from '@/hooks/useStaff';
import { useWards } from '@/hooks/useWards';
import type { Hospital } from '@/types/hospital.types';
import type { Schedule, ScheduleEntry } from '@/types/schedule.types';
import type { LegendAbbreviation, ShiftType } from '@/types/shiftType.types';
import type { ResolvedSignatory } from '@/types/signatory.types';
import type { Staff } from '@/types/staff.types';
import { indexEntries } from '@/utils/entryKey';
import { getMonthDays } from '@/utils/getMonthDays';
import { resolveSignatories } from '@/utils/resolveSignatories';

export interface ScheduleViewState {
  schedule: Schedule | undefined;
  hospital: Hospital | null;
  wardName: string;
  staff: readonly Staff[];
  days: readonly Date[];
  entriesByKey: ReadonlyMap<string, ScheduleEntry>;
  shiftTypes: readonly ShiftType[];
  legendAbbreviations: readonly LegendAbbreviation[];
  signatories: readonly ResolvedSignatory[];
  isLoading: boolean;
  loadError: string | null;
}

export function useScheduleView(scheduleId: string): ScheduleViewState {
  const { schedule, entries, isLoading, isError, error } = useSchedule(scheduleId);
  const hospitalQuery = useHospital();
  const wardsQuery = useWards();
  const staffQuery = useStaff(true);
  const shiftTypesQuery = useShiftTypes();
  const legendQuery = useLegendAbbreviations();
  const signatoriesQuery = useSignatories();
  const scheduleSignatoriesQuery = useScheduleSignatories(scheduleId);

  const entriesByKey = useMemo(() => indexEntries(entries), [entries]);

  const days = useMemo<readonly Date[]>(
    () => (schedule === undefined ? [] : getMonthDays(schedule.month, schedule.year)),
    [schedule],
  );

  // Show every active nurse, plus any inactive nurse who still has an entry
  // in this schedule (e.g. deactivated after it was drafted).
  const staff = useMemo<readonly Staff[]>(() => {
    const all = staffQuery.data ?? [];
    const staffWithEntries = new Set(entries.map((entry) => entry.staff_id));
    return all.filter((member) => member.active || staffWithEntries.has(member.id));
  }, [staffQuery.data, entries]);

  const wardName = useMemo(() => {
    if (schedule === undefined) {
      return '';
    }
    return (
      (wardsQuery.data ?? []).find((ward) => ward.id === schedule.ward_id)?.name ?? ''
    );
  }, [wardsQuery.data, schedule]);

  const signatories = useMemo(
    () =>
      resolveSignatories(
        signatoriesQuery.data ?? [],
        scheduleSignatoriesQuery.data ?? [],
      ),
    [signatoriesQuery.data, scheduleSignatoriesQuery.data],
  );

  const dependentErrors = [
    isError ? (error?.message ?? 'Could not load this schedule') : null,
    hospitalQuery.error?.message ?? null,
    wardsQuery.error?.message ?? null,
    staffQuery.error?.message ?? null,
    shiftTypesQuery.error?.message ?? null,
    legendQuery.error?.message ?? null,
    signatoriesQuery.error?.message ?? null,
    scheduleSignatoriesQuery.error?.message ?? null,
  ];

  return {
    schedule,
    hospital: hospitalQuery.data ?? null,
    wardName,
    staff,
    days,
    entriesByKey,
    shiftTypes: shiftTypesQuery.data ?? [],
    legendAbbreviations: legendQuery.data ?? [],
    signatories,
    isLoading:
      isLoading ||
      hospitalQuery.isLoading ||
      wardsQuery.isLoading ||
      staffQuery.isLoading ||
      shiftTypesQuery.isLoading ||
      legendQuery.isLoading ||
      signatoriesQuery.isLoading ||
      scheduleSignatoriesQuery.isLoading,
    loadError: dependentErrors.find((message) => message !== null) ?? null,
  };
}
