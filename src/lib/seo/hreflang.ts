const BASE_URL = 'https://brandbrainfoundry.com';

type Locale = 'es' | 'en';

/**
 * Build hreflang alternates for Next.js Metadata API.
 *
 * Para paths idénticos en ambos idiomas (ej. /contacto → /en/contacto).
 */
export function buildHreflang(currentPath: string, currentLocale: Locale) {
  const pathWithoutLocale = currentPath.replace(/^\/en/, '') || '/';

  const esUrl = `${BASE_URL}${pathWithoutLocale}`;
  const enUrl = `${BASE_URL}/en${pathWithoutLocale === '/' ? '' : pathWithoutLocale}`;

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
  prefix: string = '',
) {
  const esUrl = `${BASE_URL}${prefix}/${slugMap.es}`;
  const enUrl = `${BASE_URL}/en${prefix}/${slugMap.en}`;

  return {
    canonical: currentLocale === 'en' ? enUrl : esUrl,
    languages: {
      es: esUrl,
      en: enUrl,
      'x-default': esUrl,
    },
  };
}
