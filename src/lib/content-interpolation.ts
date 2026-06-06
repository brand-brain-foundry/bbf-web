import { getSiteIdentity } from '@/config/site';

/**
 * interpolate — reemplaza placeholders {{var}} en texto editorial Payload
 * por valores de SiteIdentity (Entity Identity — single source of truth).
 *
 * Uso editorial en admin Payload:
 *   "Bienvenido a {{siteName}}. {{siteTagline}}."
 *   → "Bienvenido a Sivar Brains. Cerebros de marca operacionales."
 *
 * NOTA: helper async — usar SOLO en Server Components.
 * Para Client Components, pre-interpolar y pasar como prop desde el padre.
 *
 * Placeholders disponibles:
 * @see {@link INTERPOLATION_PLACEHOLDERS}
 */
export async function interpolate(
  text: string | null | undefined,
  locale: 'es' | 'en' = 'es',
): Promise<string> {
  if (!text) return '';
  if (!text.includes('{{')) return text; // fast path — sin placeholders

  const site = await getSiteIdentity(locale);

  return text
    .replace(/\{\{siteName\}\}/g, site.siteName ?? '')
    .replace(/\{\{siteShortName\}\}/g, site.siteShortName ?? site.siteName ?? '')
    .replace(/\{\{siteTagline\}\}/g, site.siteTagline ?? '')
    .replace(/\{\{siteDescription\}\}/g, site.siteDescription ?? '')
    .replace(/\{\{longDescription\}\}/g, site.longDescription ?? '')
    .replace(/\{\{siteDomain\}\}/g, site.siteDomain ?? '')
    .replace(/\{\{founderName\}\}/g, site.founder?.name ?? '')
    .replace(/\{\{producerName\}\}/g, site.producer?.name ?? '')
    .replace(/\{\{currentYear\}\}/g, String(new Date().getFullYear()));
}

/**
 * Interpolación batch — para arrays de strings.
 */
export async function interpolateAll(
  texts: (string | null | undefined)[],
  locale: 'es' | 'en' = 'es',
): Promise<string[]> {
  return Promise.all(texts.map((t) => interpolate(t, locale)));
}

/** Referencia de todos los placeholders disponibles (para documentación y validación) */
export const INTERPOLATION_PLACEHOLDERS = [
  '{{siteName}}',
  '{{siteShortName}}',
  '{{siteTagline}}',
  '{{siteDescription}}',
  '{{longDescription}}',
  '{{siteDomain}}',
  '{{founderName}}',
  '{{producerName}}',
  '{{currentYear}}',
] as const;

export type InterpolationPlaceholder = (typeof INTERPOLATION_PLACEHOLDERS)[number];
