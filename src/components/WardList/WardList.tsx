import { useState, type FormEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { TextField } from '@/components/ui/TextField';
import type { Ward } from '@/types/hospital.types';

interface WardListProps {
  wards: readonly Ward[];
  creating: boolean;
  renaming: boolean;
  deleting: boolean;
  onCreate: (name: string) => void;
  onRename: (wardId: string, name: string) => void;
  onDelete: (wardId: string) => void;
}

export function WardList({
  wards,
  creating,
  renaming,
  deleting,
  onCreate,
  onRename,
  onDelete,
}: WardListProps): ReactNode {
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');

  function handleCreate(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = newName.trim();
    if (trimmed === '') {
      return;
    }
    onCreate(trimmed);
    setNewName('');
  }

  function startEditing(ward: Ward): void {
    setEditingId(ward.id);
    setEditingName(ward.name);
  }

  return (
    <div className="flex flex-col gap-4">
      <form onSubmit={handleCreate} className="flex items-end gap-3">
        <TextField
          label="Add ward"
          value={newName}
          placeholder="GENERAL WARD"
          onChange={(event) => setNewName(event.target.value)}
        />
        <Button type="submit" disabled={creating || newName.trim() === ''}>
          {creating ? 'Adding…' : 'Add'}
        </Button>
      </form>

      {wards.length === 0 ? (
        <EmptyState title="No wards yet" description="A schedule belongs to a ward." />
      ) : (
        <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
          {wards.map((ward) => (
            <li key={ward.id} className="flex items-center justify-between gap-3 p-3">
              {editingId === ward.id ? (
                <>
                  <input
                    aria-label={`Rename ${ward.name}`}
                    value={editingName}
                    onChange={(event) => setEditingName(event.target.value)}
                    className="flex-1 rounded border border-gray-300 px-2 py-1 text-sm"
                  />
                  <Button
                    disabled={renaming || editingName.trim() === ''}
                    onClick={() => {
                      onRename(ward.id, editingName.trim());
                      setEditingId(null);
                    }}
                  >
                    Save
                  </Button>
                  <Button variant="secondary" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-gray-900">{ward.name}</span>
                  <Button variant="secondary" onClick={() => startEditing(ward)}>
                    Rename
                  </Button>
                  <Button
                    variant="danger"
                    disabled={deleting}
                    onClick={() => onDelete(ward.id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
