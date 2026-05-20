import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';

export default async function NewsletterConfirmedPage() {
  const locale = await getLocale();
  const homeHref = locale === 'en' ? '/en' : '/';

  const copy =
    locale === 'en'
      ? {
          title: 'You are in.',
          message: 'Welcome to BBF Newsletter. Next edition: in two weeks.',
          backHome: 'Back to home',
        }
      : {
          title: 'Suscripción confirmada.',
          message: 'Bienvenido a BBF Newsletter. Próxima edición: en dos semanas.',
          backHome: 'Volver al inicio',
        };

  return (
    <Container as="section" size="prose" className="py-24 text-center">
      <Heading level="h1" weight="bold" color="primary" className="mb-6">
        {copy.title}
      </Heading>
      <Text variant="body-lg" color="secondary" className="mb-10">
        {copy.message}
      </Text>
      <Button asChild intent="primary" size="lg">
        <Link href={homeHref}>{copy.backHome}</Link>
      </Button>
    </Container>
  );
}
