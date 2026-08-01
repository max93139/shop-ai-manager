import React, { useId, type InputHTMLAttributes, type ReactNode } from 'react';

type FormInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: ReactNode;
};

export default function FormInput({
  label,
  icon,
  id,
  className = '',
  ...rest
}: FormInputProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col gap-[7px] mb-[18px] last-of-type:mb-0">
      <label htmlFor={inputId} className="text-[12.5px] font-semibold text-[var(--text-secondary)]">
        {label}
      </label>
      <div className="relative w-full">
        <span className="pointer-events-none absolute left-[13px] top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] [&>svg]:h-[16px] [&>svg]:w-[16px] [&>svg]:block">
          {icon}
        </span>
        <input
          id={inputId}
          className={`w-full rounded-[var(--radius-sm)] border border-[var(--border-strong)] bg-[var(--surface)] py-[11px] pl-[38px] pr-[13px] text-[14px] text-[var(--text)] placeholder:text-[var(--text-tertiary)] transition-all duration-150 focus:border-[var(--accent)] focus:outline-none focus:ring-3 focus:ring-[var(--accent-soft)] ${className}`}
          {...rest}
        />
      </div>
    </div>
  );
}
