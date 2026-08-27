import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout/AppLayout';
import { ScheduleDocument } from '@/components/ScheduleDocument/ScheduleDocument';
import { ScheduleStatusBadge } from '@/components/ScheduleStatusBadge/ScheduleStatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { Spinner } from '@/components/ui/Spinner';
import { SCHEDULE_STATUS } from '@/constants/scheduleStatus';
import { isEditorRole } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useScheduleView } from '@/hooks/useScheduleView';
import { scheduleEditorPath } from '@/routes/paths';
import { formatMonth } from '@/utils/formatMonth';

export function ScheduleViewPage(): ReactNode {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  return scheduleId === undefined ? (
    <AppLayout>
      <EmptyState title="No schedule specified" />
    </AppLayout>
  ) : (
    <ScheduleView scheduleId={scheduleId} />
  );
}

function ScheduleView({ scheduleId }: { scheduleId: string }): ReactNode {
  const view = useScheduleView(scheduleId);
  const { role } = useAuth();

  const title =
    view.schedule === undefined
      ? 'Schedule'
      : formatMonth(view.schedule.month, view.schedule.year);
  useDocumentTitle(title);

  if (view.isLoading) {
    return (
      <AppLayout>
        <Spinner label="Loading schedule" />
      </AppLayout>
    );
  }

  if (view.loadError !== null || view.schedule === undefined) {
    return (
      <AppLayout>
        <InlineBanner tone="error">{view.loadError ?? 'Schedule not found'}</InlineBanner>
      </AppLayout>
    );
  }

  if (view.hospital === null) {
    return (
      <AppLayout>
        <EmptyState
          title="No hospital linked to your account"
          description="Ask an administrator to link your profile to a hospital."
        />
      </AppLayout>
    );
  }

  const canEdit = isEditorRole(role) && view.schedule.status === SCHEDULE_STATUS.DRAFT;

  return (
    <AppLayout>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="flex items-center gap-3 text-2xl font-semibold text-gray-900">
          {title}
          <ScheduleStatusBadge status={view.schedule.status} />
        </h1>
        {canEdit && (
          <Link
            className="text-sm text-brand hover:underline"
            to={scheduleEditorPath(scheduleId)}
          >
            Edit
          </Link>
        )}
      </div>

      <ScheduleDocument
        hospital={view.hospital}
        wardName={view.wardName}
        month={view.schedule.month}
        year={view.schedule.year}
        staff={view.staff}
        days={view.days}
        entriesByKey={view.entriesByKey}
        shiftTypes={view.shiftTypes}
        legendAbbreviations={view.legendAbbreviations}
        signatories={view.signatories}
      />
    </AppLayout>
  );
}
