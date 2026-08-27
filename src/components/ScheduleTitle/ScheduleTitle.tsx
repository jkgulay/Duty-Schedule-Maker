import type { ReactNode } from 'react';

import { DOCUMENT_TITLE } from '@/constants/pdf';

interface ScheduleTitleProps {
  monthLabel: string;
  wardName: string;
}

/**
 * The three centred title lines: black document name, red month + year,
 * blue ward name.
 */
export function ScheduleTitle({ monthLabel, wardName }: ScheduleTitleProps): ReactNode {
  return (
    <div className="py-2 text-center font-bold">
      <p className="text-gray-900">{DOCUMENT_TITLE}</p>
      <p className="text-title-month">{monthLabel}</p>
      <p className="text-title-ward uppercase">{wardName}</p>
    </div>
  );
}
