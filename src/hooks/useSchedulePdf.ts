import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { requestSchedulePdf } from '@/api/pdfApi';
import { downloadBlob } from '@/utils/downloadBlob';

interface DownloadPdfVariables {
  scheduleId: string;
  filename: string;
}

/** Requests the server-rendered PDF and starts the browser download. */
export function useSchedulePdf(): UseMutationResult<void, Error, DownloadPdfVariables> {
  return useMutation({
    mutationFn: async ({ scheduleId, filename }: DownloadPdfVariables): Promise<void> => {
      const blob = await requestSchedulePdf(scheduleId);
      downloadBlob(blob, filename);
    },
  });
}
