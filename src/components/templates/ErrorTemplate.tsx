'use client';

import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';

type ErrorTemplateProps = {
  reset?: () => void;
  locale?: 'es' | 'en';
};

const COPY = {
  es: {
    heading: 'Algo se rompió.',
    body: 'Pasó algo inesperado. Probá recargar; si vuelve a pasar, escribinos.',
    cta: 'Intentar de nuevo',
  },
  en: {
    heading: 'Something broke.',
    body: 'Something unexpected happened. Try reloading; if it continues, write to us.',
    cta: 'Try again',
  },
} as const;

export function ErrorTemplate({ reset, locale = 'es' }: ErrorTemplateProps) {
  const copy = COPY[locale];

  return (
    <main
      data-component="bbf-error-template"
      className="flex min-h-[60vh] items-center justify-center py-16"
    >
      <Container size="prose" className="text-center">
        <Heading level="display-lg" as="h1" weight="bold" className="mb-6">
          {copy.heading}
        </Heading>
        <Text variant="body-lg" className="mx-auto mb-8 max-w-prose">
          {copy.body}
        </Text>
        {reset && (
          <Button intent="primary" size="lg" onClick={reset}>
            {copy.cta}
          </Button>
        )}
      </Container>
    </main>
  );
}
