import { useMemo, useState, type FormEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import { ALL_STAFF } from '@/constants/scheduleEditor';
import { buildCellOptions } from '@/utils/cellValue';
import type { BulkAssignParams } from '@/types/schedule.types';
import type { ShiftType } from '@/types/shiftType.types';
import type { Staff } from '@/types/staff.types';

interface ScheduleGridToolbarProps {
  staff: readonly Staff[];
  shiftTypes: readonly ShiftType[];
  daysInMonth: number;
  applying: boolean;
  onApply: (params: BulkAssignParams) => void;
}

export function ScheduleGridToolbar({
  staff,
  shiftTypes,
  daysInMonth,
  applying,
  onApply,
}: ScheduleGridToolbarProps): ReactNode {
  const [staffId, setStaffId] = useState<string>(ALL_STAFF);
  const [value, setValue] = useState<string>('');
  const [fromDay, setFromDay] = useState(1);
  const [toDay, setToDay] = useState(daysInMonth);

  const staffOptions = useMemo<SelectOption[]>(
    () => [
      { value: ALL_STAFF, label: 'All staff' },
      ...staff.map((member) => ({ value: member.id, label: member.full_name })),
    ],
    [staff],
  );

  const shiftOptions = useMemo<SelectOption[]>(
    () => buildCellOptions(shiftTypes),
    [shiftTypes],
  );

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const lo = Math.max(1, Math.min(fromDay, toDay));
    const hi = Math.min(daysInMonth, Math.max(fromDay, toDay));
    onApply({ staffId, value, fromDay: lo, toDay: hi });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-wrap items-end gap-3 rounded border border-gray-200 bg-white p-3"
    >
      <SelectField
        label="Staff"
        value={staffId}
        options={staffOptions}
        onChange={(event) => setStaffId(event.target.value)}
      />
      <SelectField
        label="Shift"
        value={value}
        options={shiftOptions}
        onChange={(event) => setValue(event.target.value)}
      />
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        From day
        <input
          type="number"
          min={1}
          max={daysInMonth}
          value={fromDay}
          onChange={(event) => setFromDay(Number(event.target.value) || 1)}
          className="w-20 rounded border border-gray-300 px-2 py-2 text-sm"
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium text-gray-700">
        To day
        <input
          type="number"
          min={1}
          max={daysInMonth}
          value={toDay}
          onChange={(event) => setToDay(Number(event.target.value) || daysInMonth)}
          className="w-20 rounded border border-gray-300 px-2 py-2 text-sm"
        />
      </label>
      <Button type="submit" disabled={applying}>
        {applying ? 'Applying…' : 'Bulk assign'}
      </Button>
    </form>
  );
}
