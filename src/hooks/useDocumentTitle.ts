import { useEffect } from 'react';

const BASE_TITLE = 'Nursing Duty Schedule Maker';

/** Sets `document.title` for a page; restores the base title on unmount. */
export function useDocumentTitle(pageTitle: string): void {
  useEffect(() => {
    document.title = `${pageTitle} · ${BASE_TITLE}`;
    return () => {
      document.title = BASE_TITLE;
    };
  }, [pageTitle]);
}
