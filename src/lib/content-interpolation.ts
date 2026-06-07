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

/** "A", "A y B", "A, B y C" (es) / "A, B, and C" (en) */
function formatList(items: string[], locale: 'es' | 'en'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  const conj = locale === 'en' ? 'and' : 'y';
  if (items.length === 2) return `${items[0]} ${conj} ${items[1]}`;
  const last = items[items.length - 1];
  return `${items.slice(0, -1).join(', ')} ${conj} ${last}`;
}

export async function interpolate(
  text: string | null | undefined,
  locale: 'es' | 'en' = 'es',
): Promise<string> {
  if (!text) return '';
  if (!text.includes('{{')) return text; // fast path — sin placeholders

  const site = await getSiteIdentity(locale);
  const founders = site.founders ?? [];
  const founderNames = founders.map((f) => f.name ?? '').filter(Boolean);

  return text
    .replace(/\{\{siteName\}\}/g, site.siteName ?? '')
    .replace(/\{\{siteShortName\}\}/g, site.siteShortName ?? site.siteName ?? '')
    .replace(/\{\{siteTagline\}\}/g, site.siteTagline ?? '')
    .replace(/\{\{siteDescription\}\}/g, site.siteDescription ?? '')
    .replace(/\{\{longDescription\}\}/g, site.longDescription ?? '')
    .replace(/\{\{siteDomain\}\}/g, site.siteDomain ?? '')
    .replace(/\{\{founderName\}\}/g, founders[0]?.name ?? '')
    .replace(/\{\{foundersList\}\}/g, formatList(founderNames, locale))
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
  '{{foundersList}}',
  '{{producerName}}',
  '{{currentYear}}',
] as const;

export type InterpolationPlaceholder = (typeof INTERPOLATION_PLACEHOLDERS)[number];
