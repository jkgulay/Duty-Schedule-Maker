import type { CellState, ScheduleEntry } from '@/types/schedule.types';
import type { ShiftType } from '@/types/shiftType.types';

/**
 * Serialisation between a grid cell's `<select>` value and its `CellState`.
 *
 * Value grammar:
 *   ''            -> empty
 *   'NA'          -> not available
 *   '<shiftId>'   -> that shift
 *   '<shiftId>:R' -> that shift, flagged as a request
 */
const NOT_AVAILABLE_VALUE = 'NA';
const REQUEST_MARKER = ':R';

export const EMPTY_CELL: CellState = {
  shiftTypeId: null,
  isRequest: false,
  isNa: false,
};

export function isEmptyCell(state: CellState): boolean {
  return state.shiftTypeId === null && !state.isRequest && !state.isNa;
}

export function entryToCellState(entry: ScheduleEntry | undefined): CellState {
  if (entry === undefined) {
    return EMPTY_CELL;
  }
  return {
    shiftTypeId: entry.shift_type_id,
    isRequest: entry.is_request,
    isNa: entry.is_na,
  };
}

export function encodeCellValue(state: CellState): string {
  if (state.isNa) {
    return NOT_AVAILABLE_VALUE;
  }
  if (state.shiftTypeId === null) {
    return '';
  }
  return state.isRequest ? `${state.shiftTypeId}${REQUEST_MARKER}` : state.shiftTypeId;
}

export interface CellValueOption {
  value: string;
  label: string;
}

/**
 * The option list for a cell `<select>` and the bulk-assign control:
 * clear, then each shift and its "(R)" request variant, then "NA".
 */
export function buildCellOptions(shiftTypes: readonly ShiftType[]): CellValueOption[] {
  const options: CellValueOption[] = [{ value: '', label: '—' }];
  for (const shiftType of shiftTypes) {
    options.push({ value: shiftType.id, label: shiftType.code });
    options.push({
      value: `${shiftType.id}${REQUEST_MARKER}`,
      label: `${shiftType.code} (R)`,
    });
  }
  options.push({ value: NOT_AVAILABLE_VALUE, label: NOT_AVAILABLE_VALUE });
  return options;
}

export function decodeCellValue(value: string): CellState {
  if (value === '') {
    return EMPTY_CELL;
  }
  if (value === NOT_AVAILABLE_VALUE) {
    return { shiftTypeId: null, isRequest: false, isNa: true };
  }
  if (value.endsWith(REQUEST_MARKER)) {
    return {
      shiftTypeId: value.slice(0, -REQUEST_MARKER.length),
      isRequest: true,
      isNa: false,
    };
  }
  return { shiftTypeId: value, isRequest: false, isNa: false };
}
