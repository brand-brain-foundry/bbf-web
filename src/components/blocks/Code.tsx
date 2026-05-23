import { cn } from '@/lib/utils';
import { Text } from '@/components/atoms/Text';

type CodeBlockProps = {
  language?: string | null;
  filename?: string | null;
  content: string;
  lineNumbers?: boolean | null;
  className?: string;
};

export function CodeBlock({
  language,
  filename,
  content,
  lineNumbers = true,
  className,
}: CodeBlockProps) {
  return (
    <figure data-component="bbf-code" className={cn('my-6', className)}>
      {filename && (
        <figcaption className="flex items-center gap-2 rounded-t-md bg-[var(--bbf-surface-black-elevated)] px-4 py-2">
          <Text variant="body-sm" className="font-mono text-[var(--bbf-text-on-black-muted)]">
            {filename}
          </Text>
          {language && (
            <span className="ml-auto text-xs text-[var(--bbf-text-on-black-subtle)]">
              {language}
            </span>
          )}
        </figcaption>
      )}
      <pre
        className={cn(
          'overflow-x-auto bg-[var(--bbf-surface-black)] p-4 text-[var(--bbf-text-on-black)]',
          filename ? 'rounded-b-md' : 'rounded-md',
          lineNumbers && 'counter-reset-[line]',
        )}
        data-language={language ?? 'text'}
      >
        <code className="font-mono text-sm">{content}</code>
      </pre>
    </figure>
  );
}
