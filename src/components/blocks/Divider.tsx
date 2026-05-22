import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';

type DividerProps = {
  label?: string | null;
  className?: string;
};

export function DividerBlock({ label, className }: DividerProps) {
  return (
    <div
      data-component="bbf-divider"
      className={cn('my-10 flex items-center gap-4', className)}
      role="separator"
    >
      <hr className="flex-1 border-t border-[var(--bbf-border-subtle-on-sand)]" />
      {label && (
        <Text variant="body-sm" className="shrink-0 text-[var(--bbf-text-on-light-secondary)]">
          {label}
        </Text>
      )}
      {label && <hr className="flex-1 border-t border-[var(--bbf-border-subtle-on-sand)]" />}
    </div>
  );
}
