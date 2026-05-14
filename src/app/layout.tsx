import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Brand Brain Foundry — Construimos cerebros de marca',
  description:
    'Brand Brain Foundry construye cerebros de marca: el conocimiento de tu empresa, convertido en un sistema que piensa con tu equipo y trabaja en todos lados como tu marca.',
  metadataBase: new URL('https://brandbrainfoundry.com'),
  openGraph: {
    title: 'Brand Brain Foundry',
    description: 'Construimos cerebros de marca.',
    url: 'https://brandbrainfoundry.com',
    siteName: 'Brand Brain Foundry',
    locale: 'es_ES',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
