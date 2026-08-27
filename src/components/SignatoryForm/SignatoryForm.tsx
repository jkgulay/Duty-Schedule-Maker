import { useState, type FormEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import { TextField } from '@/components/ui/TextField';
import {
  SIGNATORY_ROLE,
  SIGNATORY_ROLE_LABEL,
  SIGNATORY_ROLE_ORDER,
  type SignatoryRole,
} from '@/constants/signatoryRoles';
import type { SignatoryInput } from '@/types/signatory.types';

const ROLE_OPTIONS: readonly SelectOption[] = SIGNATORY_ROLE_ORDER.map((role) => ({
  value: role,
  label: SIGNATORY_ROLE_LABEL[role],
}));

interface SignatoryFormProps {
  initial?: SignatoryInput;
  submitLabel: string;
  submitting: boolean;
  onSubmit: (input: SignatoryInput) => void;
  onCancel?: () => void;
}

const EMPTY: SignatoryInput = {
  fullName: '',
  title: '',
  defaultRole: SIGNATORY_ROLE.PREPARED_BY,
};

export function SignatoryForm({
  initial,
  submitLabel,
  submitting,
  onSubmit,
  onCancel,
}: SignatoryFormProps): ReactNode {
  const [input, setInput] = useState<SignatoryInput>(initial ?? EMPTY);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSubmit({
      ...input,
      fullName: input.fullName.trim(),
      title: input.title.trim(),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <TextField
        label="Full name"
        required
        value={input.fullName}
        placeholder="Alma A. Dominguez, RN"
        onChange={(event) => setInput({ ...input, fullName: event.target.value })}
      />
      <TextField
        label="Title"
        required
        value={input.title}
        placeholder="Nurse II"
        onChange={(event) => setInput({ ...input, title: event.target.value })}
      />
      <SelectField
        label="Default slot"
        value={input.defaultRole}
        options={ROLE_OPTIONS}
        onChange={(event) =>
          setInput({ ...input, defaultRole: event.target.value as SignatoryRole })
        }
      />
      <Button
        type="submit"
        disabled={submitting || input.fullName.trim() === '' || input.title.trim() === ''}
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
