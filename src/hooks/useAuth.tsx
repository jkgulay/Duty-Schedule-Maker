/* eslint-disable react-refresh/only-export-components --
   The provider and its `useAuth` hook are colocated by convention; this file
   is not a hot-reload boundary concern in practice. */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';

import {
  fetchMyProfile,
  getSession,
  onAuthStateChange,
  signInWithPassword,
  signOut as signOutRequest,
} from '@/api/authApi';
import type { Role } from '@/constants/roles';
import type { ProfileRow } from '@/types/database.types';

interface AuthContextValue {
  session: Session | null;
  profile: ProfileRow | null;
  role: Role | null;
  hospitalId: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }): ReactNode {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<ProfileRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadProfile = useCallback(async (nextSession: Session | null): Promise<void> => {
    setSession(nextSession);
    if (nextSession === null) {
      setProfile(null);
      return;
    }
    // Re-derive role/hospital from the database, never from cached state.
    const nextProfile = await fetchMyProfile();
    setProfile(nextProfile);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap(): Promise<void> {
      try {
        const initialSession = await getSession();
        if (!cancelled) {
          await loadProfile(initialSession);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void bootstrap();
    const unsubscribe = onAuthStateChange((nextSession) => {
      void loadProfile(nextSession);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [loadProfile]);

  const signIn = useCallback(async (email: string, password: string): Promise<void> => {
    await signInWithPassword(email, password);
  }, []);

  const signOut = useCallback(async (): Promise<void> => {
    await signOutRequest();
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      role: profile?.role ?? null,
      hospitalId: profile?.hospital_id ?? null,
      isLoading,
      signIn,
      signOut,
    }),
    [session, profile, isLoading, signIn, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an <AuthProvider>');
  }
  return context;
}
