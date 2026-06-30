import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Inter, Mulish } from 'next/font/google';
import { routing } from '@/i18n/routing';
import { Header } from '@/components/organisms/Header';
import { Footer } from '@/components/organisms/Footer';
import { SkipLink } from '@/components/atoms/SkipLink';
import { StructuredData } from '@/components/seo/StructuredData';
import { getSiteIdentity } from '@/config/site';
import { interpolate } from '@/lib/content-interpolation';
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

export function generateViewport(): Viewport {
  return {
    // #0a0a0a = valor resuelto de --bbf-surface-dark-base (dark surface bg)
    // theme-color no acepta var() — hex literal obligatorio.
    // Consistente con manifest theme_color. CMS field ignorado (admin tenía #255ff1 erróneo).
    themeColor: '#0a0a0a',
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const l = (locale === 'es' || locale === 'en' ? locale : 'es') as 'es' | 'en';

  const site = await getSiteIdentity(l);
  const seo = site.seo ?? {};

  const [siteTagline, siteDescription] = await Promise.all([
    interpolate(site.siteTagline, l),
    interpolate(site.siteDescription, l),
  ]);
  const title = `${site.siteName} · ${siteTagline}`;
  const ogLocale = l === 'es' ? (seo.defaultLocale ?? 'es_SV') : 'en_US';
  const ogImage = seo.ogImagePath ?? '/og-image.png';

  return {
    metadataBase: new URL(site.siteDomain),
    title,
    description: siteDescription,
    keywords: [
      'brand brain',
      'cerebro de marca',
      'brand intelligence',
      'brand AI',
      'sistemas de marca',
      'inteligencia de marca',
    ],
    authors: [{ name: site.siteName }],
    creator: site.siteName,
    publisher: site.siteName,
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '16x16 32x32 48x48' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
        { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
        { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      ],
      apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
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
      canonical: l === 'es' ? site.siteDomain : `${site.siteDomain}/en`,
      languages: {
        es: site.siteDomain,
        en: `${site.siteDomain}/en`,
        'x-default': site.siteDomain,
      },
    },
    openGraph: {
      type: 'website',
      locale: ogLocale,
      alternateLocale: l === 'es' ? 'en_US' : (seo.defaultLocale ?? 'es_SV'),
      url: l === 'es' ? site.siteDomain : `${site.siteDomain}/en`,
      siteName: site.siteName,
      title,
      description: siteDescription,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      site: seo.twitterHandle || undefined,
      title,
      description: siteDescription,
      images: [{ url: ogImage, alt: title, width: 1200, height: 630 }],
    },
    other: {
      'apple-mobile-web-app-title': site.siteName,
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

  return (
    <html lang={locale} className={`${inter.variable} ${mulish.variable}`}>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <SkipLink />
          <Header />
          <main id="main-content">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <StructuredData locale={locale} />
      </body>
    </html>
  );
}
