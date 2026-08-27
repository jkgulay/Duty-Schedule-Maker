import type { ReactNode } from 'react';

import { SIGNATORY_ROLE_LABEL } from '@/constants/signatoryRoles';
import type { ResolvedSignatory } from '@/types/signatory.types';

interface SignatoryBlockProps {
  signatories: readonly ResolvedSignatory[];
}

/**
 * Bottom-right signatory columns: role label, signature line, bold name,
 * title. Extends to however many signatories are provided.
 */
export function SignatoryBlock({ signatories }: SignatoryBlockProps): ReactNode {
  return (
    <div className="flex gap-8 text-xs">
      {signatories.map((signatory) => (
        <div key={signatory.role} className="min-w-[10rem] text-center">
          <p className="text-left">{SIGNATORY_ROLE_LABEL[signatory.role]}:</p>
          <p className="mt-6 border-t border-gray-800 pt-1 font-bold">
            {signatory.fullName || ' '}
          </p>
          <p>{signatory.title}</p>
        </div>
      ))}
    </div>
  );
}
