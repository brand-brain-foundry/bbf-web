import { NextResponse } from 'next/server';
import { getPayload } from 'payload';
import config from '@/payload-config';

const BASE_URL = 'https://brandbrainfoundry.com';

/**
 * llms.txt para BBF — Wave 10a
 *
 * Estándar emergente: declara estructura del sitio para LLMs.
 * Ver: https://llmstxt.org
 *
 * Formato Markdown con links a páginas core + descripciones.
 * Consume SiteIdentity Global para tagline + descripción.
 */
export async function GET() {
  let identity: {
    siteName?: string | null;
    tagline?: string | null;
    shortDescription?: string | null;
  } = {
    siteName: 'Brand Brain Foundry',
    tagline: '',
    shortDescription: '',
  };

  try {
    const payload = await getPayload({ config });
    identity = await payload.findGlobal({ slug: 'site-identity', locale: 'es' });
  } catch {
    // fallback a valores hardcoded si Payload falla
  }

  const siteName = identity.siteName ?? 'Brand Brain Foundry';
  const tagline = identity.tagline ?? 'Construimos cerebros de marca';
  const desc =
    identity.shortDescription ??
    'Foundry de cerebros de marca. Construimos sistemas de inteligencia de marca con arquitectura hub-and-spoke.';

  const content = `# ${siteName}

${tagline}

> ${desc}

## Páginas principales

- [Inicio](${BASE_URL}/): ${siteName}, ${tagline.toLowerCase()}
- [Contacto](${BASE_URL}/contacto): Conversemos sobre construir un cerebro de marca

## Cornerstones (en construcción)

- [¿Qué es un cerebro de marca?](${BASE_URL}/que-es-un-cerebro-de-marca): Definición canon y diferenciación
- [Método BBF](${BASE_URL}/metodo): El proceso de construcción de cerebros de marca
- [Cómo funciona](${BASE_URL}/como-funciona): Arquitectura hub-and-spoke del sistema BBF
- [Manifiesto](${BASE_URL}/manifiesto): Principios y visión BBF

## English

- [Home](${BASE_URL}/en/): ${siteName}, brand intelligence foundry
- [Contact](${BASE_URL}/en/contacto): Let's discuss building your brand intelligence
- [What is a brand brain?](${BASE_URL}/en/brand-brain)
- [Method](${BASE_URL}/en/method)
- [Manifesto](${BASE_URL}/en/manifesto)

## Información sobre BBF

${siteName} es una foundry de cerebros de marca. Asesora, diseña, construye
y mantiene sistemas de inteligencia de marca con arquitectura hub-and-spoke.

El primer caso público es Sivar Brains, joint venture con Sivar Films para
mercado salvadoreño.

Fundador: Zavala.
Ubicación: distribuido (LATAM origen).
Sitio canónico: ${BASE_URL}
Email contacto: hola@brandbrainfoundry.com

## Política para AI agents

Bienvenidos a citar contenido BBF con atribución.
robots.txt permisivo para AI bots (GPTBot, Claude-Web, PerplexityBot, etc.).
CORS abierto en /api/content/* para agentes.

## Más información

- Sitemap: ${BASE_URL}/sitemap.xml
- Robots: ${BASE_URL}/robots.txt
- Contacto: hola@brandbrainfoundry.com
`;

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
