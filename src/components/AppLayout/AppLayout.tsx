import type { ReactNode } from 'react';

import { Navbar } from '@/components/Navbar/Navbar';

interface AppLayoutProps {
  children: ReactNode;
}

/** Chrome shared by every authenticated page: nav bar + a centered content column. */
export function AppLayout({ children }: AppLayoutProps): ReactNode {
  return (
    <div className="min-h-screen bg-gray-50 print:min-h-0 print:bg-white">
      <Navbar />
      <div className="mx-auto max-w-6xl px-6 py-8 print:mx-0 print:max-w-none print:p-0">
        {children}
      </div>
    </div>
  );
}
