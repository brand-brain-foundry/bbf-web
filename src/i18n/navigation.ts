import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

/**
 * Navigation APIs canon next-intl — wrappers tipados con routing config.
 *
 * Estos hooks reemplazan los genéricos de next/navigation cuando se
 * necesita respetar:
 * - `localePrefix: 'as-needed'` (ES sin prefijo, EN con /en/)
 * - `pathnames` localizados (D-BBF-WEB-52)
 * - Cookie NEXT_LOCALE persistente automática
 *
 * Uso típico en Client Components que navegan entre locales:
 *
 *   'use client';
 *   import { usePathname, useRouter } from '@/i18n/navigation';
 *   import { useParams } from 'next/navigation';
 *
 *   const router = useRouter();
 *   const pathname = usePathname();
 *   const params = useParams();
 *
 *   // Cambiar a locale específico preservando ruta actual:
 *   router.replace({ pathname, params }, { locale: 'en' });
 *
 * Referencias:
 * - next-intl.dev/docs/routing/navigation
 * - next-intl.dev/docs/routing/setup
 * - D-BBF-WEB-49..54 firmadas
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);
