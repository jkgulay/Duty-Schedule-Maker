import type { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@/hooks/useAuth';
import { AppRoutes } from '@/routes/AppRoutes';

export function App(): ReactNode {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
