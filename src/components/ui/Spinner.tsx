import type { ReactNode } from 'react';

interface SpinnerProps {
  label?: string;
}

/** Minimal loading indicator with an accessible label. */
export function Spinner({ label = 'Loading' }: SpinnerProps): ReactNode {
  return (
    <div role="status" className="flex items-center gap-2 text-sm text-gray-600">
      <span
        aria-hidden="true"
        className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-brand"
      />
      {label}
    </div>
  );
}
