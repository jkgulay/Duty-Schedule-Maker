import type { StaffRow } from '@/types/database.types';

export type Staff = StaffRow;

/** Fields a user provides when adding or editing a staff member. */
export interface StaffInput {
  fullName: string;
  credentials: string;
  active: boolean;
}
