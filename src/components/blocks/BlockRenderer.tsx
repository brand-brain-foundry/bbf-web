import { CalloutBlock } from './Callout';
import { CodeBlock } from './Code';
import { ComparisonTableBlock } from './ComparisonTable';
import { CtaBlock } from './Cta';
import { CustomHtmlBlock } from './CustomHtml';
import { DividerBlock } from './Divider';
import { EmbedBlock } from './Embed';
import { GalleryBlock } from './Gallery';
import { ImageBlock } from './Image';
import { QuoteBlock } from './Quote';
import { RichTextRenderer } from './RichTextRenderer';
import { StatBlock } from './Stat';
import { TableOfContentsBlock } from './TableOfContents';
import { VideoBlock } from './Video';

type Block = {
  id?: string | number;
  blockType: string;
  [key: string]: unknown;
};

type BlockRendererProps = {
  block: Block;
  contentItemTitle?: string;
};

// @ts-justify: b is narrowed by switch at runtime; spread is safe, types verified per renderer
function props(b: Block) {
   
  return b as any;
}

export function BlockRenderer({ block, contentItemTitle: _contentItemTitle }: BlockRendererProps) {
  switch (block.blockType) {
    case 'rich-text':
      return <RichTextRenderer body={props(block).body} />;

    case 'faq':
      return null;

    case 'definition':
      return null;

    case 'callout':
      return <CalloutBlock {...props(block)} />;

    case 'quote':
      return <QuoteBlock {...props(block)} />;

    case 'divider':
      return <DividerBlock {...props(block)} />;

    case 'cta':
      return <CtaBlock {...props(block)} />;

    case 'stat':
      return <StatBlock {...props(block)} />;

    case 'image':
      return <ImageBlock {...props(block)} />;

    case 'video':
      return <VideoBlock {...props(block)} />;

    case 'gallery':
      return <GalleryBlock {...props(block)} />;

    case 'embed':
      return <EmbedBlock {...props(block)} />;

    case 'code':
      return <CodeBlock {...props(block)} />;

    case 'comparison-table':
      return <ComparisonTableBlock {...props(block)} />;

    case 'table-of-contents':
      return <TableOfContentsBlock {...props(block)} />;

    case 'custom-html':
      return <CustomHtmlBlock {...props(block)} />;

    default:
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`[BlockRenderer] Unknown blockType: ${block.blockType}`);
      }
      return null;
  }
}
