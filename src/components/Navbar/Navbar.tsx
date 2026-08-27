import { useState, type ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { isEditorRole } from '@/constants/roles';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/routes/paths';

interface NavItem {
  to: string;
  label: string;
  editorOnly: boolean;
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: ROUTES.schedules, label: 'Schedules', editorOnly: false },
  { to: ROUTES.adminHospital, label: 'Hospital', editorOnly: true },
  { to: ROUTES.adminStaff, label: 'Staff', editorOnly: true },
  { to: ROUTES.adminShiftTypes, label: 'Shift types', editorOnly: true },
  { to: ROUTES.adminSignatories, label: 'Signatories', editorOnly: true },
];

function linkClass({ isActive }: { isActive: boolean }): string {
  return isActive ? 'text-brand-dark font-semibold' : 'text-gray-600 hover:text-gray-900';
}

export function Navbar(): ReactNode {
  const { role, signOut } = useAuth();
  const navigate = useNavigate();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const visibleItems = NAV_ITEMS.filter((item) => !item.editorOnly || isEditorRole(role));

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
    <header className="border-b border-gray-200 bg-white">
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
