/**
 * Renders HTML to a PDF via an external headless-browser service
 * (Browserless-compatible: `POST {url}?token=…` with a JSON body of
 * `{ html, options }`). No browser runs inside this Edge Function.
 */
export class PdfRenderError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = 'PdfRenderError';
  }
}

interface PdfServiceConfig {
  apiUrl: string;
  apiToken: string;
}

export function readPdfServiceConfig(): PdfServiceConfig {
  const apiUrl = Deno.env.get('HEADLESS_PDF_API_URL') ?? '';
  const apiToken = Deno.env.get('HEADLESS_PDF_API_TOKEN') ?? '';
  if (apiUrl === '' || apiToken === '') {
    throw new PdfRenderError(
      'PDF service is not configured. Set HEADLESS_PDF_API_URL and HEADLESS_PDF_API_TOKEN.',
      503,
    );
  }
  return { apiUrl, apiToken };
}

export async function renderPdf(
  html: string,
  config: PdfServiceConfig,
): Promise<ArrayBuffer> {
  const endpoint = new URL(config.apiUrl);
  endpoint.searchParams.set('token', config.apiToken);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiToken}`,
    },
    body: JSON.stringify({
      html,
      options: {
        printBackground: true,
        preferCSSPageSize: true,
        // Fallback if the service ignores @page: Long Bond, landscape.
        width: '13in',
        height: '8.5in',
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    throw new PdfRenderError(
      `PDF service returned ${response.status}${detail === '' ? '' : `: ${detail.slice(0, 300)}`}`,
      502,
    );
  }

  return await response.arrayBuffer();
}
