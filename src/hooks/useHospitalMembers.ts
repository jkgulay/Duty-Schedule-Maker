import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from '@tanstack/react-query';

import {
  assignMemberToHospital,
  fetchHospitalMembers,
  updateMemberRole,
} from '@/api/usersApi';
import type { Role } from '@/constants/roles';
import { queryKeys } from '@/hooks/queryKeys';
import type { Member } from '@/types/member.types';

export function useHospitalMembers(): UseQueryResult<Member[], Error> {
  return useQuery({
    queryKey: queryKeys.hospitalMembers,
    queryFn: fetchHospitalMembers,
  });
}

interface RoleVariables {
  userId: string;
  role: Role;
}

interface AssignVariables extends RoleVariables {
  hospitalId: string;
}

function useInvalidateMembers(): () => Promise<void> {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: queryKeys.hospitalMembers });
}

export function useUpdateMemberRole(): UseMutationResult<Member, Error, RoleVariables> {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ userId, role }: RoleVariables) => updateMemberRole(userId, role),
    onSuccess: invalidate,
  });
}

export function useAssignMember(): UseMutationResult<Member, Error, AssignVariables> {
  const invalidate = useInvalidateMembers();
  return useMutation({
    mutationFn: ({ userId, hospitalId, role }: AssignVariables) =>
      assignMemberToHospital(userId, hospitalId, role),
    onSuccess: invalidate,
  });
}
