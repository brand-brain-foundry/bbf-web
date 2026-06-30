---
description: Reglas para Next.js 15 App Router, RSC, ISR, route handlers.
globs: ["app/**", "middleware.ts", "next.config.*"]
alwaysApply: false
---

# Regla 20 — Next.js 15 App Router

> **Fuente Canon:** `BBF_WebPublicaTopologiaCanon_v0_1.md` §2.1, §4.2.
> **Antes de tocar Next.js, lee la doc bundleada en `node_modules/next/dist/docs/`** (Next.js 16.2+ la incluye; tu training data está desactualizado).

## Route groups

```
app/
├── (frontend)/         # público — RSC + ISR/SSG
│   ├── [locale]/       # opcional para EN; ES sin prefijo
│   │   ├── page.tsx                          # Home
│   │   ├── manifiesto/page.tsx
│   │   ├── que-es-un-cerebro-de-marca/page.tsx
│   │   ├── como-funciona/page.tsx
│   │   ├── como-se-integra/page.tsx
│   │   ├── casos/page.tsx                    # listado
│   │   ├── casos/[slug]/page.tsx             # caso individual
│   │   ├── clientes/page.tsx
│   │   ├── blog/page.tsx
│   │   ├── blog/[slug]/page.tsx
│   │   ├── blog/categoria/[cat]/page.tsx
│   │   ├── blog/tag/[tag]/page.tsx
│   │   ├── blog/autor/[author]/page.tsx
│   │   ├── podcast/page.tsx
│   │   ├── podcast/[slug]/page.tsx
│   │   ├── contacto/page.tsx
│   │   └── suscribirse/page.tsx
│   └── api/
│       ├── contact/route.ts
│       ├── newsletter/subscribe/route.ts
│       ├── newsletter/confirm/route.ts
│       ├── og/route.tsx
│       └── revalidate/route.ts
└── (payload)/          # admin /admin
    └── admin/[[...slug]]/page.tsx
```

## Render strategy (invariante W-3)

- **SSG por defecto** para páginas estáticas (manifiesto, método).
- **ISR** para páginas con contenido editable (Home, casos, blog).
- **SSR** solo si es ineludible (raro en marketing site).
- **Edge runtime** para `/api/og`, `sitemap.xml`, `robots.txt`, `llms.txt`.
- **Node runtime** para todo lo que toca Payload (Payload requiere Node).

Cada `page.tsx` declara explícitamente:
```ts
export const revalidate = 3600; // ISR cada hora, o false para SSG puro
```

## RSC discipline

- **Server Components por defecto.** `'use client'` solo cuando se necesite interactividad real (forms, intersection observers, useState).
- **Datos vienen de Payload Local API** desde RSC, no de `fetch` HTTP interno. Local API es C-02 (sin duplicación).
- **No mezcles**: si un component necesita estado de cliente, extrae el sub-árbol interactivo a un `'use client'` separado, y mantén el wrapper como RSC.

## Metadata + SEO en cada page (invariante W-4)

```ts
import type { Metadata } from 'next'
import { generateMetadataForPage } from '@/lib/seo/metadata'

export async function generateMetadata({ params }): Promise<Metadata> {
  return generateMetadataForPage(params)
}
```

Toda page incluye:
- `<title>` + meta description localized
- OG image (estática para core pages, dinámica `/api/og?slug=...` para blog/cases)
- Twitter Card
- Canonical + hreflang
- Schema.org JSON-LD vía `<script type="application/ld+json">` en el componente

## Route handlers

- Validación Zod **obligatoria** en body, query params, headers relevantes.
- Rate limit con Upstash Redis **obligatorio** en `/api/contact`, `/api/newsletter/*`.
- Honeypot field **obligatorio** en forms públicos.
- Cloudflare Turnstile validation **obligatorio** (decisión Canon §6.5 + D-BBF-WEB).
- Logs estructurados con request ID. Sentry captura errores.

## Middleware

`middleware.ts` solo para:
1. Redirección de locale por Accept-Language.
2. Set de cookies `bbf-locale`.
3. Security headers no-cacheables (los cacheables van en `next.config.ts`).

**No metas auth check en middleware** salvo para `/admin` (Payload lo gestiona internamente).
**No metas rate limit en middleware** (va en route handler con Upstash).

## CVE crítico

`CVE-2025-29927` — middleware bypass. Requiere Next.js **15.2.3+**. Si encuentras `next` con versión inferior: **paras y avisas**.
