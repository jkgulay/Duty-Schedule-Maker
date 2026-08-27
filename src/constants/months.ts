/** Title-case month names, index 0 = January. Single source for month labels. */
export const MONTH_LABELS: readonly string[] = [
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
];

export interface MonthOption {
  value: number;
  label: string;
}

/** 1-based month options for a `<select>`. */
export const MONTH_OPTIONS: readonly MonthOption[] = MONTH_LABELS.map((label, index) => ({
  value: index + 1,
  label,
}));
