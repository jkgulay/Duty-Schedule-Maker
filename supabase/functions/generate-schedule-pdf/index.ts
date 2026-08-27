import { loadScheduleBundle, PdfDataError } from './data.ts';
import { renderScheduleHtml } from './renderHtml.ts';
import { PdfRenderError, readPdfServiceConfig, renderPdf } from './pdf.ts';
import { formatMonth } from './_lib/layout.ts';

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function jsonError(message: string, status: number): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
  });
}

function pdfFilename(wardName: string, month: number, year: number): string {
  const label = `Duty Schedule - ${wardName} - ${formatMonth(month, year)}`;
  return `${label.replace(/[^\w \-]+/g, '').trim()}.pdf`;
}

Deno.serve(async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  if (req.method !== 'POST') {
    return jsonError('Method not allowed', 405);
  }

  const authHeader = req.headers.get('Authorization');
  if (authHeader === null) {
    return jsonError('Missing Authorization header', 401);
  }

  let scheduleId: string;
  try {
    const body = (await req.json()) as { scheduleId?: unknown };
    if (typeof body.scheduleId !== 'string' || body.scheduleId === '') {
      return jsonError('Body must include a "scheduleId" string', 400);
    }
    scheduleId = body.scheduleId;
  } catch {
    return jsonError('Invalid JSON body', 400);
  }

  const url = Deno.env.get('SUPABASE_URL') ?? '';
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
  if (url === '' || anonKey === '' || serviceKey === '') {
    return jsonError('Function is missing Supabase environment configuration', 500);
  }

  try {
    const pdfConfig = readPdfServiceConfig();
    const bundle = await loadScheduleBundle(scheduleId, {
      url,
      anonKey,
      serviceKey,
      authHeader,
    });
    const html = renderScheduleHtml(bundle);
    const pdfBytes = await renderPdf(html, pdfConfig);

    const filename = pdfFilename(
      bundle.ward.name,
      bundle.schedule.month,
      bundle.schedule.year,
    );
    return new Response(pdfBytes, {
      status: 200,
      headers: {
        ...CORS_HEADERS,
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    if (error instanceof PdfDataError || error instanceof PdfRenderError) {
      return jsonError(error.message, error.status);
    }
    const message = error instanceof Error ? error.message : 'Unexpected error';
    return jsonError(`Could not generate PDF: ${message}`, 500);
  }
});
