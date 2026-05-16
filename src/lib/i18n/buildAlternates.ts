import type { Metadata } from 'next';

/**
 * Tipo para data localized de Payload.
 * Aplicable a ContentItems, Clusters, etc.
 */
type LocalizedData = {
  slug?: { es?: string; en?: string } | null;
  title?: { es?: string; en?: string } | null;
};

type BuildAlternatesParams = {
  /** Data desde Payload con campos localized */
  data: LocalizedData;
  /** Path prefix opcional (e.g. 'casos/', 'blog/') */
  pathPrefix?: { es?: string; en?: string };
  /** Locale actual de la request */
  currentLocale: string;
};

/**
 * buildAlternates — construye campo alternates de Metadata desde Payload data.
 *
 * Implementa D-BBF-WEB-54: alternateLinks: false en routing.ts →
 * generación manual de hreflang desde data, respetando contenido
 * parcialmente bilingüe (algunos items solo en ES inicialmente).
 *
 * Reglas:
 * - Solo incluye locale en alternates si data tiene slug + title en ese locale
 * - x-default apunta a ES si existe, sino EN, sino raíz
 * - canonical apunta al locale actual
 *
 * Uso en generateMetadata de pages dinámicas:
 *   const data = await fetchFromPayload(slug, locale);
 *   return { ...otherMetadata, alternates: buildAlternates({ data, pathPrefix: { es: 'casos/', en: 'cases/' }, currentLocale: locale }) };
 */
export function buildAlternates({
  data,
  pathPrefix,
  currentLocale,
}: BuildAlternatesParams): NonNullable<Metadata['alternates']> {
  const hasES = Boolean(data?.title?.es && data?.slug?.es);
  const hasEN = Boolean(data?.title?.en && data?.slug?.en);

  const languages: Record<string, string> = {};

  if (hasES) {
    const esPath = pathPrefix?.es ?? '';
    languages.es = `/${esPath}${data.slug!.es}`;
  }

  if (hasEN) {
    const enPath = pathPrefix?.en ?? '';
    languages.en = `/en/${enPath}${data.slug!.en}`;
  }

  // x-default: prefer ES (default locale), fallback EN, fallback root
  languages['x-default'] = languages.es ?? languages.en ?? '/';

  const canonical = currentLocale === 'es' ? (languages.es ?? '/') : (languages.en ?? '/en');

  return { canonical, languages };
}

/**
 * buildAlternatesForStaticPage — variante para páginas estáticas conocidas
 * (cornerstones/pillars de PrimitiveTopologyCanon §4.3).
 *
 * Uso:
 *   alternates: buildAlternatesForStaticPage({ paths: { es: '/cerebro-marca', en: '/en/brand-brain' }, currentLocale: locale })
 */
export function buildAlternatesForStaticPage({
  paths,
  currentLocale,
}: {
  paths: { es: string; en: string };
  currentLocale: string;
}): NonNullable<Metadata['alternates']> {
  return {
    canonical: currentLocale === 'es' ? paths.es : paths.en,
    languages: {
      es: paths.es,
      en: paths.en,
      'x-default': paths.es,
    },
  };
}
