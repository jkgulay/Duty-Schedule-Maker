import { useState, type ReactNode } from 'react';

import { StaffForm } from '@/components/StaffForm/StaffForm';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { Staff, StaffInput } from '@/types/staff.types';

interface StaffManagerProps {
  staff: readonly Staff[];
  creating: boolean;
  updating: boolean;
  onCreate: (input: StaffInput) => void;
  onUpdate: (staffId: string, input: StaffInput) => void;
}

function toInput(member: Staff): StaffInput {
  return {
    fullName: member.full_name,
    credentials: member.credentials,
    active: member.active,
  };
}

export function StaffManager({
  staff,
  creating,
  updating,
  onCreate,
  onUpdate,
}: StaffManagerProps): ReactNode {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Add staff member</h2>
        <StaffForm submitLabel="Add" submitting={creating} onSubmit={onCreate} />
      </section>

      {staff.length === 0 ? (
        <EmptyState title="No staff yet" description="Add nurses to build a schedule." />
      ) : (
        <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {staff.map((member) => (
            <li key={member.id} className="p-4">
              {editingId === member.id ? (
                <StaffForm
                  initial={toInput(member)}
                  submitLabel="Save"
                  submitting={updating}
                  onSubmit={(input) => {
                    onUpdate(member.id, input);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-900">
                    {member.full_name}
                    {member.credentials !== '' && `, ${member.credentials}`}
                    {!member.active && (
                      <span className="ml-2 text-xs text-gray-500">(inactive)</span>
                    )}
                  </span>
                  <Button variant="secondary" onClick={() => setEditingId(member.id)}>
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
