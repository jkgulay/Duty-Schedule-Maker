/** Centralised React Query cache keys so invalidation stays consistent. */
export const queryKeys = {
  hospital: ['hospital'] as const,
  wards: ['wards'] as const,
  staff: (includeInactive: boolean) => ['staff', { includeInactive }] as const,
  shiftTypes: ['shiftTypes'] as const,
  legendAbbreviations: ['legendAbbreviations'] as const,
  signatories: ['signatories'] as const,
  hospitalMembers: ['hospitalMembers'] as const,
  schedules: (wardId: string) => ['schedules', wardId] as const,
  schedule: (scheduleId: string) => ['schedule', scheduleId] as const,
  scheduleEntries: (scheduleId: string) => ['scheduleEntries', scheduleId] as const,
  scheduleSignatories: (scheduleId: string) =>
    ['scheduleSignatories', scheduleId] as const,
};
