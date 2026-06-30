/**
 * Seed Cornerstones M6-A2
 *
 * Migrate 4 cornerstone .md files from bbf-docs to Payload ContentItems.
 *
 * Approach D-BBF-KB-84:
 * - 1 record per cornerstone with kind:'cornerstone-page'
 * - 1 rich-text block with the body as a minimal Lexical state
 * - Metadata hardcoded (files have no YAML frontmatter)
 * - editorialState 'D' (ready) — V3 audits previously verified
 * - Re-runnable: detects existing slug, updates instead of duplicates
 *
 * Locale: creates ES content. EN is left for manual admin entry.
 *
 * Usage: pnpm tsx src/scripts/seed-cornerstones.ts
 */

import * as fs from 'fs';
import * as path from 'path';

import { getPayload } from 'payload';

import config from '../payload.config';

const CORNERSTONES_DIR =
  '/Volumes/PK/BBF/Repos/bbf-docs/04-strategic/web-public/Content/cornerstones';

const CORNERSTONE_FILES = [
  {
    file: 'BBF_CS-01_Home_DraftV3.md',
    code: 'CS-01',
    slugEs: 'home',
    slugEn: 'home',
    titleEs: 'Sivar Brains',
    titleEn: 'Sivar Brains',
    excerptEs:
      'BBF construye cerebros de marca: estructuras de conocimiento que hacen que una marca piense, recuerde y actúe con coherencia.',
    excerptEn:
      'BBF builds brand brains: knowledge structures that make a brand think, remember, and act with coherence.',
  },
  {
    file: 'BBF_CS-02_QueEsCerebroMarca_DraftV3.md',
    code: 'CS-02',
    slugEs: 'que-es-cerebro-marca',
    slugEn: 'what-is-brand-brain',
    titleEs: 'Qué es un cerebro de marca',
    titleEn: 'What is a brand brain',
    excerptEs:
      'Un cerebro de marca es una estructura de conocimiento que organiza todo lo que una marca sabe de sí misma para que pueda actuar con coherencia.',
    excerptEn:
      'A brand brain is a knowledge structure that organizes everything a brand knows about itself so it can act with coherence.',
  },
  {
    file: 'BBF_CS-03_MetodoBBF_DraftV3.md',
    code: 'CS-03',
    slugEs: 'como-trabajamos',
    slugEn: 'how-we-work',
    titleEs: 'Cómo trabajamos',
    titleEn: 'How we work',
    excerptEs:
      'El método BBF construye el cerebro de tu marca en tres fases: Mapeo, Estructura y Activación. Sin filler. Sin frameworks genéricos.',
    excerptEn:
      'The BBF method builds your brand brain in three phases: Mapping, Structure and Activation. No filler. No generic frameworks.',
  },
  {
    file: 'BBF_CS-04_CasoSivarBrains_DraftV3_5.md',
    code: 'CS-04',
    slugEs: 'casos-construidos',
    slugEn: 'built-cases',
    titleEs: 'Casos construidos',
    titleEn: 'Built cases',
    excerptEs:
      'Sivar Brains: cómo una productora audiovisual pasó de comunicar proyectos a articular su posición en la industria como empresa de conocimiento.',
    excerptEn:
      'Sivar Brains: how an audiovisual production company went from communicating projects to articulating its position in the industry as a knowledge company.',
  },
];

type LexicalFormat = '' | 'left' | 'start' | 'center' | 'right' | 'end' | 'justify';
type LexicalNode = { [k: string]: unknown; type: unknown; version: number };
type LexicalState = {
  root: {
    type: string;
    format: LexicalFormat;
    indent: number;
    version: number;
    direction: 'ltr' | 'rtl' | null;
    children: LexicalNode[];
  };
};

/** Converts raw markdown text into a minimal Lexical editor state JSON. */
function markdownToLexicalState(markdown: string): LexicalState {
  const lines = markdown.split('\n');
  const children: LexicalNode[] = [];

  for (const line of lines) {
    const trimmed = line.trimEnd();
    children.push({
      type: 'paragraph',
      format: '' as LexicalFormat,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      textFormat: 0,
      children:
        trimmed.length > 0
          ? [
              {
                type: 'text',
                format: 0,
                style: '',
                version: 1,
                detail: 0,
                mode: 'normal',
                text: trimmed,
              },
            ]
          : [],
    });
  }

  return {
    root: {
      type: 'root',
      format: '' as LexicalFormat,
      indent: 0,
      version: 1,
      direction: 'ltr',
      children,
    },
  };
}

