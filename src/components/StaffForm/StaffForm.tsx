import { useState, type FormEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import type { StaffInput } from '@/types/staff.types';

interface StaffFormProps {
  initial?: StaffInput;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: StaffInput) => void;
  onCancel?: () => void;
}

const EMPTY: StaffInput = { fullName: '', credentials: '', active: true };

export function StaffForm({
  initial,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: StaffFormProps): ReactNode {
  const [input, setInput] = useState<StaffInput>(initial ?? EMPTY);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({
      fullName: input.fullName.trim(),
      credentials: input.credentials.trim(),
      active: input.active,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <TextField
        label="Full name"
        required
        value={input.fullName}
        hint="Surname, First name — e.g. Aguilera, Sheena Marie Joy L."
        onChange={(event) => setInput({ ...input, fullName: event.target.value })}
      />
      <TextField
        label="Credentials"
        value={input.credentials}
        placeholder="RN"
        onChange={(event) => setInput({ ...input, credentials: event.target.value })}
      />
      <label className="flex items-center gap-2 pb-2 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={input.active}
          onChange={(event) => setInput({ ...input, active: event.target.checked })}
        />
        Active
      </label>
      <Button type="submit" disabled={submitting || input.fullName.trim() === ''}>
        {submitting ? 'Saving…' : submitLabel}
      </Button>
      {onCancel !== undefined && (
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      )}
    </form>
  );
}
