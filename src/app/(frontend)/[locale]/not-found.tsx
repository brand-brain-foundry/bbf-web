import { getTranslations } from 'next-intl/server';
import { getLocale } from 'next-intl/server';
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import Link from 'next/link';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'errors' });

  return (
    <main
      data-component="bbf-not-found"
      data-surface="dark"
      className="flex min-h-[80vh] flex-col items-center justify-center gap-8 bg-[var(--bbf-surface-dark-base)] px-6 py-24 text-center"
    >
      <Heading
        level="display-hero"
        color="primary"
        className="[font-size:clamp(6rem,20vw,14rem)] [line-height:1] [letter-spacing:-0.04em] [color:var(--bbf-on-surface-muted)]"
      >
        404
      </Heading>

      <div className="flex flex-col gap-3">
        <Heading level="h2" weight="medium" className="[color:var(--bbf-on-surface-title)]">
          {t('notFound.title')}
        </Heading>
        <Text variant="body-lg" className="[color:var(--bbf-on-surface-body)]">
          {t('notFound.description')}
        </Text>
      </div>

      <Button asChild intent="secondary" fill="outline" surface="dark" size="lg">
        <Link href={locale === 'en' ? '/en' : '/'}>{t('notFound.backHome')}</Link>
      </Button>
    </main>
  );
}
