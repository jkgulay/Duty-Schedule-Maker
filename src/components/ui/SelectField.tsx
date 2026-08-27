import { useId, type ReactNode, type SelectHTMLAttributes } from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id'> {
  label: string;
  options: readonly SelectOption[];
}

export function SelectField({
  label,
  options,
  className = '',
  ...rest
}: SelectFieldProps): ReactNode {
  const id = useId();
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-gray-700">
        {label}
      </label>
      <select
        id={id}
        className={`rounded border border-gray-300 px-3 py-2 text-sm focus:border-brand focus:outline-none ${className}`}
        {...rest}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
