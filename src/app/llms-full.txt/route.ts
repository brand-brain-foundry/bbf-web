import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload-config';

const BASE_URL = 'https://brandbrainfoundry.com';

export const revalidate = 3600;

export async function GET() {
  let siteName = 'Brand Brain Foundry';
  let brandSummary = '';
  let pagesMarkdown = '';

  try {
    const payload = await getPayload({ config });

    const identity = await payload
      .findGlobal({ slug: 'site-identity', locale: 'es' })
      .catch(() => null);
    if (identity) {
      const id = identity as unknown as Record<string, unknown>;
      if (typeof id.siteName === 'string') siteName = id.siteName;
      if (typeof id.shortDescription === 'string') brandSummary = id.shortDescription;
    }

    // Try seo-defaults for brand summary override (T3 pending)
    // @ts-justify: seo-defaults pending T3 escalation resolution
    const seoDefaults = await (payload.findGlobal as Function)({
      slug: 'seo-defaults',
      locale: 'es',
      depth: 0,
    }).catch(() => null);
    if (seoDefaults) {
      const s = seoDefaults as unknown as Record<string, unknown>;
      const aiSearch = s.aiSearch as Record<string, unknown> | undefined;
      if (typeof aiSearch?.llmsTxtBrandSummary === 'string') {
        brandSummary = aiSearch.llmsTxtBrandSummary;
      }
    }

    // Pages collection
    // @ts-justify: pages pending payload generate:types — Wave 12-A
    const pagesResult = await (payload.find as Function)({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 1000,
      locale: 'es',
      depth: 1,
    }).catch(() => null);

    const pageDocs = (pagesResult as { docs: Record<string, unknown>[] } | null)?.docs ?? [];
    if (pageDocs.length) {
      pagesMarkdown = pageDocs
        .map((page) => {
          const meta = page.meta as { description?: string } | undefined;
          return `## ${page.title}\n\nURL: ${BASE_URL}/es/${page.path}\n\n${meta?.description || ''}\n\n---`;
        })
        .join('\n\n');
    }
  } catch {
    // graceful degradation
  }

  const content = `# ${siteName} — Full Content

${brandSummary}

---

${pagesMarkdown || '(No published pages yet — check back after Wave 13+)'}
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
