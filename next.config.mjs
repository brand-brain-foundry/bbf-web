import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // requerido por Railway/Docker — Vercel lo ignora, aditivo y seguro (B-BBF-WEB-RAILWAY-PREP-01)
  reactStrictMode: true,
  experimental: {
    reactCompiler: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // B-BBF-WEB-RAILWAY-EJECUCION-01: Cloudflare R2 reemplaza Vercel Blob.
    // *.r2.dev cubre el dominio público default de un bucket R2; si se conecta
    // un dominio custom al bucket, agregarlo aquí también.
    remotePatterns: [{ protocol: 'https', hostname: '*.r2.dev' }],
    // H-BBF-521: default de Next es 'attachment' (image-config.js) — sin esto
    // /_next/image fuerza descarga en vez de mostrar la imagen inline.
    contentDispositionType: 'inline',
  },

  // Canon §6.3 — CSP environment-aware (no nonce — preserva ISR). B-BBF-WEB-FIX-CSP-ENVIRONMENT.
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    // 'unsafe-eval' solo en dev: react-refresh lo necesita; prod no usa eval.
    // va.vercel-scripts.com removido (B-BBF-WEB-RAILWAY-EJECUCION-01 — Vercel Analytics se reemplaza por GA4).
    const scriptSrc = isDev
      ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com"
      : "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://www.googletagmanager.com https://www.google-analytics.com";

    const csp = [
      "default-src 'self'",
      scriptSrc,
      // Inline styles via React style prop + Tailwind utilities
      "style-src 'self' 'unsafe-inline'",
      // Imágenes: self + data URIs + Cloudflare R2 + Turnstile widget
      "img-src 'self' data: blob: https://*.r2.dev https://challenges.cloudflare.com",
      // Fuentes: next/font/google las sirve self-hosted desde _next/static/
      "font-src 'self'",
      // Fetch/XHR: Turnstile verify + GA4 + R2 (media directo si aplica)
      "connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://*.r2.dev",
      // Video: self cubre el hero (ahora en /public); R2 cubre videos de Media collection
      "media-src 'self' https://*.r2.dev",
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
