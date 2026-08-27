import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { createStaff, fetchStaff, updateStaff } from '@/api/staffApi';
import { queryKeys } from '@/hooks/queryKeys';
import type { Staff, StaffInput } from '@/types/staff.types';

export function useStaff(includeInactive = false): UseQueryResult<Staff[], Error> {
  return useQuery({
    queryKey: queryKeys.staff(includeInactive),
    queryFn: () => fetchStaff(includeInactive),
  });
}

interface CreateStaffVariables {
  hospitalId: string;
  input: StaffInput;
}

interface UpdateStaffVariables {
  staffId: string;
  input: StaffInput;
}

function useInvalidateStaff(): () => Promise<void> {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ['staff'] });
}

export function useCreateStaff(): UseMutationResult<Staff, Error, CreateStaffVariables> {
  const invalidate = useInvalidateStaff();
  return useMutation({
    mutationFn: ({ hospitalId, input }: CreateStaffVariables) =>
      createStaff(hospitalId, input),
    onSuccess: invalidate,
  });
}

export function useUpdateStaff(): UseMutationResult<Staff, Error, UpdateStaffVariables> {
  const invalidate = useInvalidateStaff();
  return useMutation({
    mutationFn: ({ staffId, input }: UpdateStaffVariables) => updateStaff(staffId, input),
    onSuccess: invalidate,
  });
}
