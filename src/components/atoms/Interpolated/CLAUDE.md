# CLAUDE.md — Interpolated

**Server Component que renderiza texto Payload con placeholders {{var}} sustituidos por valores de SiteIdentity.**

> Tier: atom  
> Helper: `@/lib/content-interpolation`

---

## API

```tsx
interface InterpolatedProps extends HTMLAttributes<HTMLElement> {
  children: string | null | undefined; // texto con placeholders
  locale?: 'es' | 'en';               // default: 'es'
  as?: ElementType;                    // default: 'span'
  className?: string;
}
```

---

## Cuándo usar

- ✅ Texto editorial donde el editor pueda usar `{{siteName}}`, `{{tagline}}`, etc
- ✅ Cualquier campo Payload de tipo `text` / `textarea`
- ❌ Strings hardcoded en código (NO usar, mejor refactorizar a Payload)
- ❌ Client Components (helper es async — pasar prop pre-interpolada desde servidor)

---

## Placeholders disponibles

| Placeholder | Valor ejemplo |
|---|---|
| `{{siteName}}` | "Sivar Brains" |
| `{{siteShortName}}` | "Sivar Brains" |
| `{{siteTagline}}` | "Cerebros de marca operacionales" |
| `{{siteDescription}}` | descripción media |
| `{{longDescription}}` | descripción larga |
| `{{siteDomain}}` | "https://sivarbrains.com" |
| `{{founderName}}` | "Christian Zavala" |
| `{{producerName}}` | "Brand Brain Foundry" |
| `{{currentYear}}` | 2026 |

---

## Ejemplos

```tsx
// En page.tsx — Heading con interpolación
<Heading level="display-hero">
  <Interpolated locale={locale}>{hero.h1Line1}</Interpolated>
</Heading>

// En page.tsx — Lede con interpolación
<Interpolated as="p" locale={locale} className="bbf-lede">
  {hero.ledeBody}
</Interpolated>

// Pre-interpolar en servidor (patrón más performant para múltiples campos)
const h1 = await interpolate(hero.h1Line1, locale);
const lede = await interpolate(hero.ledeBody, locale);
return <HeroSection h1={h1} lede={lede} />;
```

---

## Patrón alternativo — pre-interpolar en padre

Cuando múltiples campos necesitan interpolación, más eficiente que wrappear con Interpolated cada uno:

```tsx
// page.tsx (Server Component)
import { interpolate, interpolateAll } from '@/lib/content-interpolation';

const [h1, lede, tagline] = await interpolateAll([
  hero.h1Line1,
  hero.ledeBody,
  section.tagline,
], locale);
```

---

## Roadmap FASE 6

Cuando se implemente ONTOLOGY PRIMITIVES (Entities, Topics), este interpolador se extenderá para soportar referencias a entidades: `{{entity:sivar-brains.tagline}}`.
