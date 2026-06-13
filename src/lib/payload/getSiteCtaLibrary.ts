import { getPayload } from 'payload';

import config from '@/payload-config';

/**
 * Helpers para SiteCtaLibrary (D-DS-18, D-NAV-11).
 *
 * getCtaByKey: SSOT consumer — dado un key canónico, devuelve el CTA
 * con label localizado + type + intent. El linkTarget es responsabilidad
 * del caller (contexto-específico).
 */
export async function getSiteCtaLibrary(locale: 'es' | 'en' = 'es') {
  const payload = await getPayload({ config });
  return payload.findGlobal({ slug: 'site-cta-library', locale, depth: 0 });
}

export async function getCtaByKey(key: string, locale: 'es' | 'en' = 'es') {
  const library = await getSiteCtaLibrary(locale);
  return library.items?.find((item) => item.key === key) ?? null;
}
