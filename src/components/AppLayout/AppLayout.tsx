import type { ReactNode } from 'react';

import { Navbar } from '@/components/Navbar/Navbar';

interface AppLayoutProps {
  children: ReactNode;
}

/** Chrome shared by every authenticated page: nav bar + a centered content column. */
export function AppLayout({ children }: AppLayoutProps): ReactNode {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-8">{children}</div>
    </div>
  );
}
