import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';

type StatProps = {
  number: string;
  unit?: string | null;
  label: string;
  context?: string | null;
  className?: string;
};

export function StatBlock({ number, unit, label, context, className }: StatProps) {
  return (
    <div data-component="bbf-stat" className={cn('my-6 text-center', className)}>
      <p className="[font-size:var(--bbf-text-display-2)] leading-none font-bold text-[var(--bbf-accent-red)]">
        {number}
        {unit && <span className="ml-1 [font-size:var(--bbf-text-heading-md)]">{unit}</span>}
      </p>
      <Text variant="body-md" className="mt-2 font-medium">
        {label}
      </Text>
      {context && (
        <Text variant="body-sm" className="mt-1 text-[var(--bbf-text-on-light-secondary)]">
          {context}
        </Text>
      )}
    </div>
  );
}
