/** Application roles, stored in `profiles.role` and enforced by RLS. */
export const ROLE = {
  SCHEDULER: 'scheduler',
  APPROVER: 'approver',
  VIEWER: 'viewer',
} as const;

export type Role = (typeof ROLE)[keyof typeof ROLE];

/** Roles permitted to create/edit setup data and draft schedules. */
export const EDITOR_ROLES: readonly Role[] = [ROLE.SCHEDULER, ROLE.APPROVER];

export function isEditorRole(role: Role | null | undefined): boolean {
  return role != null && EDITOR_ROLES.includes(role);
}
