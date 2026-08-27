import type { ReactNode } from 'react';

import { AppLayout } from '@/components/AppLayout/AppLayout';
import { UserManager } from '@/components/UserManager/UserManager';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  useAssignMember,
  useHospitalMembers,
  useUpdateMemberRole,
} from '@/hooks/useHospitalMembers';

export function UsersPage(): ReactNode {
  useDocumentTitle('Users & roles');
  const { profile, hospitalId } = useAuth();
  const membersQuery = useHospitalMembers();
  const updateRole = useUpdateMemberRole();
  const assignMember = useAssignMember();

  const mutationError = updateRole.error ?? assignMember.error;
  const busy = updateRole.isPending || assignMember.isPending;

  return (
    <AppLayout>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Users &amp; roles</h1>
      <p className="mb-6 text-sm text-gray-600">
        Assign each account a role: <strong>viewer</strong> (read-only),{' '}
        <strong>scheduler</strong> (create and edit draft schedules), or{' '}
        <strong>approver</strong> (advance a schedule’s status and manage users).
      </p>

      {mutationError !== null && (
        <div className="mb-4">
          <InlineBanner tone="error">{mutationError.message}</InlineBanner>
        </div>
      )}

      {hospitalId === null || profile === null ? (
        <EmptyState
          title="Your account isn’t linked to a hospital"
          description="Set your hospital before managing other users."
        />
      ) : membersQuery.isLoading ? (
        <Spinner label="Loading users" />
      ) : membersQuery.isError ? (
        <InlineBanner tone="error">{membersQuery.error.message}</InlineBanner>
      ) : (
        <UserManager
          members={membersQuery.data ?? []}
          currentUserId={profile.id}
          busy={busy}
          onChangeRole={(userId, role) => updateRole.mutate({ userId, role })}
          onAssign={(userId, role) => assignMember.mutate({ userId, hospitalId, role })}
        />
      )}
    </AppLayout>
  );
}
