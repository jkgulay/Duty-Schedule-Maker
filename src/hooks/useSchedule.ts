import { useQuery } from '@tanstack/react-query';

import { fetchEntriesForSchedule } from '@/api/scheduleEntriesApi';
import { fetchScheduleById } from '@/api/schedulesApi';
import { queryKeys } from '@/hooks/queryKeys';
import type { Schedule, ScheduleEntry } from '@/types/schedule.types';

interface UseScheduleResult {
  schedule: Schedule | undefined;
  entries: ScheduleEntry[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/** One schedule and its cells, for the editor and the read-only view. */
export function useSchedule(scheduleId: string): UseScheduleResult {
  const scheduleQuery = useQuery({
    queryKey: queryKeys.schedule(scheduleId),
    queryFn: () => fetchScheduleById(scheduleId),
  });

  const entriesQuery = useQuery({
    queryKey: queryKeys.scheduleEntries(scheduleId),
    queryFn: () => fetchEntriesForSchedule(scheduleId),
  });

  return {
    schedule: scheduleQuery.data,
    entries: entriesQuery.data ?? [],
    isLoading: scheduleQuery.isLoading || entriesQuery.isLoading,
    isError: scheduleQuery.isError || entriesQuery.isError,
    error: scheduleQuery.error ?? entriesQuery.error,
  };
}
