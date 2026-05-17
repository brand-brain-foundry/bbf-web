import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Mulish } from 'next/font/google';
import { routing } from '@/i18n/routing';
import type { ReactNode } from 'react';
import type { Metadata, Viewport } from 'next';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
});

const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mulish',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#fdf5ed',
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === 'es' || locale === 'en' ? locale : 'es';

  const titles = {
    es: 'Brand Brain Foundry — Construimos cerebros de marca',
    en: 'Brand Brain Foundry — Building brand intelligence',
  };

  const descriptions = {
    es: 'Foundry de cerebros de marca. Construimos sistemas de inteligencia de marca con arquitectura hub-and-spoke.',
    en: 'Brand brain foundry. We build brand intelligence systems with hub-and-spoke architecture.',
  };

  const urls = {
    es: 'https://brandbrainfoundry.com',
    en: 'https://brandbrainfoundry.com/en',
  };

  return {
    metadataBase: new URL('https://brandbrainfoundry.com'),
    title: titles[currentLocale],
    description: descriptions[currentLocale],
    keywords: [
      'brand brain',
      'cerebro de marca',
      'foundry',
      'brand intelligence',
      'brand AI',
      'consultoría branding',
      'sistemas de marca',
      'inteligencia de marca',
    ],
    authors: [{ name: 'Brand Brain Foundry' }],
    creator: 'Brand Brain Foundry',
    publisher: 'Brand Brain Foundry',
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
    },
    manifest: '/site.webmanifest',
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    alternates: {
      canonical: currentLocale === 'es' ? '/' : `/${currentLocale}`,
      languages: {
        es: '/',
        en: '/en',
        'x-default': '/',
      },
    },
    openGraph: {
      type: 'website',
      locale: currentLocale === 'es' ? 'es_ES' : 'en_US',
      url: urls[currentLocale],
      siteName: 'Brand Brain Foundry',
      title: titles[currentLocale],
      description: descriptions[currentLocale],
      images: [
        {
          url: '/assets/media/images/og/og-default.png',
          width: 1200,
          height: 630,
          alt: titles[currentLocale],
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[currentLocale],
      description: descriptions[currentLocale],
      images: ['/assets/media/images/og/og-default.png'],
    },
    other: {
      'apple-mobile-web-app-title': 'BBF',
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://brandbrainfoundry.com/#organization',
    name: 'Brand Brain Foundry',
    alternateName: 'BBF',
    url: 'https://brandbrainfoundry.com',
    logo: {
      '@type': 'ImageObject',
      url: 'https://brandbrainfoundry.com/icon-512.png',
      width: 512,
      height: 512,
    },
    image: 'https://brandbrainfoundry.com/assets/media/images/og/og-default.png',
    description:
      'Foundry de cerebros de marca. Asesoramos, diseñamos, construimos y mantenemos sistemas de inteligencia de marca para empresas que escalan.',
    slogan: 'Construimos cerebros de marca',
    foundingDate: '2026',
    knowsAbout: [
      'Brand Intelligence Systems',
      'AI Brand Consulting',
      'Brand Brain Architecture',
      'Multi-tenant Brand Platforms',
      'Brand Knowledge Systems',
      'Brand Identity Design',
    ],
    sameAs: ['https://github.com/brand-brain-foundry'],
    contactPoint: {
      '@type': 'ContactPoint',
      email: 'contacto@brandbrainfoundry.com',
      contactType: 'customer service',
      availableLanguage: ['Spanish', 'English'],
    },
    inLanguage: locale === 'es' ? 'es' : 'en',
  };

  return (
    <html lang={locale} className={`${inter.variable} ${mulish.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </body>
    </html>
  );
}
