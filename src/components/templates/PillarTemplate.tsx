import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';

type ContentItemBlock = { blockType: string; id?: string | number; [key: string]: unknown };

type ContentItem = {
  id: string | number;
  title: string;
  blocks: ContentItemBlock[];
};

type PillarTemplateProps = {
  contentItem: ContentItem;
  locale: 'es' | 'en';
};

// Placeholder — implementación completa en M6-B (pillars + clusters)
export function PillarTemplate({ contentItem }: PillarTemplateProps) {
  return (
    <article data-component="bbf-pillar-template" className="pillar-page">
      <Container size="prose">
        <Heading level="display-lg" as="h1">
          {contentItem.title}
        </Heading>
        {contentItem.blocks.map((block, idx) => (
          <BlockRenderer key={(block.id as string | undefined) ?? idx} block={block} />
        ))}
      </Container>
    </article>
  );
}
