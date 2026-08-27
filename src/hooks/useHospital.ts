import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { fetchMyHospital, updateHospitalIdentity } from '@/api/hospitalsApi';
import { queryKeys } from '@/hooks/queryKeys';
import type { Hospital, HospitalIdentityInput } from '@/types/hospital.types';

export function useHospital(): UseQueryResult<Hospital | null, Error> {
  return useQuery({
    queryKey: queryKeys.hospital,
    queryFn: fetchMyHospital,
  });
}

interface UpdateIdentityVariables {
  hospitalId: string;
  input: HospitalIdentityInput;
}

export function useUpdateHospitalIdentity(): UseMutationResult<
  Hospital,
  Error,
  UpdateIdentityVariables
> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hospitalId, input }: UpdateIdentityVariables) =>
      updateHospitalIdentity(hospitalId, input),
    onSuccess: (hospital) => {
      queryClient.setQueryData(queryKeys.hospital, hospital);
    },
  });
}
