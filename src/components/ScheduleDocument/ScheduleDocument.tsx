import type { CSSProperties, ReactNode } from 'react';

import { ScheduleGrid } from '@/components/ScheduleGrid/ScheduleGrid';
import { ScheduleHeader } from '@/components/ScheduleHeader/ScheduleHeader';
import { ScheduleTitle } from '@/components/ScheduleTitle/ScheduleTitle';
import { ShiftLegend } from '@/components/ShiftLegend/ShiftLegend';
import { SignatoryBlock } from '@/components/SignatoryBlock/SignatoryBlock';
import type { Hospital } from '@/types/hospital.types';
import type { ScheduleEntry } from '@/types/schedule.types';
import type { LegendAbbreviation, ShiftType } from '@/types/shiftType.types';
import type { ResolvedSignatory } from '@/types/signatory.types';
import type { Staff } from '@/types/staff.types';
import { formatPeriod } from '@/utils/formatPeriod';
import { computePrintRowMetrics } from '@/utils/printRowMetrics';

export interface ScheduleDocumentProps {
  hospital: Hospital;
  wardName: string;
  month: number;
  year: number;
  period: 1 | 2;
  staff: readonly Staff[];
  days: readonly Date[];
  entriesByKey: ReadonlyMap<string, ScheduleEntry>;
  shiftTypes: readonly ShiftType[];
  legendAbbreviations: readonly LegendAbbreviation[];
  signatories: readonly ResolvedSignatory[];
}

/**
 * The full printable schedule layout. This is the single source of truth for
 * how a schedule looks; the `generate-schedule-pdf` Edge Function mirrors this
 * markup so the PDF and the on-screen view stay in sync.
 */
export function ScheduleDocument({
  hospital,
  wardName,
  month,
  year,
  period,
  staff,
  days,
  entriesByKey,
  shiftTypes,
  legendAbbreviations,
  signatories,
}: ScheduleDocumentProps): ReactNode {
  const { rowHeightIn, fontPx, nameFontPx } = computePrintRowMetrics(
    staff.length,
    shiftTypes.length,
    legendAbbreviations.length,
  );
  const printVars = {
    '--print-row-height': `${rowHeightIn}in`,
    '--print-cell-font': `${fontPx}px`,
    '--print-name-font': `${nameFontPx}px`,
  } as CSSProperties;

  return (
    <article
      className="schedule-document mx-auto max-w-[1100px] border border-gray-300 bg-white p-6 text-gray-900 print:max-w-none print:border-0 print:p-0"
      style={printVars}
    >
      <ScheduleHeader hospital={hospital} />
      <ScheduleTitle monthLabel={formatPeriod(month, year, period)} wardName={wardName} />

      <div className="mt-2">
        <ScheduleGrid
          staff={staff}
          days={days}
          entriesByKey={entriesByKey}
          shiftTypes={shiftTypes}
          editable={false}
        />
      </div>

      <div className="mt-6 flex flex-wrap justify-between gap-8 break-inside-avoid print:mt-3">
        <ShiftLegend shiftTypes={shiftTypes} abbreviations={legendAbbreviations} />
        <SignatoryBlock signatories={signatories} />
      </div>
    </article>
  );
}
