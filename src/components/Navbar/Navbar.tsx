import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { isEditorRole, ROLE, type Role } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/paths';

type Visibility = 'all' | 'editor' | 'approver';

interface NavItem {
  to: string;
  label: string;
  visibleFor: Visibility;
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: ROUTES.schedules, label: 'Schedules', visibleFor: 'all' },
  { to: ROUTES.adminHospital, label: 'Hospital', visibleFor: 'editor' },
  { to: ROUTES.adminStaff, label: 'Staff', visibleFor: 'editor' },
  { to: ROUTES.adminShiftTypes, label: 'Shift types', visibleFor: 'editor' },
  { to: ROUTES.adminSignatories, label: 'Signatories', visibleFor: 'editor' },
  { to: ROUTES.adminUsers, label: 'Users', visibleFor: 'approver' },
];

function canSee(visibleFor: Visibility, role: Role | null): boolean {
  if (visibleFor === 'all') {
    return true;
  }
  if (visibleFor === 'approver') {
    return role === ROLE.APPROVER;
  }
  return isEditorRole(role);
}

function linkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'text-brand-dark font-semibold' : 'text-gray-600 hover:text-gray-900';
}

export function Navbar(): ReactNode {
  const { role, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => canSee(item.visibleFor, role));

  async function handleSignOut(): Promise<void> {
    setIsSigningOut(true);
    try {
      await signOut();
      void navigate(ROUTES.login, { replace: true });
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="border-b border-gray-200 bg-white print:hidden">
      <nav className="mx-auto flex max-w-6xl items-center gap-6 px-6 py-3 text-sm">
        <span className="font-semibold text-gray-900">Duty Schedules</span>
        {visibleItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={linkClass}>
            {item.label}
          </NavLink>
        ))}
        <Button
          variant="secondary"
          className="ml-auto"
          disabled={isSigningOut}
          onClick={() => {
            void handleSignOut();
          }}
        >
          {isSigningOut ? 'Signing out…' : 'Sign out'}
        </Button>
      </nav>
    </header>
  );
}
