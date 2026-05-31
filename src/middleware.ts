import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

/**
 * Middleware canon BBF — i18n routing.
 *
 * Aplica:
 * - Detección locale según D-BBF-WEB-53
 * - Redirect /es/X → /X (localePrefix as-needed)
 * - Cookie NEXT_LOCALE 1 año TTL
 *
 * Matcher EXCLUYE:
 * - /api/* (Payload API routes)
 * - /admin/* (Payload admin — NO necesita i18n)
 * - /_next/* (Next.js internals)
 * - /_vercel/* (Vercel internals)
 * - Files con dots (favicon.ico, sitemap.xml, etc)
 */
export default createMiddleware(routing);

export const config = {
  matcher: '/((?!api|admin|_next|_vercel|design-preview|.*\\..*).*)',
};
