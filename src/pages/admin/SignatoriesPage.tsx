import type { ReactNode } from 'react';

import { AppLayout } from '@/components/AppLayout/AppLayout';
import { SignatoryManager } from '@/components/SignatoryManager/SignatoryManager';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { Spinner } from '@/components/ui/Spinner';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import {
  useCreateSignatory,
  useSignatories,
  useUpdateSignatory,
} from '@/hooks/useSignatories';

export function SignatoriesPage(): ReactNode {
  useDocumentTitle('Signatories');
  const { hospitalId } = useAuth();
  const signatoriesQuery = useSignatories();
  const createSignatory = useCreateSignatory();
  const updateSignatory = useUpdateSignatory();

  const mutationError = createSignatory.error ?? updateSignatory.error;

  return (
    <AppLayout>
      <h1 className="mb-2 text-2xl font-semibold text-gray-900">Signatories</h1>
      <p className="mb-6 text-sm text-gray-600">
        Hospital defaults for the “Prepared by / Noted by / Approved by” block. Individual
        schedules can override these later.
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
      ) : signatoriesQuery.isLoading ? (
        <Spinner label="Loading signatories" />
      ) : signatoriesQuery.isError ? (
        <InlineBanner tone="error">{signatoriesQuery.error.message}</InlineBanner>
      ) : (
        <SignatoryManager
          signatories={signatoriesQuery.data ?? []}
          creating={createSignatory.isPending}
          updating={updateSignatory.isPending}
          onCreate={(input) => createSignatory.mutate({ hospitalId, input })}
          onUpdate={(signatoryId, input) =>
            updateSignatory.mutate({ signatoryId, input })
          }
        />
      )}
    </AppLayout>
  );
}
