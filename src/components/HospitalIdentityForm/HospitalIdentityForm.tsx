import { useState, type ChangeEvent, type FormEvent, type ReactNode } from 'react';

import { Button } from '@/components/ui/Button';
import { TextField } from '@/components/ui/TextField';
import type { Hospital, HospitalIdentityInput, LogoSide } from '@/types/hospital.types';

interface HospitalIdentityFormProps {
  hospital: Hospital;
  saving: boolean;
  onSave: (input: HospitalIdentityInput) => void;
  uploadLogo: (side: LogoSide, file: File) => Promise<string>;
}

function toInput(hospital: Hospital): HospitalIdentityInput {
  return {
    name: hospital.name,
    province: hospital.province,
    logoLeftUrl: hospital.logo_left_url,
    logoRightUrl: hospital.logo_right_url,
  };
}

export function HospitalIdentityForm({
  hospital,
  saving,
  onSave,
  uploadLogo,
}: HospitalIdentityFormProps): ReactNode {
  const [input, setInput] = useState<HospitalIdentityInput>(toInput(hospital));
  const [uploadingSide, setUploadingSide] = useState<LogoSide | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function handleLogoChange(
    side: LogoSide,
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    const file = event.target.files?.[0];
    if (file === undefined) {
      return;
    }
    setUploadError(null);
    setUploadingSide(side);
    try {
      const url = await uploadLogo(side, file);
      setInput((current) =>
        side === 'left'
          ? { ...current, logoLeftUrl: url }
          : { ...current, logoRightUrl: url },
      );
    } catch (caught) {
      setUploadError(caught instanceof Error ? caught.message : 'Logo upload failed');
    } finally {
      setUploadingSide(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    onSave({ ...input, name: input.name.trim(), province: input.province.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex max-w-xl flex-col gap-4">
      <TextField
        label="Hospital name"
        required
        value={input.name}
        onChange={(event) => setInput({ ...input, name: event.target.value })}
      />
      <TextField
        label="Province"
        required
        value={input.province}
        onChange={(event) => setInput({ ...input, province: event.target.value })}
      />

      <div className="grid grid-cols-2 gap-4">
        <LogoField
          label="Left logo"
          url={input.logoLeftUrl}
          uploading={uploadingSide === 'left'}
          onChange={(event) => void handleLogoChange('left', event)}
        />
        <LogoField
          label="Right logo"
          url={input.logoRightUrl}
          uploading={uploadingSide === 'right'}
          onChange={(event) => void handleLogoChange('right', event)}
        />
      </div>

      {uploadError !== null && <p className="text-sm text-red-600">{uploadError}</p>}

      <Button
        type="submit"
        disabled={saving || uploadingSide !== null}
        className="self-start"
      >
        {saving ? 'Saving…' : 'Save hospital details'}
      </Button>
    </form>
  );
}

interface LogoFieldProps {
  label: string;
  url: string | null;
  uploading: boolean;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function LogoField({ label, url, uploading, onChange }: LogoFieldProps): ReactNode {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-sm font-medium text-gray-700">{label}</span>
      {url !== null && (
        <img
          src={url}
          alt={`${label} preview`}
          className="h-16 w-16 rounded border border-gray-200 object-contain"
        />
      )}
      <input
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        onChange={onChange}
        className="text-sm"
      />
      {uploading && <span className="text-xs text-gray-500">Uploading…</span>}
    </div>
  );
}
