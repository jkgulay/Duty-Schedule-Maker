import type { ReactNode } from 'react';

import { AppLayout } from '@/components/AppLayout/AppLayout';
import { StaffManager } from '@/components/StaffManager/StaffManager';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCreateStaff, useStaff, useUpdateStaff } from '@/hooks/useStaff';

export function StaffPage(): ReactNode {
  useDocumentTitle('Staff management');
  const { hospitalId } = useAuth();
  const staffQuery = useStaff(true);
  const createStaff = useCreateStaff();
  const updateStaff = useUpdateStaff();

  const mutationError = createStaff.error ?? updateStaff.error;

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Staff management</h1>

      {mutationError !== null && (
        <div className="mb-4">
          <InlineBanner tone="error">{mutationError.message}</InlineBanner>
        </div>
      )}

      {hospitalId === null ? (
        <EmptyState
          title="No hospital linked to your account"
          description="Ask an administrator to set your hospital before managing staff."
        />
      ) : staffQuery.isLoading ? (
        <Spinner label="Loading staff" />
      ) : staffQuery.isError ? (
        <InlineBanner tone="error">{staffQuery.error.message}</InlineBanner>
      ) : (
        <StaffManager
          staff={staffQuery.data ?? []}
          creating={createStaff.isPending}
          updating={updateStaff.isPending}
          onCreate={(input) => createStaff.mutate({ hospitalId, input })}
          onUpdate={(staffId, input) => updateStaff.mutate({ staffId, input })}
        />
      )}
    </AppLayout>
  );
}
