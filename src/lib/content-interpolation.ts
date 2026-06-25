import { getSiteIdentity } from '@/config/site';

/** "A", "A y B", "A, B y C" (es) / "A, B, and C" (en) */
function formatList(items: string[], locale: 'es' | 'en'): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  const conj = locale === 'en' ? 'and' : 'y';
  if (items.length === 2) return `${items[0]} ${conj} ${items[1]}`;
  const last = items[items.length - 1];
  return `${items.slice(0, -1).join(', ')} ${conj} ${last}`;
}

type SiteIdentityData = Awaited<ReturnType<typeof getSiteIdentity>>;

/**
 * makeReplacer — construye el replacer síncrono de placeholders {{var}}.
 * Recibe la identity ya resuelta (1 fetch externo) y devuelve una función
 * pura string → string reutilizable para cualquier número de campos.
 */
function makeReplacer(site: SiteIdentityData, locale: 'es' | 'en'): (s: string) => string {
  const founders = site.founders ?? [];
  const founderNames = founders.map((f) => f.name ?? '').filter(Boolean);
  const year = String(new Date().getFullYear());
  return (text: string): string => {
    if (!text.includes('{{')) return text; // fast-path — sin placeholders
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
      .replace(/\{\{currentYear\}\}/g, year);
  };
}

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
  if (!text.includes('{{')) return text;
  const site = await getSiteIdentity(locale);
  return makeReplacer(site, locale)(text);
}

/**
 * interpolateAll — batch de strings (array plano). Un fetch, N reemplazos.
 */
export async function interpolateAll(
  texts: (string | null | undefined)[],
  locale: 'es' | 'en' = 'es',
): Promise<string[]> {
  return Promise.all(texts.map((t) => interpolate(t, locale)));
}

/**
 * interpolateDeep — un solo fetch + pasada recursiva sobre un árbol de datos.
 * Todos los strings con {{ quedan resueltos en una sola pasada síncrona.
 *
 * Usar en page.tsx tras findGlobal para cubrir TODOS los campos del global
 * sin mantener una lista manual de cuáles interpolar.
 *
 * Los campos sin {{ (fast-path) pasan sin costo. Números, booleans, null,
 * objetos relacionados (Media.url, IDs) se devuelven intactos.
 */
export async function interpolateDeep<T>(data: T, locale: 'es' | 'en' = 'es'): Promise<T> {
  const site = await getSiteIdentity(locale);
  const replace = makeReplacer(site, locale);

  const walk = (v: unknown): unknown => {
    if (typeof v === 'string') return replace(v);
    if (Array.isArray(v)) return v.map(walk);
    if (v !== null && typeof v === 'object') {
      const out: Record<string, unknown> = {};
      for (const k of Object.keys(v as Record<string, unknown>)) {
        out[k] = walk((v as Record<string, unknown>)[k]);
      }
      return out;
    }
    return v; // number, boolean, null, undefined, Date → intactos
  };

  return walk(data) as T;
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
