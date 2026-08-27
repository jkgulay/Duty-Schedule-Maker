import {
  useMutation,
  useQueryClient,
  type UseMutationResult,
} from '@tanstack/react-query';

import { bulkUpsertEntries, deleteEntry, upsertEntry } from '@/api/scheduleEntriesApi';
import { queryKeys } from '@/hooks/queryKeys';
import type { ScheduleEntry, ScheduleEntryInput } from '@/types/schedule.types';

function useInvalidateEntries(scheduleId: string): () => Promise<void> {
  const queryClient = useQueryClient();
  return () =>
    queryClient.invalidateQueries({ queryKey: queryKeys.scheduleEntries(scheduleId) });
}

export function useUpsertScheduleEntry(
  scheduleId: string,
): UseMutationResult<ScheduleEntry, Error, ScheduleEntryInput> {
  const invalidate = useInvalidateEntries(scheduleId);
  return useMutation({
    mutationFn: (input: ScheduleEntryInput) => upsertEntry(input),
    onSuccess: invalidate,
  });
}

export function useBulkUpsertScheduleEntries(
  scheduleId: string,
): UseMutationResult<ScheduleEntry[], Error, readonly ScheduleEntryInput[]> {
  const invalidate = useInvalidateEntries(scheduleId);
  return useMutation({
    mutationFn: (inputs: readonly ScheduleEntryInput[]) => bulkUpsertEntries(inputs),
    onSuccess: invalidate,
  });
}

export function useDeleteScheduleEntry(
  scheduleId: string,
): UseMutationResult<void, Error, string> {
  const invalidate = useInvalidateEntries(scheduleId);
  return useMutation({
    mutationFn: (entryId: string) => deleteEntry(entryId),
    onSuccess: invalidate,
  });
}
