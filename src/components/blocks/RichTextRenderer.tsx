import { RichText } from '@payloadcms/richtext-lexical/react';
import { cn } from '@/lib/utils';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Link } from '@/components/atoms/Link';

type LexicalEditorState = {
  root: {
    type: string;
    version: number;
    children: unknown[];
    [key: string]: unknown;
  };
};

type RichTextRendererProps = {
  body: LexicalEditorState | null | undefined;
  className?: string;
};

export function RichTextRenderer({ body, className }: RichTextRendererProps) {
  if (!body) return null;

  return (
    <div data-component="bbf-rich-text" className={cn('bbf-prose', className)}>
      <RichText
        data={body as Parameters<typeof RichText>[0]['data']}
        converters={({ defaultConverters }) => ({
          ...defaultConverters,
          heading: ({ node, nodesToJSX }) => {
            const levelMap: Record<string, 'display-md' | 'h2' | 'h3' | 'h4'> = {
              h1: 'display-md',
              h2: 'h2',
              h3: 'h3',
              h4: 'h4',
            };
            const tag = node.tag as string;
            const level = levelMap[tag] ?? 'h2';
            return (
              <Heading level={level} as={tag as 'h1' | 'h2' | 'h3' | 'h4'}>
                {nodesToJSX({ nodes: node.children as never })}
              </Heading>
            );
          },
          paragraph: ({ node, nodesToJSX }) => (
            <Text variant="body-md" as="p">
              {nodesToJSX({ nodes: node.children as never })}
            </Text>
          ),
          link: ({ node, nodesToJSX }) => {
            const href = (node.fields as { url?: string })?.url ?? '#';
            return <Link href={href}>{nodesToJSX({ nodes: node.children as never })}</Link>;
          },
        })}
      />
    </div>
  );
}
