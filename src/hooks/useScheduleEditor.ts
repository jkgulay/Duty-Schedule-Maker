import { useCallback, useMemo } from 'react';

import { ALL_STAFF } from '@/constants/scheduleEditor';
import { SCHEDULE_STATUS } from '@/constants/scheduleStatus';
import { useSchedule } from '@/hooks/useSchedule';
import {
  useBulkUpsertScheduleEntries,
  useDeleteScheduleEntry,
  useUpsertScheduleEntry,
} from '@/hooks/useScheduleEntries';
import { useShiftTypes } from '@/hooks/useShiftTypes';
import { useStaff } from '@/hooks/useStaff';
import type {
  BulkAssignParams,
  CellState,
  Schedule,
  ScheduleEntry,
  ScheduleEntryInput,
} from '@/types/schedule.types';
import type { ShiftType } from '@/types/shiftType.types';
import type { Staff } from '@/types/staff.types';
import { decodeCellValue, isEmptyCell } from '@/utils/cellValue';
import { entryKey, indexEntries } from '@/utils/entryKey';
import { friendlySaveError } from '@/utils/friendlySaveError';
import { getMonthDays } from '@/utils/getMonthDays';

interface ScheduleEditorState {
  schedule: Schedule | undefined;
  staff: readonly Staff[];
  shiftTypes: readonly ShiftType[];
  days: readonly Date[];
  entriesByKey: ReadonlyMap<string, ScheduleEntry>;
  editable: boolean;
  isLoading: boolean;
  loadError: string | null;
  isSaving: boolean;
  saveError: string | null;
  changeCell: (staffId: string, dayOfMonth: number, next: CellState) => void;
  bulkAssign: (params: BulkAssignParams) => void;
}

export function useScheduleEditor(scheduleId: string): ScheduleEditorState {
  const { schedule, entries, isLoading, isError, error } = useSchedule(scheduleId);
  const staffQuery = useStaff(false);
  const shiftTypesQuery = useShiftTypes();

  const upsert = useUpsertScheduleEntry(scheduleId);
  const bulkUpsert = useBulkUpsertScheduleEntries(scheduleId);
  const remove = useDeleteScheduleEntry(scheduleId);

  const staff = useMemo<readonly Staff[]>(() => staffQuery.data ?? [], [staffQuery.data]);
  const shiftTypes = useMemo<readonly ShiftType[]>(
    () => shiftTypesQuery.data ?? [],
    [shiftTypesQuery.data],
  );

  const days = useMemo<readonly Date[]>(
    () => (schedule === undefined ? [] : getMonthDays(schedule.month, schedule.year)),
    [schedule],
  );

  const entriesByKey = useMemo(() => indexEntries(entries), [entries]);
  const editable = schedule?.status === SCHEDULE_STATUS.DRAFT;

  const changeCell = useCallback(
    (staffId: string, dayOfMonth: number, next: CellState): void => {
      const existing = entriesByKey.get(entryKey(staffId, dayOfMonth));
      if (isEmptyCell(next)) {
        if (existing !== undefined) {
          remove.mutate(existing.id);
        }
        return;
      }
      const input: ScheduleEntryInput = {
        scheduleId,
        staffId,
        dayOfMonth,
        ...next,
      };
      upsert.mutate(input);
    },
    [entriesByKey, remove, scheduleId, upsert],
  );

  const bulkAssign = useCallback(
    ({ staffId, value, fromDay, toDay }: BulkAssignParams): void => {
      const cellState = decodeCellValue(value);
      const targetIds =
        staffId === ALL_STAFF ? staff.map((member) => member.id) : [staffId];
      const inputs: ScheduleEntryInput[] = [];
      for (const id of targetIds) {
        for (let day = fromDay; day <= toDay; day += 1) {
          inputs.push({ scheduleId, staffId: id, dayOfMonth: day, ...cellState });
        }
      }
      if (inputs.length > 0) {
        bulkUpsert.mutate(inputs);
      }
    },
    [bulkUpsert, scheduleId, staff],
  );

  const rawSaveError = upsert.error ?? bulkUpsert.error ?? remove.error;

  return {
    schedule,
    staff,
    shiftTypes,
    days,
    entriesByKey,
    editable,
    isLoading: isLoading || staffQuery.isLoading || shiftTypesQuery.isLoading,
    loadError: isError
      ? (error?.message ?? 'Could not load this schedule')
      : (staffQuery.error?.message ?? shiftTypesQuery.error?.message ?? null),
    isSaving: upsert.isPending || bulkUpsert.isPending || remove.isPending,
    saveError: rawSaveError === null ? null : friendlySaveError(rawSaveError),
    changeCell,
    bulkAssign,
  };
}
