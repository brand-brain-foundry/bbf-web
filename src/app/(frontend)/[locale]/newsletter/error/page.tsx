import { getLocale } from 'next-intl/server';
import Link from 'next/link';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';

type Props = {
  searchParams: Promise<{ reason?: string }>;
};

export default async function NewsletterErrorPage({ searchParams }: Props) {
  const locale = await getLocale();
  await searchParams;
  const homeHref = locale === 'en' ? '/en' : '/';

  const copy =
    locale === 'en'
      ? {
          title: 'Could not confirm',
          message: 'The link is invalid or expired. Try subscribing again.',
          backHome: 'Back to home',
        }
      : {
          title: 'No se pudo confirmar',
          message: 'El link es inválido o expiró. Intentá suscribirte de nuevo.',
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
