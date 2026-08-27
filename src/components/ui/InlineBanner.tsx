import type { ReactNode } from 'react';

type Tone = 'error' | 'success' | 'info';

interface InlineBannerProps {
  tone: Tone;
  children: ReactNode;
}

const TONE_CLASS: Record<Tone, string> = {
  error: 'border-red-300 bg-red-50 text-red-800',
  success: 'border-green-300 bg-green-50 text-green-800',
  info: 'border-blue-300 bg-blue-50 text-blue-800',
};

/** Small status message shown near a form after an action. */
export function InlineBanner({ tone, children }: InlineBannerProps): ReactNode {
  return (
    <p
      role={tone === 'error' ? 'alert' : 'status'}
      className={`rounded border px-3 py-2 text-sm ${TONE_CLASS[tone]}`}
    >
      {children}
    </p>
  );
}
