import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { Link } from '@/components/atoms/Link';

type NotFoundTemplateProps = {
  locale?: 'es' | 'en';
};

const COPY = {
  es: {
    heading: 'Esto no está aquí.',
    body: 'La página que buscas no existe o se ha movido. Volvé al inicio y desde ahí encontramos qué necesitás.',
    cta: 'Ir al inicio',
    href: '/',
  },
  en: {
    heading: 'This is not here.',
    body: 'The page you are looking for does not exist or has moved. Return home and we will find what you need.',
    cta: 'Go home',
    href: '/en',
  },
} as const;

export function NotFoundTemplate({ locale = 'es' }: NotFoundTemplateProps) {
  const copy = COPY[locale];

  return (
    <main
      data-component="bbf-not-found-template"
      className="flex min-h-[60vh] items-center justify-center py-16"
    >
      <Container size="prose" className="text-center">
        <Heading level="display-lg" as="h1" weight="bold" className="mb-6">
          {copy.heading}
        </Heading>
        <Text variant="body-lg" className="mx-auto mb-8 max-w-prose">
          {copy.body}
        </Text>
        <Button asChild intent="primary" size="lg">
          <Link href={copy.href}>{copy.cta}</Link>
        </Button>
      </Container>
    </main>
  );
}
