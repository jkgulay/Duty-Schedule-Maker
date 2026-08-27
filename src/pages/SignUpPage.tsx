import { useState, type FormEvent, type ReactNode } from 'react';
import { Link, Navigate } from 'react-router-dom';

import { Button } from '@/components/ui/Button';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { TextField } from '@/components/ui/TextField';
import { signUp } from '@/api/authApi';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentTitle } from '@/hooks/useDocumentTitle';
import { ROUTES } from '@/routes/paths';

export function SignUpPage(): ReactNode {
  useDocumentTitle('Create account');
  const { session, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isLoading && session !== null) {
    return <Navigate to={ROUTES.schedules} replace />;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      const { needsEmailConfirmation } = await signUp(email, password);
      if (needsEmailConfirmation) {
        setConfirmationSent(true);
      }
      // If a session was returned, useAuth picks it up and routing redirects.
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Could not create the account');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-sm flex-col justify-center p-8">
      <h1 className="text-2xl font-semibold text-gray-900">Create your account</h1>
      <p className="mt-1 text-sm text-gray-600">
        A new account starts with no access. An approver links you to a hospital and sets
        your role afterwards.
      </p>

      {confirmationSent ? (
        <div className="mt-6">
          <InlineBanner tone="success">
            Check your inbox to confirm <strong>{email}</strong>, then{' '}
            <Link to={ROUTES.login} className="font-medium underline">
              sign in
            </Link>
            .
          </InlineBanner>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            void handleSubmit(event);
          }}
          className="mt-6 flex flex-col gap-4"
        >
          <TextField
            label="Email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            autoComplete="new-password"
            required
            minLength={8}
            hint="At least 8 characters."
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error !== null && <InlineBanner tone="error">{error}</InlineBanner>}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Creating…' : 'Create account'}
          </Button>
        </form>
      )}

      <p className="mt-4 text-sm text-gray-600">
        Already have an account?{' '}
        <Link to={ROUTES.login} className="font-medium text-brand underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
