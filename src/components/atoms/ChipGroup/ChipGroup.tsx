'use client';

import { cn } from '@/lib/utils';

export type ChipOption = {
  value: string;
  label: string;
};

type ChipGroupProps = {
  name: string;
  legend: string;
  options: ChipOption[];
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
};

export function ChipGroup({ name, legend, options, value, onChange, className }: ChipGroupProps) {
  return (
    <fieldset data-component="bbf-chip-group" className={cn('min-w-0', className)}>
      <legend className="mb-2 [font-size:var(--bbf-text-caption)] font-medium tracking-wide text-[var(--bbf-on-surface-muted)] uppercase">
        {legend}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => {
          const id = `chip-${name}-${opt.value}`;
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              htmlFor={id}
              className={cn(
                'cursor-pointer rounded-full border px-4 py-1.5 select-none',
                '[font-size:var(--bbf-text-body-sm)] font-medium',
                'transition-colors duration-150',
                checked
                  ? 'border-[var(--bbf-contact-chip-bg-active)] bg-[var(--bbf-contact-chip-bg-active)] text-[var(--bbf-contact-chip-text-active)]'
                  : 'border-[var(--bbf-contact-chip-border)] bg-[var(--bbf-on-surface-bg)] text-[var(--bbf-on-surface-body)] hover:border-[var(--bbf-contact-chip-hover)] hover:text-[var(--bbf-contact-chip-hover)]',
              )}
            >
              <input
                id={id}
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange?.(opt.value)}
                className="sr-only"
              />
              {opt.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
