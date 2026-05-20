import { getTranslations } from 'next-intl/server';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';

type NotFoundTemplateProps = {
  locale?: 'es' | 'en';
};

export async function NotFoundTemplate({ locale = 'es' }: NotFoundTemplateProps) {
  const t = await getTranslations('errors.notFound');
  const href = locale === 'en' ? '/en' : '/';

  return (
    <main
      data-component="bbf-not-found-template"
      className="flex min-h-[60vh] items-center justify-center py-16"
    >
      <Container size="prose" className="text-center">
        <Heading level="display-lg" as="h1" weight="bold" className="mb-6">
          {t('title')}
        </Heading>
        <Text variant="body-lg" className="mx-auto mb-8 max-w-prose">
          {t('description')}
        </Text>
        <Button asChild intent="primary" size="lg">
          <Link href={href}>{t('backHome')}</Link>
        </Button>
      </Container>
    </main>
  );
}
