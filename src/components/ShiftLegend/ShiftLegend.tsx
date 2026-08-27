import type { ReactNode } from 'react';

import type { LegendAbbreviation, ShiftType } from '@/types/shiftType.types';

interface ShiftLegendProps {
  shiftTypes: readonly ShiftType[];
  abbreviations: readonly LegendAbbreviation[];
}

/**
 * Bottom-left legend: shift-type colour swatches + labels, then the
 * abbreviation key. All text is data-driven from `shift_types` and
 * `legend_abbreviations`.
 */
export function ShiftLegend({ shiftTypes, abbreviations }: ShiftLegendProps): ReactNode {
  return (
    <section className="text-xs">
      <h2 className="mb-1 font-bold uppercase">Legend</h2>
      <ul className="flex flex-col gap-0.5">
        {shiftTypes.map((shiftType) => (
          <li key={shiftType.id} className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="inline-block h-3 w-3 shrink-0 border border-gray-400"
              style={{ backgroundColor: shiftType.color_hex }}
            />
            <span className="font-semibold">{shiftType.code}</span>
            <span>
              {shiftType.label}
              {shiftType.hours_range !== '' && ` (${shiftType.hours_range})`}
            </span>
          </li>
        ))}
      </ul>
      {abbreviations.length > 0 && (
        <ul className="mt-1 flex flex-col gap-0.5">
          {abbreviations.map((abbreviation) => (
            <li key={abbreviation.id}>
              <span className="font-semibold">{abbreviation.abbreviation}</span> ={' '}
              {abbreviation.meaning}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
