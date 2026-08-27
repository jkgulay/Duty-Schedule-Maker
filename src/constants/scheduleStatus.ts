/** Lifecycle of a schedule. Transitions are enforced by a Postgres trigger. */
export const SCHEDULE_STATUS = {
  DRAFT: 'draft',
  NOTED: 'noted',
  APPROVED: 'approved',
} as const;

export type ScheduleStatus = (typeof SCHEDULE_STATUS)[keyof typeof SCHEDULE_STATUS];

/** Human-readable labels for the status badge. */
export const SCHEDULE_STATUS_LABEL: Record<ScheduleStatus, string> = {
  [SCHEDULE_STATUS.DRAFT]: 'Draft',
  [SCHEDULE_STATUS.NOTED]: 'Noted',
  [SCHEDULE_STATUS.APPROVED]: 'Approved',
};

/** A schedule is editable (entries/signatories can change) only while draft. */
export function isEditableStatus(status: ScheduleStatus): boolean {
  return status === SCHEDULE_STATUS.DRAFT;
}
