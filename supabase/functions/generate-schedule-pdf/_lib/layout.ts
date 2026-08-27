/**
 * Pure data-shaping helpers for the schedule layout. Each function mirrors its
 * namesake under `src/utils/` or `src/constants/`. Keep the two copies in sync;
 * when you change a rule on the on-screen view, change it here in the same
 * commit (see CLAUDE.md "one source of truth").
 */
import type {
  ResolvedSignatory,
  ScheduleEntryRow,
  ScheduleSignatoryRow,
  ShiftDisplay,
  ShiftTypeRow,
  SignatoryRole,
  SignatoryRow,
} from './domain.ts';

// --- src/constants/pdf.ts ---------------------------------------------------
export const DOCUMENT_TITLE = 'Nursing Service Duty Schedule';

// --- src/constants/months.ts ---------------------------------------------------
const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const;

// --- src/utils/formatMonth.ts ------------------------------------------------
export function formatMonth(month: number, year: number): string {
  const name = MONTH_LABELS[month - 1];
  if (name === undefined) {
    throw new Error(`Month out of range (expected 1-12): ${month}`);
  }
  return `${name.toUpperCase()} ${year}`;
}

// --- src/utils/getMonthDays.ts ---------------------------------------------------
export function getMonthDays(month: number, year: number): Date[] {
  if (month < 1 || month > 12) {
    throw new Error(`Month out of range (expected 1-12): ${month}`);
  }
  const dayCount = new Date(year, month, 0).getDate();
  const days: Date[] = [];
  for (let day = 1; day <= dayCount; day += 1) {
    days.push(new Date(year, month - 1, day));
  }
  return days;
}

// --- src/utils/getWeekdayLabel.ts ---------------------------------------------
const WEEKDAY_ABBREVIATIONS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

export function getWeekdayLabel(date: Date): string {
  return WEEKDAY_ABBREVIATIONS[date.getDay()] ?? '';
}

// --- src/utils/isWeekend.ts ----------------------------------------------------
export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

// --- src/utils/readableTextColor.ts -----------------------------------------
const DARK_TEXT = '#1f2937';
const LIGHT_TEXT = '#ffffff';

export function readableTextColor(backgroundHex: string): string {
  const hex = backgroundHex.replace('#', '');
  if (hex.length !== 6) {
    return DARK_TEXT;
  }
  const channels = [0, 2, 4].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  const [r, g, b] = channels as [number, number, number];
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 0.179 ? DARK_TEXT : LIGHT_TEXT;
}

// --- src/utils/entryKey.ts ---------------------------------------------------
export function entryKey(staffId: string, dayOfMonth: number): string {
  return `${staffId}:${dayOfMonth}`;
}

export function indexEntries(
  entries: readonly ScheduleEntryRow[],
): Map<string, ScheduleEntryRow> {
  return new Map(
    entries.map((entry) => [entryKey(entry.staff_id, entry.day_of_month), entry]),
  );
}

// --- src/utils/resolveShiftDisplay.ts -------------------------------------------
const REQUEST_SUFFIX = ' (R)';
const NOT_AVAILABLE_TEXT = 'NA';
const EMPTY_DISPLAY: ShiftDisplay = {
  text: '',
  backgroundHex: null,
  label: 'No shift assigned',
  isRequest: false,
  isNa: false,
};

export function indexShiftTypes(
  shiftTypes: readonly ShiftTypeRow[],
): Map<string, ShiftTypeRow> {
  return new Map(shiftTypes.map((shiftType) => [shiftType.id, shiftType]));
}

export function resolveShiftDisplay(
  entry: ScheduleEntryRow | undefined,
  shiftTypes: Map<string, ShiftTypeRow>,
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

  return {
    text: entry.is_request ? `${shiftType.code}${REQUEST_SUFFIX}` : shiftType.code,
    backgroundHex: shiftType.color_hex,
    label: entry.is_request ? `${shiftType.label} (Request)` : shiftType.label,
    isRequest: entry.is_request,
    isNa: false,
  };
}

// --- src/constants/signatoryRoles.ts + src/utils/resolveSignatories.ts ------
export const SIGNATORY_ROLE_ORDER: readonly SignatoryRole[] = [
  'prepared_by',
  'noted_by',
  'approved_by',
];

export const SIGNATORY_ROLE_LABEL: Record<SignatoryRole, string> = {
  prepared_by: 'Prepared by',
  noted_by: 'Noted by',
  approved_by: 'Approved by',
};

export function resolveSignatories(
  hospitalDefaults: readonly SignatoryRow[],
  scheduleOverrides: readonly ScheduleSignatoryRow[],
): ResolvedSignatory[] {
  return SIGNATORY_ROLE_ORDER.map((role) => {
    const override = scheduleOverrides.find((entry) => entry.role === role);
    const source =
      override !== undefined
        ? hospitalDefaults.find((signatory) => signatory.id === override.signatory_id)
        : hospitalDefaults.find((signatory) => signatory.default_role === role);
    return {
      role,
      fullName: source?.full_name ?? '',
      title: source?.title ?? '',
    };
  });
}
