import { cn } from '@/lib/utils';
import { Heading } from '@/components/atoms/Heading';

type CalloutProps = {
  variant: 'info' | 'warning' | 'success' | 'note';
  title?: string | null;
  content?: unknown;
  className?: string;
};

const variantStyles: Record<CalloutProps['variant'], string> = {
  info: 'border-[var(--bbf-color-blue-500)] bg-[var(--bbf-color-blue-100)]',
  warning: 'border-[var(--bbf-color-sand-600)] bg-[var(--bbf-color-sand-100)]',
  success: 'border-[var(--bbf-color-black-400)] bg-[var(--bbf-color-black-100)]',
  note: 'border-[var(--bbf-color-sand-400)] bg-[var(--bbf-color-sand-50)]',
};

export function CalloutBlock({ variant, title, className }: CalloutProps) {
  return (
    <aside
      data-component="bbf-callout"
      data-variant={variant}
      className={cn('my-6 rounded-md border-l-4 p-4', variantStyles[variant], className)}
    >
      {title && (
        <Heading level="h4" className="mb-2">
          {title}
        </Heading>
      )}
    </aside>
  );
}
