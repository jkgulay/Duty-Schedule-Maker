import type { HospitalRow, WardRow } from '@/types/database.types';

export type Hospital = HospitalRow;
export type Ward = WardRow;

/** Fields a user may edit on the hospital identity block. */
export interface HospitalIdentityInput {
  name: string;
  province: string;
  logoLeftUrl: string | null;
  logoRightUrl: string | null;
}

/** Which logo slot on the document header a file is for. */
export type LogoSide = 'left' | 'right';
