import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout/AppLayout';
import { CreateScheduleForm } from '@/components/CreateScheduleForm/CreateScheduleForm';
import { ScheduleStatusBadge } from '@/components/ScheduleStatusBadge/ScheduleStatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { SelectField } from '@/components/ui/SelectField';
import { Spinner } from '@/components/ui/Spinner';
import { SCHEDULE_STATUS } from '@/constants/scheduleStatus';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useCreateSchedule, useSchedules } from '@/hooks/useSchedules';
import { useWards } from '@/hooks/useWards';
import { isEditorRole } from '@/constants/roles';
import { scheduleEditorPath, scheduleViewPath } from '@/routes/paths';
import type { Schedule } from '@/types/schedule.types';
import { formatMonth } from '@/utils/formatMonth';

export function ScheduleListPage(): ReactNode {
  useDocumentTitle('Schedules');
  const navigate = useNavigate();
  const { role, hospitalId } = useAuth();
  const canEdit = isEditorRole(role);

  const wardsQuery = useWards();
  const wards = wardsQuery.data ?? [];
  const [wardId, setWardId] = useState<string | null>(null);
  const effectiveWardId = wardId ?? wards[0]?.id ?? null;

  const schedulesQuery = useSchedules(effectiveWardId);
  const createSchedule = useCreateSchedule();

  return (
    <AppLayout>
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Schedules</h1>

      {hospitalId === null ? (
        <EmptyState
          title="Your account isn’t linked to a hospital yet"
          description="An approver needs to add you from the Users page before you can see or build schedules."
        />
      ) : wardsQuery.isLoading ? (
        <Spinner label="Loading wards" />
      ) : wardsQuery.isError ? (
        <InlineBanner tone="error">{wardsQuery.error.message}</InlineBanner>
      ) : wards.length === 0 ? (
        <EmptyState
          title="No wards yet"
          description="Create a ward under Hospital before making a schedule."
        />
      ) : (
        <div className="flex flex-col gap-6">
          <SelectField
            label="Ward"
            value={effectiveWardId ?? ''}
            options={wards.map((ward) => ({ value: ward.id, label: ward.name }))}
            onChange={(event) => setWardId(event.target.value)}
          />

          {canEdit && (
            <section>
              {createSchedule.isError && (
                <div className="mb-3">
                  <InlineBanner tone="error">{createSchedule.error.message}</InlineBanner>
                </div>
              )}
              <CreateScheduleForm
                wards={wards}
                creating={createSchedule.isPending}
                onCreate={(input) =>
                  createSchedule.mutate(input, {
                    onSuccess: (schedule) => {
                      void navigate(scheduleEditorPath(schedule.id));
                    },
                  })
                }
              />
            </section>
          )}

          <ScheduleTable
            loading={schedulesQuery.isLoading}
            error={schedulesQuery.isError ? schedulesQuery.error.message : null}
            schedules={schedulesQuery.data ?? []}
            canEdit={canEdit}
          />
        </div>
      )}
    </AppLayout>
  );
}

interface ScheduleTableProps {
  loading: boolean;
  error: string | null;
  schedules: readonly Schedule[];
  canEdit: boolean;
}

function ScheduleTable({
  loading,
  error,
  schedules,
  canEdit,
}: ScheduleTableProps): ReactNode {
  if (loading) {
    return <Spinner label="Loading schedules" />;
  }
  if (error !== null) {
    return <InlineBanner tone="error">{error}</InlineBanner>;
  }
  if (schedules.length === 0) {
    return <EmptyState title="No schedules for this ward yet" />;
  }
  return (
    <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
      {schedules.map((schedule) => (
        <li key={schedule.id} className="flex items-center justify-between gap-4 p-4">
          <span className="flex items-center gap-3 text-sm text-gray-900">
            <span className="font-medium">
              {formatMonth(schedule.month, schedule.year)}
            </span>
            <ScheduleStatusBadge status={schedule.status} />
          </span>
          <span className="flex gap-4 text-sm">
            <Link
              className="text-brand hover:underline"
              to={scheduleViewPath(schedule.id)}
            >
              Open
            </Link>
            {canEdit && schedule.status === SCHEDULE_STATUS.DRAFT && (
              <Link
                className="text-brand hover:underline"
                to={scheduleEditorPath(schedule.id)}
              >
                Edit
              </Link>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
