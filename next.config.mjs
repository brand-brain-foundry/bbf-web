import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    reactCompiler: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },

  // Canon §6.3 — CSP estático (no nonce — preserva ISR). B-BBF-WEB-READINESS-PRESWITCH.
  async headers() {
    const csp = [
      "default-src 'self'",
      // Vercel Analytics + Speed Insights + Turnstile + GA4 (preparado, no activo aún)
      "script-src 'self' https://va.vercel-scripts.com https://challenges.cloudflare.com https://www.googletagmanager.com",
      // Inline styles via React style prop + Tailwind utilities
      "style-src 'self' 'unsafe-inline'",
      // Imágenes: self + data URIs + Vercel Blob + Turnstile widget
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://challenges.cloudflare.com",
      // Fuentes: next/font/google las sirve self-hosted desde _next/static/
      "font-src 'self'",
      // Fetch/XHR: Analytics beacon + Turnstile verify + GA4 (preparado)
      "connect-src 'self' https://va.vercel-scripts.com https://challenges.cloudflare.com https://www.google-analytics.com",
      // Turnstile widget iframe
      'frame-src https://challenges.cloudflare.com',
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Content-Security-Policy', value: csp },
        ],
      },
    ];
  },
};

export default withNextIntl(withPayload(nextConfig));
