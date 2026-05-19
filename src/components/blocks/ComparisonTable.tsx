import { cn } from '@/lib/utils';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';

type Column = { label: string; highlight?: boolean | null };
type Row = { feature: string; values: { value?: string | null }[] };

type ComparisonTableProps = {
  title?: string | null;
  columns: Column[];
  rows: Row[];
  className?: string;
};

export function ComparisonTableBlock({ title, columns, rows, className }: ComparisonTableProps) {
  return (
    <div data-component="bbf-comparison-table" className={cn('my-8 overflow-x-auto', className)}>
      {title && (
        <Heading level="h3" className="mb-4">
          {title}
        </Heading>
      )}
      <table className="w-full border-collapse text-left">
        <thead>
          <tr>
            <th className="border-b border-[var(--bbf-color-sand-300)] py-3 pr-4" />
            {columns.map((col, i) => (
              <th
                key={i}
                className={cn(
                  'border-b border-[var(--bbf-color-sand-300)] px-4 py-3',
                  col.highlight &&
                    'bg-[var(--bbf-color-sand-100)] font-bold text-[var(--bbf-accent-red)]',
                )}
              >
                <Text variant="body-sm" className="font-semibold">
                  {col.label}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri} className="border-b border-[var(--bbf-color-sand-200)] last:border-0">
              <td className="py-3 pr-4">
                <Text variant="body-sm" className="font-medium">
                  {row.feature}
                </Text>
              </td>
              {row.values.map((val, vi) => (
                <td
                  key={vi}
                  className={cn(
                    'px-4 py-3',
                    columns[vi]?.highlight && 'bg-[var(--bbf-color-sand-100)]',
                  )}
                >
                  <Text variant="body-sm">{val.value ?? '—'}</Text>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
