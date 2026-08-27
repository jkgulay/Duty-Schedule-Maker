import { useState, type FormEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import type { ShiftTypeInput } from '@/types/shiftType.types';

interface ShiftTypeFormProps {
  initial?: ShiftTypeInput;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: ShiftTypeInput) => void;
  onCancel?: () => void;
}

const EMPTY: ShiftTypeInput = {
  code: '',
  label: '',
  colorHex: '#ffffff',
  hoursRange: '',
  sortOrder: 0,
};

export function ShiftTypeForm({
  initial,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: ShiftTypeFormProps): ReactNode {
  const [input, setInput] = useState<ShiftTypeInput>(initial ?? EMPTY);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({
      ...input,
      code: input.code.trim(),
      label: input.label.trim(),
      hoursRange: input.hoursRange.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <TextField
        label="Code"
        required
        value={input.code}
        placeholder="M"
        className="w-20"
        onChange={(event) => setInput({ ...input, code: event.target.value })}
      />
      <TextField
        label="Label"
        required
        value={input.label}
        placeholder="7am - 3pm"
        onChange={(event) => setInput({ ...input, label: event.target.value })}
      />
      <TextField
        label="Hours range"
        value={input.hoursRange}
        placeholder="7am-3pm"
        onChange={(event) => setInput({ ...input, hoursRange: event.target.value })}
      />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-gray-700">Colour</span>
        <input
          type="color"
          aria-label="Shift colour"
          value={input.colorHex}
          className="h-9 w-14 rounded border border-gray-300"
          onChange={(event) => setInput({ ...input, colorHex: event.target.value })}
        />
      </div>
      <TextField
        label="Sort order"
        type="number"
        value={String(input.sortOrder)}
        className="w-24"
        onChange={(event) =>
          setInput({ ...input, sortOrder: Number(event.target.value) || 0 })
        }
      />
      <Button
        type="submit"
        disabled={submitting || input.code.trim() === '' || input.label.trim() === ''}
      >
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
