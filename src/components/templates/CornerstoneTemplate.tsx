import type { ContentItem } from '@/payload/payload-types';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

type CornerstoneTemplateProps = {
  contentItem: ContentItem;
  locale: 'es' | 'en';
};

export function CornerstoneTemplate({ contentItem }: CornerstoneTemplateProps) {
  const blocks = contentItem.blocks ?? [];

  return (
    <article data-component="bbf-cornerstone-template" className="cornerstone-page">
      <header className="cornerstone-hero py-[var(--bbf-space-section-gap-md)] md:py-[var(--bbf-space-section-gap-lg)]">
        <Container size="prose">
          <Heading level="display-1" as="h1" weight="bold" color="primary" className="mb-6">
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
        {blocks.map((block, idx) => (
          <BlockRenderer
            key={(block.id as string | undefined) ?? idx}
            block={block as { blockType: string; id?: string | number; [key: string]: unknown }}
            contentItemTitle={contentItem.title}
          />
        ))}
      </Container>

      <aside className="cornerstone-cta bbf-section-py-sm mt-16 border-t border-[var(--bbf-color-sand-300)]">
        <Container size="prose">{/* CTAs canon BBF — M6-A4 */}</Container>
      </aside>
    </article>
  );
}
