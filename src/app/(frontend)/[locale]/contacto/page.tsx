import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/atoms/Container';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';

export const revalidate = false;

type Props = { params: Promise<{ locale: 'es' | 'en' }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: locale === 'es' ? 'Contacto — Brand Brain Foundry' : 'Contact — Brand Brain Foundry',
    description:
      locale === 'es'
        ? 'Habla con nosotros sobre tu proyecto.'
        : 'Talk with us about your project.',
  };
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const heading = locale === 'es' ? 'Hablemos' : "Let's talk";
  const sub = locale === 'es' ? 'Cuéntanos sobre tu proyecto.' : 'Tell us about your project.';

  return (
    <main data-component="bbf-contacto-page" className="py-24">
      <Container size="prose">
        <Heading level="display-xl" as="h1" weight="bold" color="primary" className="mb-6">
          {heading}
        </Heading>
        <Text variant="body-lg" color="secondary">
          {sub}
        </Text>
        {/* ContactForm — M6-A4 TAREA 4: requiere RESEND_API_KEY confirmado */}
      </Container>
    </main>
  );
}
