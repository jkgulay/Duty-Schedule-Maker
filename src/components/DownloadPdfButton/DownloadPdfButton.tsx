import type { ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { InlineBanner } from '@/components/ui/InlineBanner';
import { useSchedulePdf } from '@/hooks/useSchedulePdf';

interface DownloadPdfButtonProps {
  scheduleId: string;
  filename: string;
}

export function DownloadPdfButton({
  scheduleId,
  filename,
}: DownloadPdfButtonProps): ReactNode {
  const pdf = useSchedulePdf();
  const start = (): void => pdf.mutate({ scheduleId, filename });

  return (
    <div className="flex flex-col items-end gap-2">
      <Button onClick={start} disabled={pdf.isPending}>
        {pdf.isPending ? 'Preparing PDF…' : 'Download PDF'}
      </Button>
      {pdf.isError && (
        <InlineBanner tone="error">
          {pdf.error.message}{' '}
          <button type="button" onClick={start} className="font-medium underline">
            Try again
          </button>
        </InlineBanner>
      )}
    </div>
  );
}
