import { useState, type FormEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import { MONTH_OPTIONS } from '@/constants/months';
import type { CreateScheduleInput } from '@/types/schedule.types';
import type { Ward } from '@/types/hospital.types';

interface CreateScheduleFormProps {
  wards: readonly Ward[];
  creating: boolean;
  onCreate: (input: CreateScheduleInput) => void;
}

const now = new Date();
const MONTH_SELECT_OPTIONS: readonly SelectOption[] = MONTH_OPTIONS.map((option) => ({
  value: String(option.value),
  label: option.label,
}));

export function CreateScheduleForm({
  wards,
  creating,
  onCreate,
}: CreateScheduleFormProps): ReactNode {
  const firstWardId = wards[0]?.id ?? '';
  const [wardId, setWardId] = useState(firstWardId);
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const effectiveWardId = wardId === '' ? firstWardId : wardId;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    if (effectiveWardId === '') {
      return;
    }
    onCreate({ wardId: effectiveWardId, month, year });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded border border-gray-200 bg-white p-4"
    >
      <SelectField
        label="Ward"
        value={effectiveWardId}
        options={wards.map((ward) => ({ value: ward.id, label: ward.name }))}
        onChange={(event) => setWardId(event.target.value)}
      />
      <SelectField
        label="Month"
        value={String(month)}
        options={MONTH_SELECT_OPTIONS}
        onChange={(event) => setMonth(Number(event.target.value))}
      />
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        Year
        <input
          type="number"
          min={2000}
          max={2100}
          value={year}
          onChange={(event) => setYear(Number(event.target.value) || now.getFullYear())}
          className="w-24 rounded border border-gray-300 px-2 py-2 text-sm"
        />
      </label>
      <Button type="submit" disabled={creating || effectiveWardId === ''}>
        {creating ? 'Creating…' : 'New schedule'}
      </Button>
    </form>
  );
}
