'use client';

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

type FormFieldProps = {
  label: string;
  name: string;
  type?: 'text' | 'email' | 'textarea';
  required?: boolean;
  rows?: number;
  maxLength?: number;
  autoComplete?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  disabled?: boolean;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'name' | 'type' | 'required'>;

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement, FormFieldProps>(
  function FormField(
    {
      label,
      name,
      type = 'text',
      required,
      rows = 6,
      maxLength,
      autoComplete,
      error,
      className,
      inputClassName,
      disabled,
      ...props
    },
    ref,
  ) {
    const hasError = Boolean(error);
    const fieldId = `field-${name}`;
    const errorId = `${fieldId}-error`;

    const baseClass = cn(
      'w-full border',
      'text-[length:var(--bbf-text-base)]',
      'bg-[var(--bbf-color-white)]',
      'text-[var(--bbf-text-on-sand)] placeholder:text-[var(--bbf-text-on-sand-subtle)]',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-[var(--bbf-color-focus-ring)] focus:ring-offset-2 focus:ring-offset-[var(--bbf-surface-sand)]',
      'disabled:cursor-not-allowed disabled:opacity-60',
    );

    const borderClass = hasError
      ? cn('border-[var(--bbf-color-error-border)]', 'focus:border-[var(--bbf-color-error-border)]')
      : cn(
          'border-[var(--bbf-border-on-sand)]',
          !disabled && 'hover:border-[var(--bbf-text-on-sand)]',
          'focus:border-[var(--bbf-accent-red)]',
        );

    const inputClass = cn(baseClass, borderClass, 'h-12 rounded-full px-5', inputClassName);

    const textareaClass = cn(
      baseClass,
      borderClass,
      'min-h-[120px] resize-none rounded-2xl px-5 py-4',
      inputClassName,
    );

    return (
      <div data-component="bbf-form-field" className={cn('flex flex-col', className)}>
        <label
          htmlFor={fieldId}
          className="mb-2 block text-[length:var(--bbf-text-sm)] font-[var(--bbf-weight-medium)] text-[var(--bbf-text-on-sand)]"
        >
          {label}
          {required && <span aria-hidden="true"> *</span>}
        </label>

        {type === 'textarea' ? (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={fieldId}
            name={name}
            required={required}
            aria-required={required}
            rows={rows}
            maxLength={maxLength}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            className={textareaClass}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : (
          <input
            ref={ref as React.Ref<HTMLInputElement>}
            id={fieldId}
            name={name}
            type={type}
            required={required}
            aria-required={required}
            maxLength={maxLength}
            autoComplete={autoComplete}
            disabled={disabled}
            aria-invalid={hasError}
            aria-describedby={hasError ? errorId : undefined}
            className={inputClass}
            {...props}
          />
        )}

        {hasError && (
          <p
            id={errorId}
            role="alert"
            className="mt-2 text-[length:var(--bbf-text-sm)] text-[var(--bbf-color-error-text)]"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);
