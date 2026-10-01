import type { ScheduleEntry } from '@/types/schedule.types';
import type { ShiftDisplay, ShiftType } from '@/types/shiftType.types';

const REQUEST_SUFFIX = ' (R)';
const NOT_AVAILABLE_TEXT = 'NA';

const EMPTY_DISPLAY: ShiftDisplay = {
  text: '',
  backgroundHex: null,
  backgroundHex2: null,
  label: 'No shift assigned',
  isRequest: false,
  isNa: false,
};

/**
 * The single source of truth for turning a schedule entry into what a cell
 * shows. The on-screen grid, the legend, and the PDF template all call this —
 * no component maps a shift code to a color on its own.
 *
 * A manually typed `custom_text` always wins for the cell's label; the shift
 * code / "NA" / request marker is only a fallback for cells nobody has
 * labelled yet. `shift_type_id_2`, when set, becomes a second background for
 * a split-color (double shift) cell.
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

  const shiftType =
    entry.shift_type_id !== null ? shiftTypes.get(entry.shift_type_id) : undefined;
  const shiftType2 =
    entry.shift_type_id_2 !== null ? shiftTypes.get(entry.shift_type_id_2) : undefined;
  const backgroundHex = shiftType?.color_hex ?? null;
  const backgroundHex2 = shiftType2?.color_hex ?? null;
  const customText = entry.custom_text?.trim() ?? '';

  if (customText !== '') {
    return {
      text: customText,
      backgroundHex,
      backgroundHex2,
      label: customText,
      isRequest: entry.is_request,
      isNa: entry.is_na,
    };
  }

  if (entry.is_na) {
    return {
      text: NOT_AVAILABLE_TEXT,
      backgroundHex,
      backgroundHex2,
      label: 'Not available',
      isRequest: false,
      isNa: true,
    };
  }

  if (shiftType === undefined) {
    if (entry.is_request) {
      return {
        text: REQUEST_SUFFIX.trim(),
        backgroundHex,
        backgroundHex2,
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
    backgroundHex,
    backgroundHex2,
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
