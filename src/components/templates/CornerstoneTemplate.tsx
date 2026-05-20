import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

type ContentItemBlock = { blockType: string; id?: string | number; [key: string]: unknown };

type ContentItem = {
  id: string | number;
  slug: string;
  title: string;
  subtitle?: string | null;
  excerpt?: string | null;
  kind: string;
  blocks: ContentItemBlock[];
  authors?: Array<{ name?: string; slug?: string }>;
  publishedAt?: string | null;
};

type CornerstoneTemplateProps = {
  contentItem: ContentItem;
  locale: 'es' | 'en';
};

export function CornerstoneTemplate({ contentItem }: CornerstoneTemplateProps) {
  return (
    <article data-component="bbf-cornerstone-template" className="cornerstone-page">
      <header className="cornerstone-hero py-16 md:py-24">
        <Container size="prose">
          <Heading level="display-xl" as="h1" weight="bold" color="primary" className="mb-6">
            {contentItem.title}
          </Heading>

          {contentItem.subtitle && (
            <Heading level="h3" weight="regular" color="secondary" className="mb-6">
              {contentItem.subtitle}
            </Heading>
          )}

          {contentItem.excerpt && (
            <Text variant="body-lg" color="secondary" className="max-w-prose">
              {contentItem.excerpt}
            </Text>
          )}
        </Container>
      </header>

      <Container size="prose" className="cornerstone-body">
        {contentItem.blocks.map((block, idx) => (
          <BlockRenderer
            key={(block.id as string | undefined) ?? idx}
            block={block}
            contentItemTitle={contentItem.title}
          />
        ))}
      </Container>

      <aside className="cornerstone-cta mt-16 border-t border-[var(--bbf-color-sand-300)] py-12">
        <Container size="prose">{/* CTAs canon BBF — M6-A4 */}</Container>
      </aside>
    </article>
  );
}