async function seedCornerstones() {
  const payload = await getPayload({ config });

  console.log('🌱 M6-A2 Cornerstones seed starting...');
  console.log('Approach: bulk migrate metadata + 1 rich-text block per cornerstone');
  console.log('Refine of discriminated blocks: manual post-migrate in admin\n');

  // 1. Ensure entity 'zavala' exists (required author — CI-INV-01)
  const zavalaResults = await payload.find({
    collection: 'entities',
    where: { slug: { equals: 'zavala' } },
    limit: 1,
  });

  let zavalaId: string | number;
  if (zavalaResults.docs.length === 0) {
    console.log('Creating entity: zavala (person)...');
    // @ts-justify: Payload Local API overload inference issue with locale + partial entity data in seed scripts
    const zavala = await payload.create({
      collection: 'entities',
      overrideAccess: true,
      data: {
        slug: 'zavala',
        kind: 'person' as const,
        name: 'Christian Zavala',
        description:
          'Fundador de Sivar Brains y Brand Brain Foundry. Construye cerebros de marca con arquitectura hub-and-spoke.',
        person: {
          jobTitle: 'Fundador',
        },
      },
    } as Parameters<typeof payload.create>[0]);
    // Add EN description
    await payload.update({
      collection: 'entities',
      id: zavala.id,
      locale: 'en',
      data: {
        description:
          'Founder of Sivar Brains and Brand Brain Foundry. Builds brand brains with hub-and-spoke architecture.',
        person: {
          jobTitle: 'Founder',
        },
      },
    });
    zavalaId = zavala.id;
    console.log(`  ✓ Created entity zavala (id: ${zavalaId})\n`);
  } else {
    zavalaId = zavalaResults.docs[0].id;
    console.log(`  ✓ Entity zavala already exists (id: ${zavalaId})\n`);
  }

  // 2. Process each cornerstone
  for (const cs of CORNERSTONE_FILES) {
    console.log(`📄 Processing ${cs.code}: ${cs.titleEs}...`);

    const mdPath = path.join(CORNERSTONES_DIR, cs.file);

    if (!fs.existsSync(mdPath)) {
      console.error(`  ✗ File not found: ${mdPath}`);
      continue;
    }

    const bodyMarkdown = fs.readFileSync(mdPath, 'utf-8');
    const lexicalState = markdownToLexicalState(bodyMarkdown);

    const blocks = [
      {
        blockType: 'rich-text' as const,
        body: lexicalState,
      },
    ];

    const esData = {
      slug: cs.slugEs,
      kind: 'cornerstone-page' as const,
      title: cs.titleEs,
      excerpt: cs.excerptEs,
      blocks,
      authors: [zavalaId],
      editorialState: 'D' as const,
      aiGenerated: false,
      audits: {
        aud01_informationGain: {
          passed: true,
          score: 8,
          note: 'V3 verified — see DraftV3 metadata',
        },
        aud02_eeat: { passed: true, note: 'V3 verified' },
        aud03_geoChecklist: { passed: true, note: 'V3 verified' },
        aud04_voiceBbf: { passed: true, note: 'V3 voice audit passed' },
        aud05_schema: { passed: true, note: 'Article + Organization/CaseStudy as applicable' },
        aud06_antipatterns: { passed: true, note: 'V3 antipatrones audit passed' },
        aud07_copyEdit: { passed: true, note: 'V3 copy edit complete' },
      },
    };

    // Check for existing record (re-runnable — D-KB-84)
    const existing = await payload.find({
      collection: 'contentItems',
      locale: 'es',
      where: {
        and: [{ slug: { equals: cs.slugEs } }, { kind: { equals: 'cornerstone-page' } }],
      },
      limit: 1,
    });

    let docId: string | number;

    if (existing.docs.length > 0) {
      docId = existing.docs[0].id;
      console.log(`  ⟳ Updating existing ContentItem (id: ${docId})...`);
      await payload.update({
        collection: 'contentItems',
        id: docId,
        locale: 'es',
        data: esData,
      });
      console.log(`  ✓ ${cs.code} updated (ES)\n`);
    } else {
      console.log(`  + Creating new ContentItem...`);
      const created = await payload.create({
        collection: 'contentItems',
        locale: 'es',
        data: esData,
      });
      docId = created.id;
      console.log(`  ✓ ${cs.code} created (id: ${docId}, ES)\n`);
    }

    // Set EN slug + title (content body left for manual translation)
    await payload.update({
      collection: 'contentItems',
      id: docId,
      locale: 'en',
      data: {
        slug: cs.slugEn,
        title: cs.titleEn,
        excerpt: cs.excerptEn,
      },
    });
    console.log(`  ✓ ${cs.code} EN slug/title set\n`);
  }

  console.log('🎉 M6-A2 seed complete.');
  console.log('Next: Zavala refines discriminated blocks manually in /admin');
  process.exit(0);
}

seedCornerstones().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
