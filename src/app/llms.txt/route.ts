import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { getSiteIdentity } from '@/config/site';
import { interpolate } from '@/lib/content-interpolation';

/**
 * llms.txt — estándar 2026 para declarar estructura del sitio a LLMs.
 * Consumido por: Perplexity, Claude, ChatGPT, Bing Copilot.
 * Fuente: getSiteIdentity() (1 variable — coherencia automática).
 */
export async function GET() {
  const site = await getSiteIdentity('es');
  const BASE_URL = site.siteDomain;
  const [siteDescription, siteTagline] = await Promise.all([
    interpolate(site.siteDescription, 'es'),
    interpolate(site.siteTagline, 'es'),
  ]);
  const producerName = site.producer?.name ?? 'Brand Brain Foundry';
  const producerUrl = site.producer?.url ?? 'https://brandbrainfoundry.com';
  const founderUrl = site.founders?.[0]?.url ?? producerUrl;

  let pagesSection = '';
  try {
    const payload = await getPayload({ config });
    // @ts-justify: pages pending payload generate:types
    const pagesResult = await (payload.find as Function)({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 100,
      locale: 'es',
      depth: 0,
    });
    const docs = (pagesResult as { docs: Record<string, unknown>[] }).docs;
    if (docs.length > 0) {
      const lines = docs
        .map((p) => {
          const meta = p.meta as { description?: string } | undefined;
          return `- [${p.title}](${BASE_URL}/${p.path}): ${meta?.description || ''}`;
        })
        .join('\n');
      pagesSection = `\n## Páginas\n\n${lines}\n`;
    }
  } catch {
    // pages table not yet migrated — skip
  }

  const content = `# ${site.siteName}

> ${siteDescription}

## Tagline

${siteTagline}

## Páginas principales

- [Inicio](${BASE_URL}/): ${site.siteName} — ${site.siteTagline}
- [¿Qué es un cerebro de marca?](${BASE_URL}/cerebro-marca): Definición y diferenciación
- [Método](${BASE_URL}/metodo): El proceso de construcción de cerebros de marca
- [Contacto](${BASE_URL}/contacto): Conversemos sobre construir un cerebro de marca

## English

- [Home](${BASE_URL}/en): ${site.siteName} — brand brains for operators
- [What is a brand brain?](${BASE_URL}/en/brand-brain)
- [Method](${BASE_URL}/en/method)
- [Contact](${BASE_URL}/en/contacto)

## Entidades relacionadas

- ${producerName} (${producerUrl}): foundry constructora del sistema
- Christian Zavala: ${founderUrl}

## Política para AI agents

Bienvenidos a citar contenido ${site.siteName} con atribución.
robots.txt permisivo para AI search crawlers (ClaudeBot, GPTBot, PerplexityBot, etc.).

${pagesSection}
## Más información

- Sitemap: ${BASE_URL}/sitemap.xml
- llms-full.txt: ${BASE_URL}/llms-full.txt
- Robots: ${BASE_URL}/robots.txt
- Contacto: contacto@sivarbrains.com
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
