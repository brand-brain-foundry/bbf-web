import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Container } from '@/components/atoms/Container';
import { ContactForm } from '@/components/molecules/ContactForm';

type Props = {
  params: Promise<{ locale: 'es' | 'en' }>;
};

const META = {
  es: {
    title: 'Contacto — Brand Brain Foundry',
    description: 'Sentémonos a pensar. Contanos qué necesitás y coordinamos conversación.',
  },
  en: {
    title: 'Contact — Brand Brain Foundry',
    description: 'Let us think together. Tell us what you need and we coordinate a conversation.',
  },
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const meta = META[locale];

  return {
    title: meta.title,
    description: meta.description,
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      locale: locale === 'es' ? 'es_ES' : 'en_US',
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export const dynamic = 'force-dynamic';

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="py-16 md:py-24">
      <Container size="prose">
        <ContactForm locale={locale} />
      </Container>
    </main>
  );
}
