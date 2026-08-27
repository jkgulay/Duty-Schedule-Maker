import { useMutation, type UseMutationResult } from '@tanstack/react-query';

import { uploadHospitalLogo } from '@/api/storageApi';
import type { LogoSide } from '@/types/hospital.types';

interface UploadLogoVariables {
  hospitalId: string;
  side: LogoSide;
  file: File;
}

/** Uploads a logo file and resolves to its public URL. */
export function useLogoUpload(): UseMutationResult<string, Error, UploadLogoVariables> {
  return useMutation({
    mutationFn: ({ hospitalId, side, file }: UploadLogoVariables) =>
      uploadHospitalLogo(hospitalId, side, file),
  });
}
