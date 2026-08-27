import { useId, type InputHTMLAttributes, type ReactNode } from 'react';

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  hint?: string;
}

export function TextField({
  label,
  hint,
  className = '',
  ...rest
}: TextFieldProps): ReactNode {
  const id = useId();
  const hintId = `${id}-hint`;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hint !== undefined ? hintId : undefined}
        className={`rounded border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none ${className}`}
        {...rest}
      />
      {hint !== undefined && (
        <span id={hintId} className="text-xs text-gray-500">
          {hint}
        </span>
      )}
    </div>
  );
}
