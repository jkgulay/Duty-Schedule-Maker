import type { ScheduleEntryRow, ScheduleRow } from '@/types/database.types';

export type Schedule = ScheduleRow;
export type ScheduleEntry = ScheduleEntryRow;

/** Payload to create a new schedule for a ward + half-month period. */
export interface CreateScheduleInput {
  wardId: string;
  month: number;
  year: number;
  /** 1 = days 1-15, 2 = day 16 to end of month. */
  period: 1 | 2;
}

/**
 * The assignable state of a single grid cell. `shiftTypeId: null` with both
 * flags false and no second shift or custom text means the cell is empty.
 *
 * `shiftTypeId2` is an optional second shift, rendered as a split-color cell
 * for a staff member working a double shift that day. `customText` is the
 * manually typed label; when null the cell falls back to the shift code (or
 * "NA" / request marker).
 */
export interface CellState {
  shiftTypeId: string | null;
  shiftTypeId2: string | null;
  customText: string | null;
  isRequest: boolean;
  isNa: boolean;
}

/** A cell state addressed to a specific staff member + day of a schedule. */
export interface ScheduleEntryInput extends CellState {
  scheduleId: string;
  staffId: string;
  dayOfMonth: number;
}

/**
 * A bulk-assign request from the editor toolbar. `staffId` is either a real
 * staff id or the `ALL_STAFF` sentinel; `value` is an encoded cell value.
 */
export interface BulkAssignParams {
  staffId: string;
  value: string;
  fromDay: number;
  toDay: number;
}
