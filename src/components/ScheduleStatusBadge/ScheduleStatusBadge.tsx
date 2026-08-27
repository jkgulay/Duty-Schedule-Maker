import type { ReactNode } from 'react';

import {
  SCHEDULE_STATUS,
  SCHEDULE_STATUS_LABEL,
  type ScheduleStatus,
} from '@/constants/scheduleStatus';

const TONE_CLASS: Record<ScheduleStatus, string> = {
  [SCHEDULE_STATUS.DRAFT]: 'bg-gray-100 text-gray-700',
  [SCHEDULE_STATUS.NOTED]: 'bg-amber-100 text-amber-800',
  [SCHEDULE_STATUS.APPROVED]: 'bg-green-100 text-green-800',
};

export function ScheduleStatusBadge({ status }: { status: ScheduleStatus }): ReactNode {
  return (
    <span
      className={`inline-block rounded px-2 py-0.5 text-xs font-medium ${TONE_CLASS[status]}`}
    >
      {SCHEDULE_STATUS_LABEL[status]}
    </span>
  );
}
