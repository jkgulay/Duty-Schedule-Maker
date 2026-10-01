import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';

import { AppLayout } from '@/components/AppLayout/AppLayout';
import { ScheduleGrid } from '@/components/ScheduleGrid/ScheduleGrid';
import { ScheduleGridToolbar } from '@/components/ScheduleGridToolbar/ScheduleGridToolbar';
import { ScheduleStatusBadge } from '@/components/ScheduleStatusBadge/ScheduleStatusBadge';
import { EmptyState } from '@/components/ui/EmptyState';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { Spinner } from '@/components/ui/Spinner';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { useScheduleEditor } from '@/hooks/useScheduleEditor';
import { scheduleViewPath } from '@/routes/paths';
import { formatPeriod } from '@/utils/formatPeriod';

export function ScheduleEditorPage(): ReactNode {
  const { scheduleId } = useParams<{ scheduleId: string }>();
  return scheduleId === undefined ? (
    <AppLayout>
      <EmptyState title="No schedule specified" />
    </AppLayout>
  ) : (
    <ScheduleEditor scheduleId={scheduleId} />
  );
}

function ScheduleEditor({ scheduleId }: { scheduleId: string }): ReactNode {
  const editor = useScheduleEditor(scheduleId);
  const title =
    editor.schedule === undefined
      ? 'Edit schedule'
      : formatPeriod(editor.schedule.month, editor.schedule.year, editor.schedule.period);
  useDocumentTitle(`Edit ${title}`);

  if (editor.isLoading) {
    return (
      <AppLayout>
        <Spinner label="Loading schedule" />
      </AppLayout>
    );
  }

  if (editor.loadError !== null || editor.schedule === undefined) {
    return (
      <AppLayout>
        <InlineBanner tone="error">
          {editor.loadError ?? 'Schedule not found'}
        </InlineBanner>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="flex items-center gap-3 text-2xl font-semibold text-gray-900">
          {title}
          <ScheduleStatusBadge status={editor.schedule.status} />
        </h1>
        <Link
          className="text-sm text-brand hover:underline"
          to={scheduleViewPath(scheduleId)}
        >
          Read-only view
        </Link>
      </div>

      {!editor.editable && (
        <div className="mb-4">
          <InlineBanner tone="info">
            This schedule is locked because it is no longer a draft. Changes are disabled.
          </InlineBanner>
        </div>
      )}

      {editor.saveError !== null && (
        <div className="mb-4">
          <InlineBanner tone="error">{editor.saveError}</InlineBanner>
        </div>
      )}

      {editor.staff.length === 0 ? (
        <EmptyState
          title="No active staff"
          description="Add staff under the Staff page before assigning shifts."
        />
      ) : (
        <div className="flex flex-col gap-4">
          {editor.editable && (
            <ScheduleGridToolbar
              staff={editor.staff}
              shiftTypes={editor.shiftTypes}
              daysInMonth={editor.days.length}
              applying={editor.isSaving}
              onApply={editor.bulkAssign}
            />
          )}
          <div className="flex items-center gap-2 text-xs text-gray-500">
            {editor.isSaving ? (
              <Spinner label="Saving…" />
            ) : (
              <span>All changes saved</span>
            )}
          </div>
          <ScheduleGrid
            staff={editor.staff}
            days={editor.days}
            entriesByKey={editor.entriesByKey}
            shiftTypes={editor.shiftTypes}
            editable={editor.editable}
            onCellChange={editor.changeCell}
          />
        </div>
      )}
    </AppLayout>
  );
}
