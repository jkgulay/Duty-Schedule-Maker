import { useMemo, type CSSProperties, type ReactNode } from 'react';

import { buildShiftColorOptions, entryToCellState } from '@/utils/cellValue';
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

/** Background for the cell: solid, or split straight down the middle when a second shift (double shift) is set. */
function cellBackground(hex1: string | null, hex2: string | null): string {
  if (hex1 !== null && hex2 !== null) {
    return `linear-gradient(to right, ${hex1} 50%, ${hex2} 50%)`;
  }
  return hex1 ?? hex2 ?? 'transparent';
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
  const background = cellBackground(display.backgroundHex, display.backgroundHex2);
  const color =
    display.backgroundHex !== null ? readableTextColor(display.backgroundHex) : 'inherit';

  const colorOptions = useMemo(() => buildShiftColorOptions(shiftTypes), [shiftTypes]);
  const label = `${staffName}, day ${dayOfMonth}: ${display.label}`;

  if (!editable) {
    return (
      <td
        className="border border-gray-300 px-1 text-center text-sm font-bold leading-tight print:px-0.5 print:text-[length:var(--print-cell-font,9.5px)]"
        style={{ background, color }}
      >
        <span aria-label={label}>{display.text}</span>
      </td>
    );
  }

  const state = entryToCellState(entry);
  const style: CSSProperties = { background };

  return (
    <td className="border border-gray-300 p-0.5" style={style}>
      <div className="flex flex-col gap-0.5">
        <input
          type="text"
          aria-label={label}
          value={state.customText ?? ''}
          onChange={(event) =>
            onChange({ ...state, customText: event.target.value === '' ? null : event.target.value })
          }
          className="w-full rounded-sm bg-white/80 px-1 py-0.5 text-center text-sm font-bold focus:outline focus:outline-2 focus:outline-brand"
          style={{ color: 'inherit' }}
        />
        <div className="flex gap-0.5">
          <select
            aria-label={`${staffName}, day ${dayOfMonth}: first shift color`}
            value={state.shiftTypeId ?? ''}
            onChange={(event) =>
              onChange({ ...state, shiftTypeId: event.target.value === '' ? null : event.target.value })
            }
            className="w-1/2 cursor-pointer appearance-none bg-white/80 text-center text-[10px]"
            style={{ color }}
          >
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-white text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
          <select
            aria-label={`${staffName}, day ${dayOfMonth}: second shift color (double shift)`}
            value={state.shiftTypeId2 ?? ''}
            onChange={(event) =>
              onChange({ ...state, shiftTypeId2: event.target.value === '' ? null : event.target.value })
            }
            className="w-1/2 cursor-pointer appearance-none bg-white/80 text-center text-[10px]"
            style={{ color }}
          >
            {colorOptions.map((option) => (
              <option key={option.value} value={option.value} className="bg-white text-gray-900">
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </td>
  );
}
