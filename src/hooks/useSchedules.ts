import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { createSchedule, fetchSchedulesForWard } from '@/api/schedulesApi';
import { queryKeys } from '@/hooks/queryKeys';
import type { CreateScheduleInput, Schedule } from '@/types/schedule.types';

export function useSchedules(wardId: string | null): UseQueryResult<Schedule[], Error> {
  return useQuery({
    queryKey: queryKeys.schedules(wardId ?? 'none'),
    queryFn: () => {
      if (wardId === null) {
        throw new Error('No ward selected');
      }
      return fetchSchedulesForWard(wardId);
    },
    enabled: wardId !== null,
  });
}

export function useCreateSchedule(): UseMutationResult<
  Schedule,
  Error,
  CreateScheduleInput
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateScheduleInput) => createSchedule(input),
    onSuccess: (schedule) =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.schedules(schedule.ward_id),
      }),
  });
}
