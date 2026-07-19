---
name: generate-og-image-route
description: Construye o ajusta el endpoint /api/og que genera Open Graph images dinámicas para Posts y Cases. Usa cuando se necesite crear el endpoint inicial o cambiar el diseño de las OG images.
---

# Skill — OG image dinámica `/api/og`

## Cuándo usar

- Capa H1-1 está cerrada y se necesita el endpoint `/api/og` para Posts/Cases.
- Zavala pide ajustar el diseño visual de las OG images.
- Una página core necesita su OG dedicada distinta de la default global.

## Stack

`next/og` (built-in en Next.js 15). Edge runtime. Sin dependencias externas.

## Estructura

`app/(frontend)/api/og/route.tsx` (nota: `.tsx` porque devolvemos JSX).

```tsx
import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get('slug');
  const collection = searchParams.get('collection') ?? 'posts';
  const locale = (searchParams.get('locale') ?? 'es') as 'es' | 'en';

  // Validación estricta
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return new Response('Invalid slug', { status: 400 });
  }

  // Fetch desde Payload — usa REST API porque Local API no funciona en Edge.
  const res = await fetch(
    `${process.env.PAYLOAD_PUBLIC_URL}/api/${collection}?where[slug][equals]=${slug}&locale=${locale}&depth=0`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return new Response('Not found', { status: 404 });
  const data = await res.json();
  const doc = data.docs[0];
  if (!doc) return new Response('Not found', { status: 404 });

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          // D-DS-01: BrandSystem firmada. var() NO funciona en Edge runtime.
          // Fetch bs via REST → mapear bs.primaryPalette → hex (ver Reglas).
          background: '#0A1628',
          color: '#F5F0E8',
          fontFamily: 'Geist',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Logo desde BrandSystem global (fetch via REST — ver Reglas) */}
          <span style={{ fontSize: 32, fontWeight: 600 }}>{bs?.siteName ?? ''}</span>
        </div>

        <h1 style={{ fontSize: 64, lineHeight: 1.1, margin: 0 }}>
          {doc.title}
        </h1>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 24 }}>
          <span>{collection === 'posts' ? 'Artículo' : 'Caso'}</span>
          <span>{bs?.domain ?? ''}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      // fonts: cargar desde public/fonts/ (BrandSystem firmada D-DS-01).
    }
  );
}
```

## Rate limit

Vercel ya rate-limita `/api/og` por defecto. Si necesitas más estricto: 60 req/IP/min vía Upstash (regla 40-security).

## Cache headers

Edge runtime + `next: { revalidate: 3600 }` en el fetch → CDN cachea por 1h. Si Post se actualiza, hook `afterChange` puede llamar a `/api/revalidate?tag=og:posts:<slug>` para invalidar.

## Verificación

- Browser: `https://localhost:3000/api/og?slug=manifiesto&collection=pages` → devuelve PNG válido.
- LinkedIn Post Inspector: paste URL del post → preview correcto.
- Twitter Card Validator: paste URL → preview correcto.
- Lighthouse: no afecta CLS de la página principal.

## Reglas

- **No bloquees el endpoint detrás de auth**: las OG las consumen crawlers anónimos.
- **No uses fonts pesadas inline**: cargar fonts desde `public/fonts/` una vez, no embeber en cada response.
- **Diseño respeta `BrandSystem` global de Payload** (D-DS-01, firmada). Fetch BrandSystem via REST (Edge no tiene Local API): `GET /api/globals/brandSystem`. Mapear `bs.primaryPalette` → hex; `var()` CSS properties **no funcionan** en next/og Edge runtime.
- **Genera ambas variantes ES y EN** (el `locale` query param).
- **Slug validation estricta**: regex `^[a-z0-9-]+$`. No aceptes nada raro.
