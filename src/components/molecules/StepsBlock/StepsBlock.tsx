import { cn } from '@/lib/utils';

export type StepItem = {
  title: string;
  body?: string | null;
};

type StepsBlockProps = {
  eyebrow?: string | null;
  steps: StepItem[];
  className?: string;
};

export function StepsBlock({ eyebrow, steps, className }: StepsBlockProps) {
  return (
    <div data-component="bbf-steps-block" className={cn('flex flex-col gap-6', className)}>
      {eyebrow && (
        <p className="[font-size:var(--bbf-text-caption)] font-semibold tracking-widest text-[var(--bbf-on-surface-muted)] uppercase">
          {eyebrow}
        </p>
      )}
      <ol className="flex flex-col gap-5">
        {steps.map((step, i) => (
          <li key={i} className="flex gap-4">
            <span
              aria-hidden="true"
              className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center [font-size:var(--bbf-text-caption)] font-bold text-[var(--bbf-contact-step-num-color)] tabular-nums"
            >
              {i + 1}
            </span>
            <div className="flex flex-col gap-0.5">
              <p className="[font-size:var(--bbf-text-body-md)] font-semibold text-[var(--bbf-on-surface-title)]">
                {step.title}
              </p>
              {step.body && (
                <p className="[font-size:var(--bbf-text-body-sm)] text-[var(--bbf-on-surface-body)]">
                  {step.body}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
