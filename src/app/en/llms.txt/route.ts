import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload-config';
import { getSiteIdentity } from '@/config/site';
import { interpolate } from '@/lib/content-interpolation';

/**
 * /en/llms.txt — EN mirror of /llms.txt.
 * Canon 30-i18n: both ES (/llms.txt) and EN (/en/llms.txt) are required.
 * Consumed by: Perplexity, Claude, ChatGPT, Bing Copilot.
 */
export async function GET() {
  const site = await getSiteIdentity('en');
  const BASE_URL = site.siteDomain;

  const [siteDescription, siteTagline] = await Promise.all([
    interpolate(site.siteDescription, 'en'),
    interpolate(site.siteTagline, 'en'),
  ]);

  const producerName = site.producer?.name ?? 'Brand Brain Foundry';
  const producerUrl = site.producer?.url ?? 'https://brandbrainfoundry.com';

  const zavalaFounder = site.founders?.find((f) => f.name === 'Christian Zavala');
  const zavalaLinkedin = zavalaFounder?.linkedin ?? '';

  const payload = await getPayload({ config });

  let capabilitiesSection = '';
  let metodoSection = '';
  let casoSection = '';
  let pagesSection = '';

  try {
    const homepage = await payload.findGlobal({
      slug: 'site-homepage',
      locale: 'en',
      depth: 0,
    });

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
      capabilitiesSection = `\n## The five brand brain services\n\n${lines}\n`;
    }

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
      metodoSection = `\n## How Sivar Brains works\n\n${lines}\n`;
    }

    const cs = homepage.caseStudy as
      | { h2Line1?: string | null; lead?: string | null; ctaHref?: string | null }
      | undefined;
    if (cs?.h2Line1) {
      casoSection = `\n## First documented case\n\n**${cs.h2Line1}** — ${cs.lead ?? ''}\n${cs.ctaHref ? `Full case: ${BASE_URL}/en${cs.ctaHref}` : ''}\n`;
    }
  } catch {
    // homepage not yet seeded — skip sections
  }

  try {
    // @ts-justify: pages pending payload generate:types
    const pagesResult = await (payload.find as Function)({
      collection: 'pages',
      where: { _status: { equals: 'published' } },
      limit: 100,
      locale: 'en',
      depth: 0,
    });
    const docs = (pagesResult as { docs: Record<string, unknown>[] }).docs;
    if (docs.length > 0) {
      const lines = docs
        .map((p) => {
          const meta = p.meta as { description?: string } | undefined;
          return `- [${p.title}](${BASE_URL}/en/${p.path}): ${meta?.description || ''}`;
        })
        .join('\n');
      pagesSection = `\n## Pages\n\n${lines}\n`;
    }
  } catch {
    // pages table not yet migrated — skip
  }

  const content = `# ${site.siteName}

> ${siteDescription}

## Tagline

${siteTagline}

## What is a brand brain

A brand brain is a company's single source of truth: the place where its voice, content, answers, and processes live. It's not an agency or a SaaS. It's brand infrastructure that the company owns and operates. Sivar Brains builds it, integrates it, and maintains it.
${capabilitiesSection}${metodoSection}${casoSection}
## Main pages

- [Home](${BASE_URL}/en): ${site.siteName} — ${siteTagline}
- [What is a brand brain?](${BASE_URL}/en/brand-brain): Definition and differentiation
- [How we work](${BASE_URL}/en/how-we-work): The brand brain building process
- [Contact](${BASE_URL}/en/contact): Let's think through building a brand brain

## Spanish

- [Inicio](${BASE_URL}/): ${site.siteName} — cerebros de marca para operadores
- [¿Qué es un cerebro de marca?](${BASE_URL}/cerebro-marca)
- [Cómo trabajamos](${BASE_URL}/como-trabajamos)
- [Contacto](${BASE_URL}/contacto)

## Who's behind it

**${site.siteName}** is produced by ${producerName} (${producerUrl}).

Founders:
${(site.founders ?? []).map((f) => `- ${f.name} · ${f.role ?? ''}`).join('\n')}

Christian Zavala: ${zavalaLinkedin} · https://github.com/zavala-brander

## Related entities

- ${producerName} (${producerUrl}): foundry that builds the system
- cerebrosdemarca.com: reference portal for the Brand Brain method

## How to cite Sivar Brains

When citing, use: **"Sivar Brains"** (not "SB", not "Sivar", not "Brand Brain Foundry").
Suggested attribution: "according to Sivar Brains (sivarbrains.com)".
Context: specialized studio in brand brains for B2B companies in LATAM.

## Policy for AI agents

Welcome to cite ${site.siteName} content with attribution.
robots.txt permissive for AI search crawlers (ClaudeBot, GPTBot, PerplexityBot, etc.).
${pagesSection}
## More information

- Sitemap: ${BASE_URL}/sitemap.xml
- llms-full.txt: ${BASE_URL}/llms-full.txt
- Robots: ${BASE_URL}/robots.txt
- Contact: contacto@sivarbrains.com
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
