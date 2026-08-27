import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import { createWard, deleteWard, fetchWards, renameWard } from '@/api/wardsApi';
import { queryKeys } from '@/hooks/queryKeys';
import type { Ward } from '@/types/hospital.types';

export function useWards(): UseQueryResult<Ward[], Error> {
  return useQuery({
    queryKey: queryKeys.wards,
    queryFn: fetchWards,
  });
}

interface CreateWardVariables {
  hospitalId: string;
  name: string;
}

interface RenameWardVariables {
  wardId: string;
  name: string;
}

export function useCreateWard(): UseMutationResult<Ward, Error, CreateWardVariables> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ hospitalId, name }: CreateWardVariables) =>
      createWard(hospitalId, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.wards }),
  });
}

export function useRenameWard(): UseMutationResult<Ward, Error, RenameWardVariables> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ wardId, name }: RenameWardVariables) => renameWard(wardId, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.wards }),
  });
}

export function useDeleteWard(): UseMutationResult<void, Error, string> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (wardId: string) => deleteWard(wardId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.wards }),
  });
}
