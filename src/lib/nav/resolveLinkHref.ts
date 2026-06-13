import { getPathname } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

/**
 * Resuelve un linkTarget polimórfico (D-NAV-8/C) a un href localizado completo.
 *
 * FASE 4.C.1 L2. Usa next-intl getPathname → respeta localePrefix 'as-needed' (D-NAV-7)
 * + pathnames traducidos (D-BBF-WEB-52): routeKey '/cerebro-marca' → ES '/cerebro-marca',
 * EN '/en/brand-brain'. Reemplaza el concat `${localePrefix}${href}` (causa del EN-404).
 *
 *   routeKey → ruta canónica file-based (SSOT routing.ts pathnames). Rama activa.
 *   page     → página dinámica (page.path). DORMIDO hasta primera Page; getPathname
 *              le aplica prefijo de locale como ruta literal.
 */
type LinkTargetInput =
  | {
      routeKey?: string | null;
      page?: { path?: string | null } | string | number | null;
    }
  | null
  | undefined;

type GetPathnameHref = Parameters<typeof getPathname>[0]['href'];

export function resolveLinkHref(target: LinkTargetInput, locale: Locale, fallback = '/'): string {
  const routeKey = target?.routeKey;
  if (routeKey) {
    return getPathname({ locale, href: routeKey as GetPathnameHref });
  }
  const page = target?.page;
  const path = page && typeof page === 'object' ? (page.path ?? null) : null;
  if (path) {
    return getPathname({ locale, href: path as GetPathnameHref });
  }
  return fallback;
}
