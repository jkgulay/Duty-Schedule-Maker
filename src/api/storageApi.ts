import { supabase } from '@/lib/supabaseClient';
import type { LogoSide } from '@/types/hospital.types';

const LOGO_BUCKET = 'hospital-logos';

function fileExtension(fileName: string): string {
  const dot = fileName.lastIndexOf('.');
  return dot >= 0 ? fileName.slice(dot + 1).toLowerCase() : 'png';
}

/**
 * Uploads a hospital logo to `hospital-logos/{hospitalId}/logo-{side}-{ts}.{ext}`
 * and returns its public URL. The storage RLS policy requires the path's first
 * segment to be the caller's hospital id.
 */
export async function uploadHospitalLogo(
  hospitalId: string,
  side: LogoSide,
  file: File,
): Promise<string> {
  const path = `${hospitalId}/logo-${side}-${Date.now()}.${fileExtension(file.name)}`;

  const { error } = await supabase.storage
    .from(LOGO_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error !== null) {
    throw new Error(`Upload logo: ${error.message}`);
  }

  const { data } = supabase.storage.from(LOGO_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
