import { lazy, Suspense, type ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { RequireAuth } from '@/components/RequireAuth/RequireAuth';
import { Spinner } from '@/components/ui/Spinner';
import { ROLE } from '@/constants/roles';
import { LoginPage } from '@/pages/LoginPage';
import { ScheduleEditorPage } from '@/pages/ScheduleEditorPage';
import { ScheduleListPage } from '@/pages/ScheduleListPage';
import { ScheduleViewPage } from '@/pages/ScheduleViewPage';
import { SignUpPage } from '@/pages/SignUpPage';
import { ROUTES } from '@/routes/paths';

// Admin screens are not needed on first paint — load them on demand.
const HospitalPage = lazy(() =>
  import('@/pages/admin/HospitalPage').then((m) => ({ default: m.HospitalPage })),
);
const StaffPage = lazy(() =>
  import('@/pages/admin/StaffPage').then((m) => ({ default: m.StaffPage })),
);
const ShiftTypesPage = lazy(() =>
  import('@/pages/admin/ShiftTypesPage').then((m) => ({ default: m.ShiftTypesPage })),
);
const SignatoriesPage = lazy(() =>
  import('@/pages/admin/SignatoriesPage').then((m) => ({ default: m.SignatoriesPage })),
);
const UsersPage = lazy(() =>
  import('@/pages/admin/UsersPage').then((m) => ({ default: m.UsersPage })),
);

const ADMIN_ROLES = [ROLE.SCHEDULER, ROLE.APPROVER] as const;
const APPROVER_ONLY = [ROLE.APPROVER] as const;

export function AppRoutes(): ReactNode {
  return (
    <Suspense
      fallback={
        <div className="p-8">
          <Spinner label="Loading page" />
        </div>
      }
    >
      <Routes>
        <Route path={ROUTES.login} element={<LoginPage />} />
        <Route path={ROUTES.signUp} element={<SignUpPage />} />

        <Route
          path={ROUTES.schedules}
          element={
            <RequireAuth>
              <ScheduleListPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.scheduleView}
          element={
            <RequireAuth>
              <ScheduleViewPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.scheduleEditor}
          element={
            <RequireAuth allowedRoles={ADMIN_ROLES}>
              <ScheduleEditorPage />
            </RequireAuth>
          }
        />

        <Route
          path={ROUTES.adminHospital}
          element={
            <RequireAuth allowedRoles={ADMIN_ROLES}>
              <HospitalPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.adminStaff}
          element={
            <RequireAuth allowedRoles={ADMIN_ROLES}>
              <StaffPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.adminShiftTypes}
          element={
            <RequireAuth allowedRoles={ADMIN_ROLES}>
              <ShiftTypesPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.adminSignatories}
          element={
            <RequireAuth allowedRoles={ADMIN_ROLES}>
              <SignatoriesPage />
            </RequireAuth>
          }
        />
        <Route
          path={ROUTES.adminUsers}
          element={
            <RequireAuth allowedRoles={APPROVER_ONLY}>
              <UsersPage />
            </RequireAuth>
          }
        />

        <Route path="/" element={<Navigate to={ROUTES.schedules} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.schedules} replace />} />
      </Routes>
    </Suspense>
  );
}
