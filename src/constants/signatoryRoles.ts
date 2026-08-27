/** The three signatory slots on the document, in display order. */
export const SIGNATORY_ROLE = {
  PREPARED_BY: 'prepared_by',
  NOTED_BY: 'noted_by',
  APPROVED_BY: 'approved_by',
} as const;

export type SignatoryRole = (typeof SIGNATORY_ROLE)[keyof typeof SIGNATORY_ROLE];

export const SIGNATORY_ROLE_ORDER: readonly SignatoryRole[] = [
  SIGNATORY_ROLE.PREPARED_BY,
  SIGNATORY_ROLE.NOTED_BY,
  SIGNATORY_ROLE.APPROVED_BY,
];

export const SIGNATORY_ROLE_LABEL: Record<SignatoryRole, string> = {
  [SIGNATORY_ROLE.PREPARED_BY]: 'Prepared by',
  [SIGNATORY_ROLE.NOTED_BY]: 'Noted by',
  [SIGNATORY_ROLE.APPROVED_BY]: 'Approved by',
};
