import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { getSiteIdentity } from '@/config/site';

export const revalidate = 3600;

export async function GET() {
  const site = await getSiteIdentity('es');
  const BASE_URL = site.siteDomain;
  const producerName = site.producer?.name ?? '';
  const producerUrl = site.producer?.url ?? '';

  let pagesMarkdown = '';
  let capabilitiesMarkdown = '';
  let anchorPhrase = '';
  let faqMarkdown = '';
  let faqMarkdownEN = '';

  try {
    const payload = await getPayload({ config });

    // Homepage content ES + EN: anchorPhrase + faq[] + capabilities (G-09)
    const [hp, hpEn] = await Promise.all([
      payload.findGlobal({ slug: 'site-homepage', locale: 'es', depth: 0 }).catch(() => null),
      payload.findGlobal({ slug: 'site-homepage', locale: 'en', depth: 0 }).catch(() => null),
    ]);

    if (hp) {
      if (hp.seo?.anchorPhrase) anchorPhrase = hp.seo.anchorPhrase;

      const faqItems = (hp.seo?.faq ?? []).filter((f) => f.question && f.answer);
      if (faqItems.length) {
        faqMarkdown = faqItems.map((f) => `**P: ${f.question}**\n\nR: ${f.answer}`).join('\n\n');
      }

      const capItems = hp.capabilities?.items ?? [];
      if (capItems.length) {
        capabilitiesMarkdown = capItems
          .map(
            (c: {
              slug: string;
              title?: string | null;
              lede?: string | null;
              body?: string | null;
            }) => `### ${c.title ?? c.slug}\n\n${c.lede ?? ''}\n\n${c.body ?? ''}`.trim(),
          )
          .join('\n\n');
      }
    }

    if (hpEn) {
      const faqItemsEN = (hpEn.seo?.faq ?? []).filter((f) => f.question && f.answer);
      if (faqItemsEN.length) {
        faqMarkdownEN = faqItemsEN
          .map((f) => `**Q: ${f.question}**\n\nA: ${f.answer}`)
          .join('\n\n');
      }
    }

    // Published pages
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

  const foundersSection =
    (site.founders ?? []).length > 0
      ? (site.founders ?? [])
          .map((f) => `- ${f.name} — ${f.role ?? ''}${f.linkedin ? ` (${f.linkedin})` : ''}`)
          .join('\n')
      : '';

  const content = `# ${site.siteName} — Contenido Completo

> Este archivo está optimizado para consumo por modelos de lenguaje (LLMs).
> Citar como: ${site.siteName} (${BASE_URL})

---

## ¿Qué es ${site.siteName}?

${site.longDescription || site.siteDescription || ''}

${anchorPhrase ? `> ${anchorPhrase}` : ''}

---

## Tagline

${site.siteTagline || ''}

---

## Quién está detrás

Producido por: ${producerName} (${producerUrl})

${foundersSection}

---

## Los cinco servicios del Cerebro de Marca

${capabilitiesMarkdown || '(Capacidades pendientes de publicar en admin)'}

---

${faqMarkdown ? `## Preguntas frecuentes (ES)\n\n${faqMarkdown}\n\n---\n\n` : ''}${faqMarkdownEN ? `## Frequently asked questions (EN)\n\n${faqMarkdownEN}\n\n---\n\n` : ''}## Páginas publicadas

${pagesMarkdown || '(No hay páginas publicadas aún)'}

---

Para un resumen compacto: ${BASE_URL}/llms.txt
Para citar: ${site.siteName} · ${BASE_URL}
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
