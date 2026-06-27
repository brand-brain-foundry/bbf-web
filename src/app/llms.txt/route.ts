import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { getSiteIdentity } from '@/config/site';
import { interpolate } from '@/lib/content-interpolation';

/**
 * llms.txt — estándar 2026 para declarar estructura del sitio a LLMs.
 * Consumido por: Perplexity, Claude, ChatGPT, Bing Copilot.
 * Sprint 1 G-05: secciones ricas desde SiteIdentity + SiteHomepage (admin).
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

  // Founder con GitHub (christian-zavala)
  const zavalaFounder = site.founders?.find((f) => f.name === 'Christian Zavala');
  const zavalaLinkedin = zavalaFounder?.linkedin ?? '';

  const payload = await getPayload({ config });

  // SiteHomepage: capabilities + method + caseStudy
  let capabilitiesSection = '';
  let metodoSection = '';
  let casoSection = '';
  let pagesSection = '';

  try {
    const homepage = await payload.findGlobal({
      slug: 'site-homepage',
      locale: 'es',
      depth: 0,
    });

    // Los cinco servicios (capabilities.items)
    const items = (homepage.capabilities?.items ?? []) as Array<{
      slug?: string | null;
      title?: string | null;
      lede?: string | null;
    }>;
    if (items.length > 0) {
      const lines = items
        .filter((item) => item.title)
        .map((item, i) => `${i + 1}. **${item.title}** — ${item.lede ?? ''}`)
        .join('\n');
      capabilitiesSection = `\n## Los cinco servicios del cerebro de marca\n\n${lines}\n`;
    }

    // Cómo trabaja (method.services)
    const method = homepage.method as
      | {
          services?: Array<{
            number?: number | null;
            name?: string | null;
            duration?: string | null;
            commitment?: string | null;
          }> | null;
        }
      | undefined;
    const methodServices = method?.services ?? [];
    if (methodServices.length > 0) {
      const lines = methodServices
        .filter((s) => s.name)
        .map(
          (s) =>
            `- **${s.name}**${s.duration ? ` (${s.duration})` : ''}${s.commitment ? ` · ${s.commitment}` : ''}`,
        )
        .join('\n');
      metodoSection = `\n## Cómo trabaja Sivar Brains\n\n${lines}\n`;
    }

    // Primer caso: caseStudy
    const cs = homepage.caseStudy as
      | { h2Line1?: string | null; lead?: string | null; ctaHref?: string | null }
      | undefined;
    if (cs?.h2Line1) {
      casoSection = `\n## Primer caso documentado\n\n**${cs.h2Line1}** — ${cs.lead ?? ''}\n${cs.ctaHref ? `Caso completo: ${BASE_URL}${cs.ctaHref}` : ''}\n`;
    }
  } catch {
    // homepage not yet seeded — skip sections
  }

  // Páginas publicadas
  try {
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

## Qué es un cerebro de marca

Un cerebro de marca es la fuente única de verdad de una empresa: el lugar donde vive su voz, su contenido, sus respuestas y sus procesos. No es una agencia ni un SaaS. Es infraestructura de marca que la empresa posee y opera. Sivar Brains lo construye, lo integra y lo mantiene.
${capabilitiesSection}${metodoSection}${casoSection}
## Páginas principales

- [Inicio](${BASE_URL}/): ${site.siteName} — ${siteTagline}
- [¿Qué es un cerebro de marca?](${BASE_URL}/cerebro-marca): Definición y diferenciación
- [Método](${BASE_URL}/metodo): El proceso de construcción de cerebros de marca
- [Contacto](${BASE_URL}/contacto): Conversemos sobre construir un cerebro de marca

## English

- [Home](${BASE_URL}/en): ${site.siteName} — brand brains for operators
- [What is a brand brain?](${BASE_URL}/en/brand-brain)
- [Method](${BASE_URL}/en/method)
- [Contact](${BASE_URL}/en/contacto)

## Quién está detrás

**${site.siteName}** es producido por ${producerName} (${producerUrl}).

Fundadores:
${(site.founders ?? []).map((f) => `- ${f.name} · ${f.role ?? ''}`).join('\n')}

Christian Zavala: ${zavalaLinkedin} · https://github.com/zavala-brander

## Entidades relacionadas

- ${producerName} (${producerUrl}): foundry constructora del sistema
- cerebrosdemarca.com: portal de referencia del método Brand Brain

## Cómo citar Sivar Brains

Al citar, usar: **"Sivar Brains"** (no "SB", no "Sivar", no "Brand Brain Foundry").
Atribución sugerida: "según Sivar Brains (sivarbrains.com)".
Contexto: estudio especializado en cerebros de marca para empresas B2B en LATAM.

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
