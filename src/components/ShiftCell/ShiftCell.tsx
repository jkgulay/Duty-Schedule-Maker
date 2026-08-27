import { useMemo, type ReactNode } from 'react';

import {
  buildCellOptions,
  decodeCellValue,
  encodeCellValue,
  entryToCellState,
} from '@/utils/cellValue';
import { readableTextColor } from '@/utils/readableTextColor';
import { resolveShiftDisplay } from '@/utils/resolveShiftDisplay';
import type { CellState, ScheduleEntry } from '@/types/schedule.types';
import type { ShiftType } from '@/types/shiftType.types';

interface ShiftCellProps {
  staffName: string;
  dayOfMonth: number;
  entry: ScheduleEntry | undefined;
  shiftTypes: readonly ShiftType[];
  shiftTypesIndex: ReadonlyMap<string, ShiftType>;
  editable: boolean;
  onChange: (next: CellState) => void;
}

export function ShiftCell({
  staffName,
  dayOfMonth,
  entry,
  shiftTypes,
  shiftTypesIndex,
  editable,
  onChange,
}: ShiftCellProps): ReactNode {
  const display = resolveShiftDisplay(entry, shiftTypesIndex);
  const background = display.backgroundHex ?? 'transparent';
  const color =
    display.backgroundHex !== null ? readableTextColor(display.backgroundHex) : 'inherit';

  const options = useMemo(() => buildCellOptions(shiftTypes), [shiftTypes]);
  const label = `${staffName}, day ${dayOfMonth}: ${display.label}`;

  if (!editable) {
    return (
      <td
        className="border border-gray-300 px-1 text-center text-xs"
        style={{ backgroundColor: background, color }}
      >
        <span aria-label={label}>{display.text}</span>
      </td>
    );
  }

  return (
    <td className="border border-gray-300 p-0" style={{ backgroundColor: background }}>
      <select
        aria-label={label}
        value={encodeCellValue(entryToCellState(entry))}
        onChange={(event) => onChange(decodeCellValue(event.target.value))}
        className="w-full cursor-pointer appearance-none bg-transparent px-1 py-1 text-center text-xs focus:outline focus:outline-2 focus:outline-brand"
        style={{ color }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            className="bg-white text-gray-900"
          >
            {option.label}
          </option>
        ))}
      </select>
    </td>
  );
}
