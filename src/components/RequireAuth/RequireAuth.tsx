import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { Spinner } from '@/components/ui/Spinner';
import type { Role } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/paths';

interface RequireAuthProps {
  children: ReactNode;
  /** If set, the user's role must be included to view the route. */
  allowedRoles?: readonly Role[];
}

/**
 * Route guard. This is a UX convenience only — the real access control is the
 * RLS policy on each table. A user who bypasses this still cannot read or
 * write data they are not entitled to.
 */
export function RequireAuth({ children, allowedRoles }: RequireAuthProps): ReactNode {
  const { session, role, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="p-8">
        <Spinner label="Checking your session" />
      </div>
    );
  }

  if (session === null) {
    return <Navigate to={ROUTES.login} replace state={{ from: location.pathname }} />;
  }

  if (allowedRoles !== undefined && (role === null || !allowedRoles.includes(role))) {
    return <Navigate to={ROUTES.schedules} replace />;
  }

  return children;
}
