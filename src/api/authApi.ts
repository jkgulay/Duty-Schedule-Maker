import type { Session } from '@supabase/supabase-js';

import { supabase } from '@/lib/supabaseClient';
import type { ProfileRow } from '@/types/database.types';

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error !== null) {
    throw new Error(`Read session: ${error.message}`);
  }
  return data.session;
}

export function onAuthStateChange(
  callback: (session: Session | null) => void,
): () => void {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return () => {
    data.subscription.unsubscribe();
  };
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error !== null) {
    throw new Error(`Sign in: ${error.message}`);
  }
}

export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut();
  if (error !== null) {
    throw new Error(`Sign out: ${error.message}`);
  }
}

/**
 * The current user's profile row (hospital + role), re-read from the database
 * rather than trusted from cached frontend state. Returns `null` if the user
 * has not provisioned a profile yet.
 */
export async function fetchMyProfile(): Promise<ProfileRow | null> {
  const { data, error } = await supabase.from('profiles').select('*').maybeSingle();
  if (error !== null) {
    throw new Error(`Load profile: ${error.message}`);
  }
  return data;
}
