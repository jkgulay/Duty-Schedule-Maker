import { useState, type ReactNode } from 'react';

import { ShiftTypeForm } from '@/components/ShiftTypeForm/ShiftTypeForm';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import type { ShiftType, ShiftTypeInput } from '@/types/shiftType.types';

interface ShiftTypeManagerProps {
  shiftTypes: readonly ShiftType[];
  creating: boolean;
  updating: boolean;
  deleting: boolean;
  onCreate: (input: ShiftTypeInput) => void;
  onUpdate: (shiftTypeId: string, input: ShiftTypeInput) => void;
  onDelete: (shiftTypeId: string) => void;
}

function toInput(shiftType: ShiftType): ShiftTypeInput {
  return {
    code: shiftType.code,
    label: shiftType.label,
    colorHex: shiftType.color_hex,
    hoursRange: shiftType.hours_range,
    sortOrder: shiftType.sort_order,
  };
}

export function ShiftTypeManager({
  shiftTypes,
  creating,
  updating,
  deleting,
  onCreate,
  onUpdate,
  onDelete,
}: ShiftTypeManagerProps): ReactNode {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <section className="rounded border border-gray-200 bg-white p-4">
        <h2 className="mb-3 text-sm font-semibold text-gray-900">Add shift type</h2>
        <ShiftTypeForm submitLabel="Add" submitting={creating} onSubmit={onCreate} />
      </section>

      {shiftTypes.length === 0 ? (
        <EmptyState
          title="No shift types configured"
          description="These drive the grid colours and the legend."
        />
      ) : (
        <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {shiftTypes.map((shiftType) => (
            <li key={shiftType.id} className="p-4">
              {editingId === shiftType.id ? (
                <ShiftTypeForm
                  initial={toInput(shiftType)}
                  submitLabel="Save"
                  submitting={updating}
                  onSubmit={(input) => {
                    onUpdate(shiftType.id, input);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-3 text-sm text-gray-900">
                    <span
                      aria-hidden="true"
                      className="inline-block h-5 w-5 rounded border border-gray-300"
                      style={{ backgroundColor: shiftType.color_hex }}
                    />
                    <span className="font-medium">{shiftType.code}</span>
                    <span className="text-gray-600">{shiftType.label}</span>
                  </span>
                  <span className="flex gap-2">
                    <Button
                      variant="secondary"
                      onClick={() => setEditingId(shiftType.id)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="danger"
                      disabled={deleting}
                      onClick={() => onDelete(shiftType.id)}
                    >
                      Delete
                    </Button>
                  </span>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
