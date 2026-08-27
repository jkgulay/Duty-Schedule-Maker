import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  createSignatory,
  fetchScheduleSignatories,
  fetchSignatories,
  updateSignatory,
} from '@/api/signatoriesApi';
import { queryKeys } from '@/hooks/queryKeys';
import type {
  ScheduleSignatory,
  Signatory,
  SignatoryInput,
} from '@/types/signatory.types';

export function useSignatories(): UseQueryResult<Signatory[], Error> {
  return useQuery({
    queryKey: queryKeys.signatories,
    queryFn: fetchSignatories,
  });
}

/** Per-schedule signatory overrides (may be empty; defaults fill the gaps). */
export function useScheduleSignatories(
  scheduleId: string,
): UseQueryResult<ScheduleSignatory[], Error> {
  return useQuery({
    queryKey: queryKeys.scheduleSignatories(scheduleId),
    queryFn: () => fetchScheduleSignatories(scheduleId),
  });
}

interface CreateSignatoryVariables {
  hospitalId: string;
  input: SignatoryInput;
}

interface UpdateSignatoryVariables {
  signatoryId: string;
  input: SignatoryInput;
}

function useInvalidateSignatories(): () => Promise<void> {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.signatories });
}

export function useCreateSignatory(): UseMutationResult<
  Signatory,
  Error,
  CreateSignatoryVariables
> {
  const invalidate = useInvalidateSignatories();
  return useMutation({
    mutationFn: ({ hospitalId, input }: CreateSignatoryVariables) =>
      createSignatory(hospitalId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateSignatory(): UseMutationResult<
  Signatory,
  Error,
  UpdateSignatoryVariables
> {
  const invalidate = useInvalidateSignatories();
  return useMutation({
    mutationFn: ({ signatoryId, input }: UpdateSignatoryVariables) =>
      updateSignatory(signatoryId, input),
    onSuccess: invalidate,
  });
}
