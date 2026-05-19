import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';

type QuoteProps = {
  text: string;
  author?: string | null;
  role?: string | null;
  source?: string | null;
  className?: string;
};

export function QuoteBlock({ text, author, role, source, className }: QuoteProps) {
  return (
    <figure
      data-component="bbf-quote"
      className={cn('my-8 border-l-4 border-[var(--bbf-accent-red)] pl-6', className)}
    >
      <blockquote>
        <Text variant="body-lg" as="p" className="italic">
          {text}
        </Text>
      </blockquote>
      {(author || source) && (
        <figcaption className="mt-3">
          <Text variant="body-sm" as="span" className="font-medium not-italic">
            {author}
            {role && <span className="text-[var(--bbf-text-on-light-secondary)]">, {role}</span>}
            {source && (
              <cite className="ml-2 text-[var(--bbf-text-on-light-secondary)]">— {source}</cite>
            )}
          </Text>
        </figcaption>
      )}
    </figure>
  );
}
