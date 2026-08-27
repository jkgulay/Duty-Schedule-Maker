import type { ReactNode } from 'react';

import { AppLayout } from '@/components/AppLayout/AppLayout';
import { HospitalIdentityForm } from '@/components/HospitalIdentityForm/HospitalIdentityForm';
import { WardList } from '@/components/WardList/WardList';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { Spinner } from '@/components/ui/Spinner';
import type { LogoSide } from '@/types/hospital.types';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useHospital, useUpdateHospitalIdentity } from '@/hooks/useHospital';
import { useLogoUpload } from '@/hooks/useLogoUpload';
import { useCreateWard, useDeleteWard, useRenameWard, useWards } from '@/hooks/useWards';

export function HospitalPage(): ReactNode {
  useDocumentTitle('Hospital setup');
  const { hospitalId } = useAuth();
  const hospitalQuery = useHospital();
  const wardsQuery = useWards();
  const updateIdentity = useUpdateHospitalIdentity();
  const logoUpload = useLogoUpload();
  const createWard = useCreateWard();
  const renameWard = useRenameWard();
  const deleteWard = useDeleteWard();

  const wardError = createWard.error ?? renameWard.error ?? deleteWard.error;

  if (hospitalQuery.isLoading) {
    return (
      <AppLayout>
        <Spinner label="Loading hospital" />
      </AppLayout>
    );
  }

  if (hospitalQuery.isError) {
    return (
      <AppLayout>
        <InlineBanner tone="error">{hospitalQuery.error.message}</InlineBanner>
      </AppLayout>
    );
  }

  const hospital = hospitalQuery.data;
  if (hospital === null || hospital === undefined || hospitalId === null) {
    return (
      <AppLayout>
        <EmptyState
          title="No hospital linked to your account"
          description="An administrator must create a hospital and link your profile to it."
        />
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Hospital setup</h1>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Identity
        </h2>
        {updateIdentity.isError && (
          <div className="mb-3">
            <InlineBanner tone="error">{updateIdentity.error.message}</InlineBanner>
          </div>
        )}
        {updateIdentity.isSuccess && (
          <div className="mb-3">
            <InlineBanner tone="success">Hospital details saved.</InlineBanner>
          </div>
        )}
        <HospitalIdentityForm
          hospital={hospital}
          saving={updateIdentity.isPending}
          onSave={(input) => updateIdentity.mutate({ hospitalId, input })}
          uploadLogo={(side: LogoSide, file: File) =>
            logoUpload.mutateAsync({ hospitalId, side, file })
          }
        />
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Wards
        </h2>
        {wardError !== null && (
          <div className="mb-3">
            <InlineBanner tone="error">{wardError.message}</InlineBanner>
          </div>
        )}
        {wardsQuery.isLoading ? (
          <Spinner label="Loading wards" />
        ) : wardsQuery.isError ? (
          <InlineBanner tone="error">{wardsQuery.error.message}</InlineBanner>
        ) : (
          <WardList
            wards={wardsQuery.data ?? []}
            creating={createWard.isPending}
            renaming={renameWard.isPending}
            deleting={deleteWard.isPending}
            onCreate={(name) => createWard.mutate({ hospitalId, name })}
            onRename={(wardId, name) => renameWard.mutate({ wardId, name })}
            onDelete={(wardId) => deleteWard.mutate(wardId)}
          />
        )}
      </section>
    </AppLayout>
  );
}
