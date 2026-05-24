import { cn } from '@/lib/utils';
import { Heading } from '@/components/atoms/Heading';
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
      <Heading level="display-2" color="accent" className="leading-none" asChild>
        <p>
          {number}
          {unit && <span className="ml-1 [font-size:var(--bbf-text-heading-md)]">{unit}</span>}
        </p>
      </Heading>
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
