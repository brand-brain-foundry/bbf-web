import { RichTextBlock } from './RichText';
import { FaqBlock } from './Faq';
import { DefinitionBlock } from './Definition';
import { CalloutBlock } from './Callout';
import { QuoteBlock } from './Quote';
import { DividerBlock } from './Divider';
import { CtaBlock } from './Cta';
import { StatBlock } from './Stat';
import { ImageBlock } from './Image';
import { VideoBlock } from './Video';
import { GalleryBlock } from './Gallery';
import { EmbedBlock } from './Embed';
import { CodeBlock } from './Code';
import { ComparisonTableBlock } from './ComparisonTable';
import { TableOfContentsBlock } from './TableOfContents';
import { CustomHtmlBlock } from './CustomHtml';

// Compartido entre contentItems y Pages (Wave 13, B-BBF-WEB-PAGES-LAYOUT-01) — una sola fuente,
// primitivo→específico (SB_TaxComponentes). NO duplicar: ambos consumidores importan de aquí.
export const sharedBlocks = [
  // M3 originals (3)
  RichTextBlock,
  FaqBlock,
  DefinitionBlock,
  // M6-A1 additions (13) — Primitive Canon §6.2
  CalloutBlock,
  QuoteBlock,
  DividerBlock,
  CtaBlock,
  StatBlock,
  ImageBlock,
  VideoBlock,
  GalleryBlock,
  EmbedBlock,
  CodeBlock,
  ComparisonTableBlock,
  TableOfContentsBlock,
  CustomHtmlBlock,
];
