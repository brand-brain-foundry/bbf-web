import type { Metadata } from 'next';
import { Outfit, Mulish } from 'next/font/google';
import './globals.css';

/**
 * Outfit — display font.
 * Usado para: logo wordmark, h1/h2/h3, hero text, section titles.
 * Patrón inherited from Sivar Brains globals.css v2.1.0
 */
const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '900'],
  variable: '--font-outfit',
  display: 'swap',
});

/**
 * Mulish — body font.
 * Usado para: body text, UI labels, nav items, docs, paragraphs.
 * Patrón inherited from Sivar Brains globals.css v2.1.0
 */
const mulish = Mulish({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mulish',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://brandbrainfoundry.com'),
  title: {
    default: 'Brand Brain Foundry — Construimos cerebros de marca',
    template: '%s | Brand Brain Foundry',
  },
  description:
    'Brand Brain Foundry es una foundry de cerebros de marca. Asesoramos, diseñamos, construimos y mantenemos sistemas de inteligencia de marca para empresas que escalan.',
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
  alternates: {
    canonical: 'https://brandbrainfoundry.com',
    languages: {
      'es-ES': 'https://brandbrainfoundry.com',
      'x-default': 'https://brandbrainfoundry.com',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_ES',
    url: 'https://brandbrainfoundry.com',
    siteName: 'Brand Brain Foundry',
    title: 'Brand Brain Foundry — Construimos cerebros de marca',
    description:
      'Foundry de cerebros de marca. Inteligencia que piensa con tu equipo y trabaja en todos lados como tu marca.',
    images: [
      {
        url: '/opengraph-image.png',
        width: 1200,
        height: 630,
        alt: 'Brand Brain Foundry — Construimos cerebros de marca',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brand Brain Foundry — Construimos cerebros de marca',
    description: 'Foundry de cerebros de marca.',
    images: ['/opengraph-image.png'],
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180' }],
  },
  manifest: '/site.webmanifest',
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'apple-mobile-web-app-title': 'BBF',
  },
};

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
  image: 'https://brandbrainfoundry.com/opengraph-image.png',
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
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-ES" className={`${outfit.variable} ${mulish.variable}`}>
      <head>
        <meta name="theme-color" content="#fdf5ed" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
