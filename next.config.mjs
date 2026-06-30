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

  // Canon §6.3 — CSP environment-aware (no nonce — preserva ISR). B-BBF-WEB-FIX-CSP-ENVIRONMENT.
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    // 'unsafe-eval' solo en dev: react-refresh lo necesita; prod no usa eval.
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://challenges.cloudflare.com https://www.googletagmanager.com"
      : "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com https://challenges.cloudflare.com https://www.googletagmanager.com";

    const csp = [
      "default-src 'self'",
      scriptSrc,
      // Inline styles via React style prop + Tailwind utilities
      "style-src 'self' 'unsafe-inline'",
      // Imágenes: self + data URIs + Vercel Blob + Turnstile widget
      "img-src 'self' data: blob: https://*.public.blob.vercel-storage.com https://challenges.cloudflare.com",
      // Fuentes: next/font/google las sirve self-hosted desde _next/static/
      "font-src 'self'",
      // Fetch/XHR: Analytics beacon + Turnstile verify + GA4 (preparado) + Blob
      "connect-src 'self' https://va.vercel-scripts.com https://challenges.cloudflare.com https://www.google-analytics.com https://*.public.blob.vercel-storage.com",
      // Video hero + Blob: media-src cubre <video> src (no cubierto por img-src)
      "media-src 'self' https://*.public.blob.vercel-storage.com",
      // Turnstile widget iframe
      'frame-src https://challenges.cloudflare.com',
      "frame-ancestors 'none'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      'upgrade-insecure-requests',
    ].join('; ');

    const securityHeaders = [
      // HSTS solo en prod: en dev con HTTP el header es inofensivo pero innecesario
      ...(isDev
        ? []
        : [
            {
              key: 'Strict-Transport-Security',
              value: 'max-age=63072000; includeSubDomains; preload',
            },
          ]),
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: csp },
    ];

    return [{ source: '/(.*)', headers: securityHeaders }];
  },
};

export default withNextIntl(withPayload(nextConfig));
