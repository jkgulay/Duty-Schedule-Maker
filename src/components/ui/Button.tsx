import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

const VARIANT_CLASS: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark',
  secondary: 'border border-gray-300 bg-white text-gray-800 hover:bg-gray-50',
  danger: 'border border-red-300 bg-white text-red-700 hover:bg-red-50',
};

export function Button({
  variant = 'primary',
  type = 'button',
  className = '',
  children,
  ...rest
}: ButtonProps): ReactNode {
  return (
    <button
      type={type}
      className={`rounded px-3 py-2 text-sm font-medium transition-colors disabled:opacity-60 ${VARIANT_CLASS[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}
