import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { getSiteIdentity } from '@/config/site';

export const revalidate = 3600;

export async function GET() {
  const site = await getSiteIdentity('es');
  const BASE_URL = site.siteDomain;
  const producerName = site.producer?.name ?? 'Brand Brain Foundry';
  const producerUrl = site.producer?.url ?? 'https://brandbrainfoundry.com';
  const founderName = site.founder?.name ?? 'Christian Zavala';
  const founderUrl = site.founder?.url ?? producerUrl;

  let pagesMarkdown = '';

  try {
    const payload = await getPayload({ config });

    // @ts-justify: pages pending payload generate:types
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
          return `## ${page.title}\n\nURL: ${BASE_URL}/${page.path}\n\n${meta?.description || ''}\n\n---`;
        })
        .join('\n\n');
    }
  } catch {
    // graceful degradation
  }

  const content = `# ${site.siteName} — Full Content

${site.siteDescription}

Foundry: ${producerName} (${producerUrl})
Founder: ${founderName} (${founderUrl})

---

${pagesMarkdown || '(No published pages yet)'}
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
