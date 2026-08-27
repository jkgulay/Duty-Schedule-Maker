import { SIGNATORY_ROLE_ORDER } from '@/constants/signatoryRoles';
import type {
  ResolvedSignatory,
  ScheduleSignatory,
  Signatory,
} from '@/types/signatory.types';

/**
 * Resolves the three signatory slots for a schedule: a per-schedule override
 * wins, otherwise the hospital default whose `default_role` matches the slot.
 * Always returns one entry per slot, in document order.
 */
export function resolveSignatories(
  hospitalDefaults: readonly Signatory[],
  scheduleOverrides: readonly ScheduleSignatory[],
): ResolvedSignatory[] {
  return SIGNATORY_ROLE_ORDER.map((role) => {
    const override = scheduleOverrides.find((entry) => entry.role === role);
    const source =
      override !== undefined
        ? hospitalDefaults.find((signatory) => signatory.id === override.signatory_id)
        : hospitalDefaults.find((signatory) => signatory.default_role === role);
    return {
      role,
      fullName: source?.full_name ?? '',
      title: source?.title ?? '',
    };
  });
}
