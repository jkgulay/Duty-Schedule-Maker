/** Every route path in one place. Build detail paths with the helpers. */
export const ROUTES = {
  login: '/login',
  signUp: '/signup',
  schedules: '/schedules',
  scheduleEditor: '/schedules/:scheduleId/edit',
  scheduleView: '/schedules/:scheduleId',
  adminHospital: '/admin/hospital',
  adminStaff: '/admin/staff',
  adminShiftTypes: '/admin/shift-types',
  adminSignatories: '/admin/signatories',
  adminUsers: '/admin/users',
} as const;

export function scheduleEditorPath(scheduleId: string): string {
  return `/schedules/${scheduleId}/edit`;
}

export function scheduleViewPath(scheduleId: string): string {
  return `/schedules/${scheduleId}`;
}
