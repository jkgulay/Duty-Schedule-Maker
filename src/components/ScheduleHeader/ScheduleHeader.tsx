import type { ReactNode } from 'react';

import type { Hospital } from '@/types/hospital.types';

const REPUBLIC_LINE = 'Republic of the Philippines';

interface ScheduleHeaderProps {
  hospital: Hospital;
}

/** Logos + centred hospital identity, matching the official document header. */
export function ScheduleHeader({ hospital }: ScheduleHeaderProps): ReactNode {
  return (
    <header className="flex items-center justify-center gap-6 py-2">
      <LogoSlot url={hospital.logo_left_url} alt={`${hospital.name} left seal`} />
      <div className="text-center text-sm leading-tight">
        <p>{REPUBLIC_LINE}</p>
        <p>Province of {hospital.province}</p>
        <p className="font-semibold uppercase">{hospital.name}</p>
      </div>
      <LogoSlot url={hospital.logo_right_url} alt={`${hospital.name} right seal`} />
    </header>
  );
}

function LogoSlot({ url, alt }: { url: string | null; alt: string }): ReactNode {
  return (
    <div className="flex h-16 w-16 shrink-0 items-center justify-center">
      {url !== null && (
        <img src={url} alt={alt} className="max-h-16 max-w-16 object-contain" />
      )}
    </div>
  );
}
