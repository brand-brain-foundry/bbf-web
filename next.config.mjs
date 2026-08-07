import { withPayload } from '@payloadcms/next/withPayload';
import createNextIntlPlugin from 'next-intl/plugin';

import { STORAGE_PROVIDERS } from './src/lib/storage/providers.mjs';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

// P-STORAGE (HAL-SBWEB-PROVIDER-COUPLING-01): fallback 'r2' coincide con el proveedor activo
// hoy en producción — si STORAGE_PROVIDER no está seteado en build, el CSP no cambia.
const storageHostname = STORAGE_PROVIDERS[process.env.STORAGE_PROVIDER ?? 'r2'].hostname;

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // requerido por Railway/Docker — Vercel lo ignora, aditivo y seguro (B-BBF-WEB-RAILWAY-PREP-01)
  reactStrictMode: true,
  experimental: {
    reactCompiler: false,
  },
  images: {
    formats: ['image/avif', 'image/webp'],
    // P-STORAGE: hostname derivado de STORAGE_PROVIDERS (src/lib/storage/providers.mjs),
    // no hardcodeado — si se conecta un dominio custom al bucket, agregarlo en ese archivo.
    remotePatterns: [{ protocol: 'https', hostname: storageHostname }],
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
      // Imágenes: self + data URIs + storage activo (P-STORAGE) + Turnstile widget
      `img-src 'self' data: blob: https://${storageHostname} https://challenges.cloudflare.com`,
      // Fuentes: next/font/google las sirve self-hosted desde _next/static/
      "font-src 'self'",
      // Fetch/XHR: Turnstile verify + GA4 + storage activo (media directo si aplica)
      `connect-src 'self' https://challenges.cloudflare.com https://www.google-analytics.com https://${storageHostname}`,
      // Video: self cubre el hero (ahora en /public); storage activo cubre videos de Media collection
      `media-src 'self' https://${storageHostname}`,
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
