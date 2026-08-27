import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  createShiftType,
  deleteShiftType,
  fetchShiftTypes,
  updateShiftType,
} from '@/api/shiftTypesApi';
import { queryKeys } from '@/hooks/queryKeys';
import type { ShiftType, ShiftTypeInput } from '@/types/shiftType.types';

export function useShiftTypes(): UseQueryResult<ShiftType[], Error> {
  return useQuery({
    queryKey: queryKeys.shiftTypes,
    queryFn: fetchShiftTypes,
  });
}

interface CreateShiftTypeVariables {
  hospitalId: string;
  input: ShiftTypeInput;
}

interface UpdateShiftTypeVariables {
  shiftTypeId: string;
  input: ShiftTypeInput;
}

function useInvalidateShiftTypes(): () => Promise<void> {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.shiftTypes });
}

export function useCreateShiftType(): UseMutationResult<
  ShiftType,
  Error,
  CreateShiftTypeVariables
> {
  const invalidate = useInvalidateShiftTypes();
  return useMutation({
    mutationFn: ({ hospitalId, input }: CreateShiftTypeVariables) =>
      createShiftType(hospitalId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateShiftType(): UseMutationResult<
  ShiftType,
  Error,
  UpdateShiftTypeVariables
> {
  const invalidate = useInvalidateShiftTypes();
  return useMutation({
    mutationFn: ({ shiftTypeId, input }: UpdateShiftTypeVariables) =>
      updateShiftType(shiftTypeId, input),
    onSuccess: invalidate,
  });
}

export function useDeleteShiftType(): UseMutationResult<void, Error, string> {
  const invalidate = useInvalidateShiftTypes();
  return useMutation({
    mutationFn: (shiftTypeId: string) => deleteShiftType(shiftTypeId),
    onSuccess: invalidate,
  });
}
