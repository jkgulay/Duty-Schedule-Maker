import { useState, type ReactNode } from 'react';

import { SignatoryForm } from '@/components/SignatoryForm/SignatoryForm';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SIGNATORY_ROLE_LABEL } from '@/constants/signatoryRoles';
import type { Signatory, SignatoryInput } from '@/types/signatory.types';

interface SignatoryManagerProps {
  signatories: readonly Signatory[];
  creating: boolean;
  updating: boolean;
  onCreate: (input: SignatoryInput) => void;
  onUpdate: (signatoryId: string, input: SignatoryInput) => void;
}

function toInput(signatory: Signatory): SignatoryInput {
  return {
    fullName: signatory.full_name,
    title: signatory.title,
    defaultRole: signatory.default_role,
  };
}

export function SignatoryManager({
  signatories,
  creating,
  updating,
  onCreate,
  onUpdate,
}: SignatoryManagerProps): ReactNode {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Add signatory</h2>
        <SignatoryForm submitLabel="Add" submitting={creating} onSubmit={onCreate} />
      </section>

      {signatories.length === 0 ? (
        <EmptyState
          title="No signatories yet"
          description="These become the default names on every schedule for this hospital."
        />
      ) : (
        <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {signatories.map((signatory) => (
            <li key={signatory.id} className="p-4">
              {editingId === signatory.id ? (
                <SignatoryForm
                  initial={toInput(signatory)}
                  submitLabel="Save"
                  submitting={updating}
                  onSubmit={(input) => {
                    onUpdate(signatory.id, input);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-900">
                    <span className="font-medium">{signatory.full_name}</span>
                    <span className="text-gray-600"> — {signatory.title}</span>
                    <span className="ml-2 text-xs uppercase tracking-wide text-gray-500">
                      {SIGNATORY_ROLE_LABEL[signatory.default_role]}
                    </span>
                  </span>
                  <Button variant="secondary" onClick={() => setEditingId(signatory.id)}>
                    Edit
                  </Button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
