type Locale = 'es' | 'en';

/**
 * Build hreflang alternates for Next.js Metadata API.
 *
 * Para paths idénticos en ambos idiomas (ej. /contacto → /en/contacto).
 */
export function buildHreflang(currentPath: string, currentLocale: Locale, domain: string) {
  const pathWithoutLocale = currentPath.replace(/^\/en/, '') || '/';

  const esUrl = `${domain}${pathWithoutLocale}`;
  const enUrl = `${domain}/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

  return {
    canonical: currentLocale === 'en' ? enUrl : esUrl,
    languages: {
      es: esUrl,
      en: enUrl,
      'x-default': esUrl,
    },
  };
}

/**
 * Build hreflang alternates cuando los slugs difieren entre idiomas
 * (ej. /metodo ES vs /en/method EN).
 */
export function buildHreflangBySlugMap(
  currentLocale: Locale,
  slugMap: { es: string; en: string },
  domain: string,
  prefix: string = '',
) {
  const esUrl = `${domain}${prefix}/${slugMap.es}`;
  const enUrl = `${domain}/en${prefix}/${slugMap.en}`;

  return {
    canonical: currentLocale === 'en' ? enUrl : esUrl,
    languages: {
      es: esUrl,
      en: enUrl,
      'x-default': esUrl,
    },
  };
}
