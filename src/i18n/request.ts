import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

/**
 * next-intl request config — carga messages por locale.
 *
 * Habilita static rendering vía setRequestLocale en layouts.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale =
    requested && (routing.locales as readonly string[]).includes(requested)
      ? (requested as (typeof routing.locales)[number])
      : routing.defaultLocale;

  return {
    locale,
    messages: (await import(`./messages/${locale}.json`)).default,
  };
});
