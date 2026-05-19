import { cn } from '@/lib/utils';
import { Heading } from '@/components/atoms/Heading';
import { Link } from '@/components/atoms/Link';
import { Text } from '@/components/atoms/Text';

type TocItem = { label: string; anchor: string };

type TableOfContentsProps = {
  title?: string | null;
  mode?: 'auto' | 'manual' | null;
  items?: TocItem[] | null;
  className?: string;
};

export function TableOfContentsBlock({
  title,
  mode = 'auto',
  items,
  className,
}: TableOfContentsProps) {
  const showItems = mode === 'manual' && items && items.length > 0;

  return (
    <nav
      data-component="bbf-toc"
      aria-label="Table of contents"
      className={cn(
        'my-8 rounded-md border border-[var(--bbf-color-sand-300)] bg-[var(--bbf-color-sand-50)] p-6',
        className,
      )}
    >
      {title && (
        <Heading level="h4" className="mb-4">
          {title ?? 'En este artículo'}
        </Heading>
      )}
      {mode === 'auto' && (
        <Text variant="body-sm" className="text-[var(--bbf-text-on-light-secondary)] italic">
          (Auto-generated from headings at render time)
        </Text>
      )}
      {showItems && (
        <ol className="list-inside list-decimal space-y-2">
          {items!.map((item, i) => (
            <li key={i}>
              <Link href={`#${item.anchor}`} variant="subtle">
                <Text variant="body-sm" as="span">
                  {item.label}
                </Text>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </nav>
  );
}
