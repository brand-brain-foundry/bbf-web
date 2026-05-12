---
description: Seguridad transversal — CSP, headers, rate limit, validación. Invariante W-5.
globs: ["middleware.ts", "next.config.*", "app/api/**", "lib/security/**", "lib/validation/**"]
alwaysApply: false
---

# Regla 40 — Seguridad (invariante W-5)

> **Fuente Canon:** `BBF_WebPublicaTopologiaCanon_v0_1.md` §6.
> **Doctrina:** seguridad como principio, no como agregado. Cada capa la implementa.

## Security headers (Canon §6.3)

En `next.config.ts`:
```ts
async headers() {
  return [{
    source: '/(.*)',
    headers: [
      { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      // CSP va en middleware o aquí. Ver decisión Canon §6.3.
    ],
  }];
}
```

## CSP — opción pragmática (Canon §6.3, recomendada)

Mantiene ISR/SSG. Allowlist + `strict-dynamic`:
```
default-src 'self';
script-src 'self' 'strict-dynamic' https://va.vercel-scripts.com https://us.i.posthog.com;
style-src 'self' 'unsafe-inline';
img-src 'self' data: https://*.vercel-storage.com https://images.mux.com;
font-src 'self' data:;
connect-src 'self' https://api.resend.com https://us.i.posthog.com;
frame-ancestors 'none';
upgrade-insecure-requests;
```

**No uses CSP nonce-based salvo que Zavala firme romper ISR.** El trade-off está documentado en Canon §6.3.

## Rate limiting (Canon §6.4)

Endpoints públicos con escritura:

| Endpoint | Límite | Tool |
|---|---|---|
| `/api/contact` | 5/IP/hora | Upstash Redis sliding window |
| `/api/newsletter/subscribe` | 3/IP/hora | Upstash Redis |
| `/api/og` | 60/IP/min | Vercel built-in |
| `/admin/login` | 10/IP/15min | Payload built-in |

Patrón:
```ts
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const limiter = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, '1 h'),
});

const { success } = await limiter.limit(`contact:${ip}`);
if (!success) return new Response('Rate limited', { status: 429 });
```

## Validación Zod (D-01 + W-5)

Toda entrada pública pasa por schema Zod:
```ts
const ContactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  message: z.string().min(10).max(5000),
  honeypot: z.string().max(0), // debe estar vacío
});

const parsed = ContactSchema.safeParse(await req.json());
if (!parsed.success) return Response.json({ errors: parsed.error.flatten() }, { status: 400 });
```

## Honeypot

Campo oculto en cada form público. Humanos no lo llenan, bots sí. Si llega con contenido: drop silencioso (no 400, no log a Sentry, no alertes — para no informar al bot).

## Cloudflare Turnstile (Canon §6.5)

Site key en cliente, secret en servidor. Validar token de cada form submit antes de procesar.

## Secrets

Todo secreto en `process.env` validado al startup con Zod:
```ts
// lib/env.ts
const envSchema = z.object({
  DATABASE_URI: z.string().url(),
  PAYLOAD_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().startsWith('re_'),
  // ...
});
export const env = envSchema.parse(process.env);
```

Si validación falla al startup: **el server no arranca**. Mejor crash temprano que producción rota.

## Lista deny absoluta

- Cero `eval()`, `Function()`, `new Function()`.
- Cero `dangerouslySetInnerHTML` salvo en componente único `<RichText>` que recibe output sanitizado de Lexical.
- Cero `<iframe>` salvo en `<MuxEmbed>` y `<SpotifyEmbed>` con sandbox attributes.
- Cero target="_blank" sin `rel="noopener noreferrer"`.

## Dependabot + CVEs

GitHub Dependabot activo. CVEs críticos: revisar **antes** de cada deploy a producción. Bloquear deploy si hay `severity: high` o `critical` sin parche.
