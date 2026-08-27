import { useMemo, type ReactNode } from 'react';

import { ShiftCell } from '@/components/ShiftCell/ShiftCell';
import { entryKey } from '@/utils/entryKey';
import { getWeekdayLabel } from '@/utils/getWeekdayLabel';
import { indexShiftTypes } from '@/utils/resolveShiftDisplay';
import { isWeekend } from '@/utils/isWeekend';
import type { CellState, ScheduleEntry } from '@/types/schedule.types';
import type { ShiftType } from '@/types/shiftType.types';
import type { Staff } from '@/types/staff.types';

interface ScheduleGridProps {
  staff: readonly Staff[];
  days: readonly Date[];
  entriesByKey: ReadonlyMap<string, ScheduleEntry>;
  shiftTypes: readonly ShiftType[];
  editable: boolean;
  /** Required when `editable` is true; ignored for the read-only view. */
  onCellChange?: (staffId: string, dayOfMonth: number, next: CellState) => void;
}

const NO_OP: (staffId: string, dayOfMonth: number, next: CellState) => void = () => {};

const NAME_COL = 'w-64 print:w-[1.9in]';

export function ScheduleGrid({
  staff,
  days,
  entriesByKey,
  shiftTypes,
  editable,
  onCellChange = NO_OP,
}: ScheduleGridProps): ReactNode {
  const shiftTypesIndex = useMemo(() => indexShiftTypes(shiftTypes), [shiftTypes]);

  return (
    <div className="overflow-x-auto border border-gray-300 print:overflow-visible print:border-0">
      <table className="w-full border-collapse text-xs print:table-fixed">
        <colgroup>
          <col className={NAME_COL} />
          {days.map((day) => (
            <col key={day.getDate()} />
          ))}
        </colgroup>
        {/* The day-header row repeats on every printed page (native <thead>). */}
        <thead>
          <tr>
            <th
              scope="col"
              className={`sticky left-0 z-10 border border-gray-300 bg-gray-100 px-2 py-1 text-center print:static ${NAME_COL}`}
            >
              Name of Staff
            </th>
            {days.map((day) => {
              const weekend = isWeekend(day);
              return (
                <th
                  key={day.getDate()}
                  scope="col"
                  className={`border border-gray-300 bg-gray-100 px-1 py-1 text-center ${
                    weekend ? 'text-red-600' : 'text-gray-700'
                  }`}
                >
                  <div className="font-semibold">{day.getDate()}</div>
                  <div className="font-normal">{getWeekdayLabel(day)}</div>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {staff.map((member) => (
            <tr key={member.id} className="break-inside-avoid">
              <th
                scope="row"
                className={`sticky left-0 z-10 border border-gray-300 bg-white px-2 py-1 text-center font-medium print:static ${NAME_COL}`}
              >
                {member.full_name}
                {member.credentials !== '' && `, ${member.credentials}`}
              </th>
              {days.map((day) => {
                const dayOfMonth = day.getDate();
                return (
                  <ShiftCell
                    key={dayOfMonth}
                    staffName={member.full_name}
                    dayOfMonth={dayOfMonth}
                    entry={entriesByKey.get(entryKey(member.id, dayOfMonth))}
                    shiftTypes={shiftTypes}
                    shiftTypesIndex={shiftTypesIndex}
                    editable={editable}
                    onChange={(next) => onCellChange(member.id, dayOfMonth, next)}
                  />
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
