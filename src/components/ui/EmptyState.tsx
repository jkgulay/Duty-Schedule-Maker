import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description?: string;
}

/** Graceful fallback for "no data" and error placeholders. */
export function EmptyState({ title, description }: EmptyStateProps): ReactNode {
  return (
    <div className="rounded border border-dashed border-gray-300 p-8 text-center">
      <p className="text-sm font-medium text-gray-900">{title}</p>
      {description !== undefined && (
        <p className="mt-1 text-sm text-gray-600">{description}</p>
      )}
    </div>
  );
}
