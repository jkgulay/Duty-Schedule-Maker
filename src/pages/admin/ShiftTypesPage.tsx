import type { ReactNode } from 'react';

import { AppLayout } from '@/components/AppLayout/AppLayout';
import { ShiftTypeManager } from '@/components/ShiftTypeManager/ShiftTypeManager';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  useCreateShiftType,
  useDeleteShiftType,
  useShiftTypes,
  useUpdateShiftType,
} from '@/hooks/useShiftTypes';

export function ShiftTypesPage(): ReactNode {
  useDocumentTitle('Shift types & legend');
  const { hospitalId } = useAuth();
  const shiftTypesQuery = useShiftTypes();
  const createShiftType = useCreateShiftType();
  const updateShiftType = useUpdateShiftType();
  const deleteShiftType = useDeleteShiftType();

  const mutationError =
    createShiftType.error ?? updateShiftType.error ?? deleteShiftType.error;

  return (
    <AppLayout>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">
        Shift types &amp; legend
      </h1>
      <p className="mb-6 text-sm text-gray-600">
        Codes, colours, and hour ranges. The grid, the legend, and the exported PDF all
        read from this list.
      </p>

      {mutationError !== null && (
        <div className="mb-4">
          <InlineBanner tone="error">{mutationError.message}</InlineBanner>
        </div>
      )}

      {hospitalId === null ? (
        <EmptyState
          title="No hospital linked to your account"
          description="Ask an administrator to set your hospital first."
        />
      ) : shiftTypesQuery.isLoading ? (
        <Spinner label="Loading shift types" />
      ) : shiftTypesQuery.isError ? (
        <InlineBanner tone="error">{shiftTypesQuery.error.message}</InlineBanner>
      ) : (
        <ShiftTypeManager
          shiftTypes={shiftTypesQuery.data ?? []}
          creating={createShiftType.isPending}
          updating={updateShiftType.isPending}
          deleting={deleteShiftType.isPending}
          onCreate={(input) => createShiftType.mutate({ hospitalId, input })}
          onUpdate={(shiftTypeId, input) =>
            updateShiftType.mutate({ shiftTypeId, input })
          }
          onDelete={(shiftTypeId) => deleteShiftType.mutate(shiftTypeId)}
        />
      )}
    </AppLayout>
  );
}
