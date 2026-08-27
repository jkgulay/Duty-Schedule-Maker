import type { SignatoryRole } from '@/constants/signatoryRoles';
import type { ScheduleSignatoryRow, SignatoryRow } from '@/types/database.types';

export type Signatory = SignatoryRow;
export type ScheduleSignatory = ScheduleSignatoryRow;

/** Fields a user provides for a hospital-default signatory. */
export interface SignatoryInput {
  fullName: string;
  title: string;
  defaultRole: SignatoryRole;
}

/** A resolved signatory slot for a specific schedule (default or override). */
export interface ResolvedSignatory {
  role: SignatoryRole;
  fullName: string;
  title: string;
}
