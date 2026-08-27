import { useQuery, type UseQueryResult } from '@tanstack/react-query';

import { fetchLegendAbbreviations } from '@/api/legendApi';
import { queryKeys } from '@/hooks/queryKeys';
import type { LegendAbbreviation } from '@/types/shiftType.types';

export function useLegendAbbreviations(): UseQueryResult<LegendAbbreviation[], Error> {
  return useQuery({
    queryKey: queryKeys.legendAbbreviations,
    queryFn: fetchLegendAbbreviations,
  });
}
