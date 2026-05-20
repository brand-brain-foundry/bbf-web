'use client';

import { forwardRef } from 'react';
import { Text } from '@/components/atoms/Text';
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

    const baseInputClass = cn(
      'w-full px-4 py-3 border rounded-md bg-white',
      'transition-all duration-200 ease-out',
      'focus:outline-none focus:ring-2 focus:ring-offset-1',
      !hasError && [
        'border-[var(--bbf-border-on-light)]',
        'hover:border-[var(--bbf-text-on-light)]',
        'focus:border-[var(--bbf-color-red-base)] focus:ring-[var(--bbf-color-red-base)]/30',
      ],
      hasError && [
        'border-[var(--bbf-color-red-base)]',
        'focus:border-[var(--bbf-color-red-base)] focus:ring-[var(--bbf-color-red-base)]',
      ],
      disabled && 'opacity-60 cursor-not-allowed hover:border-[var(--bbf-border-on-light)]',
      inputClassName,
    );

    return (
      <div data-component="bbf-form-field" className={cn('form-field', className)}>
        <label htmlFor={fieldId} className="mb-2 block">
          <Text variant="body-md" weight="medium" as="span">
            {label}
            {required && <span aria-hidden="true"> *</span>}
          </Text>
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
            className={baseInputClass}
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
            className={baseInputClass}
            {...props}
          />
        )}

        {hasError && (
          <p id={errorId} role="alert" className="mt-2 text-sm text-[var(--bbf-color-red-base)]">
            {error}
          </p>
        )}
      </div>
    );
  },
);
