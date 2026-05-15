import { RichTextBlock } from './RichText';
import { FaqBlock } from './Faq';
import { DefinitionBlock } from './Definition';

// 13 blocks restantes en B-BBF-12-BLOCKS-EXPANSION:
// Callout, Code, Quote, Stat, VideoEmbed, Image, ImageGallery,
// Table, Cta, Tldr, KeyTakeaways, ComparisonTable, ProcessSteps

export const contentItemBlocks = [RichTextBlock, FaqBlock, DefinitionBlock];
