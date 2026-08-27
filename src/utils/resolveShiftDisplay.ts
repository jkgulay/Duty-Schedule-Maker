import type { ScheduleEntry } from '@/types/schedule.types';
import type { ShiftDisplay, ShiftType } from '@/types/shiftType.types';

const REQUEST_SUFFIX = ' (R)';
const NOT_AVAILABLE_TEXT = 'NA';

const EMPTY_DISPLAY: ShiftDisplay = {
  text: '',
  backgroundHex: null,
  label: 'No shift assigned',
  isRequest: false,
  isNa: false,
};

/**
 * The single source of truth for turning a schedule entry into what a cell
 * shows. The on-screen grid, the legend, and the PDF template all call this —
 * no component maps a shift code to a color on its own.
 *
 * @param entry       the entry for this staff member + day, if any
 * @param shiftTypes  lookup of the hospital's shift types by id
 */
export function resolveShiftDisplay(
  entry: ScheduleEntry | undefined,
  shiftTypes: ReadonlyMap<string, ShiftType>,
): ShiftDisplay {
  if (entry === undefined) {
    return EMPTY_DISPLAY;
  }

  if (entry.is_na) {
    return {
      text: NOT_AVAILABLE_TEXT,
      backgroundHex: null,
      label: 'Not available',
      isRequest: false,
      isNa: true,
    };
  }

  const shiftType =
    entry.shift_type_id !== null ? shiftTypes.get(entry.shift_type_id) : undefined;

  if (shiftType === undefined) {
    if (entry.is_request) {
      return {
        text: REQUEST_SUFFIX.trim(),
        backgroundHex: null,
        label: 'Request',
        isRequest: true,
        isNa: false,
      };
    }
    return EMPTY_DISPLAY;
  }

  const text = entry.is_request ? `${shiftType.code}${REQUEST_SUFFIX}` : shiftType.code;
  const label = entry.is_request ? `${shiftType.label} (Request)` : shiftType.label;

  return {
    text,
    backgroundHex: shiftType.color_hex,
    label,
    isRequest: entry.is_request,
    isNa: false,
  };
}

/** Builds the id -> ShiftType lookup `resolveShiftDisplay` expects. */
export function indexShiftTypes(
  shiftTypes: readonly ShiftType[],
): ReadonlyMap<string, ShiftType> {
  return new Map(shiftTypes.map((shiftType) => [shiftType.id, shiftType]));
}
