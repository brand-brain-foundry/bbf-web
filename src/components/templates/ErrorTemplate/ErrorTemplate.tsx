'use client';

import { useTranslations } from 'next-intl';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';

type ErrorTemplateProps = {
  reset?: () => void;
  locale?: 'es' | 'en';
};

export function ErrorTemplate({ reset }: ErrorTemplateProps) {
  const t = useTranslations('errors.generic');

  return (
    <main
      data-component="bbf-error-template"
      className="bbf-section-py-md flex min-h-[60vh] items-center justify-center"
    >
      <Container size="prose" className="text-center">
        <Heading level="display-lg" as="h1" weight="bold" className="mb-6">
          {t('title')}
        </Heading>
        <Text variant="body-lg" className="mx-auto mb-8 max-w-prose">
          {t('description')}
        </Text>
        {reset && (
          <Button intent="primary" size="lg" onClick={reset}>
            {t('retry')}
          </Button>
        )}
      </Container>
    </main>
  );
}
