import { useState, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SelectField, type SelectOption } from '@/components/ui/SelectField';
import { ROLE, type Role } from '@/constants/roles';
import type { Member } from '@/types/member.types';

const ROLE_OPTIONS: readonly SelectOption[] = [
  { value: ROLE.VIEWER, label: 'Viewer' },
  { value: ROLE.SCHEDULER, label: 'Scheduler' },
  { value: ROLE.APPROVER, label: 'Approver' },
];

interface UserManagerProps {
  members: readonly Member[];
  currentUserId: string;
  busy: boolean;
  onChangeRole: (userId: string, role: Role) => void;
  onAssign: (userId: string, role: Role) => void;
}

export function UserManager({
  members,
  currentUserId,
  busy,
  onChangeRole,
  onAssign,
}: UserManagerProps): ReactNode {
  const active = members.filter((member) => member.hospital_id !== null);
  const pending = members.filter((member) => member.hospital_id === null);

  return (
    <div className="flex flex-col gap-8">
      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Members
        </h2>
        {active.length === 0 ? (
          <EmptyState title="No members yet" />
        ) : (
          <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
            {active.map((member) => (
              <li
                key={member.id}
                className="flex items-center justify-between gap-4 p-3 text-sm"
              >
                <span className="text-gray-900">
                  {member.email ?? '(no email on file)'}
                  {member.id === currentUserId && (
                    <span className="ml-2 text-xs text-gray-500">(you)</span>
                  )}
                </span>
                <SelectField
                  label="Role"
                  value={member.role}
                  options={ROLE_OPTIONS}
                  disabled={busy || member.id === currentUserId}
                  onChange={(event) =>
                    onChangeRole(member.id, event.target.value as Role)
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
          Pending sign-ups
        </h2>
        {pending.length === 0 ? (
          <EmptyState
            title="No pending sign-ups"
            description="New accounts appear here until you add them to the hospital."
          />
        ) : (
          <ul className="divide-y divide-gray-200 rounded border border-gray-200 bg-white">
            {pending.map((member) => (
              <PendingRow
                key={member.id}
                member={member}
                busy={busy}
                onAssign={onAssign}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

interface PendingRowProps {
  member: Member;
  busy: boolean;
  onAssign: (userId: string, role: Role) => void;
}

function PendingRow({ member, busy, onAssign }: PendingRowProps): ReactNode {
  const [role, setRole] = useState<Role>(ROLE.VIEWER);
  return (
    <li className="flex items-center justify-between gap-4 p-3 text-sm">
      <span className="text-gray-900">{member.email ?? '(no email on file)'}</span>
      <span className="flex items-end gap-3">
        <SelectField
          label="Grant role"
          value={role}
          options={ROLE_OPTIONS}
          disabled={busy}
          onChange={(event) => setRole(event.target.value as Role)}
        />
        <Button disabled={busy} onClick={() => onAssign(member.id, role)}>
          Add to hospital
        </Button>
      </span>
    </li>
  );
}
