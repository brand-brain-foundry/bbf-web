---
description: Multilingüe ES/EN. ES default sin prefijo, EN con /en. First-class desde schemas.
globs: ["app/**", "collections/**", "globals/**", "lib/i18n/**", "middleware.ts", "payload.config.ts"]
alwaysApply: false
---

# Regla 30 — i18n multilingüe (D-BBF-WEB-05)

> **Fuente Canon:** `BBF_WebPublicaTopologiaCanon_v0_1.md` §3.3, §4.2, §5.2.
> **Decisión firmada:** ES default (sin prefijo), EN con prefijo `/en`. Schema con `localized: true` en todos los campos de contenido.

## Library

`next-intl` (recomendado 2026 por compatibilidad RSC). Si Zavala firma otra: ver `BBF_I18nResearch.md`.

## Payload localization config

```ts
// payload.config.ts
{
  localization: {
    locales: ['es', 'en'],
    defaultLocale: 'es',
    fallback: true,
  }
}
```

## Estructura app/

```
app/(frontend)/
├── [[...slug]]/page.tsx          # captura ES por defecto sin prefijo
└── en/
    └── [[...slug]]/page.tsx       # EN con prefijo
```

O alternativa más limpia con grupo de locale:
```
app/(frontend)/
└── [locale]/                      # locale = 'es' | 'en'
    └── ...
```

**Decisión de estructura: pendiente investigación H1-2.** Hasta que firme, mantén la opción con `[locale]/` por flexibilidad.

## URLs (decisión H1-2 pendiente)

Slugs **traducidos** por default:
- ES: `/manifiesto` → EN: `/en/manifesto`
- ES: `/que-es-un-cerebro-de-marca` → EN: `/en/what-is-a-brand-brain`
- ES: `/casos/sivar-brains` → EN: `/en/cases/sivar-brains` (mismo slug si es nombre propio)

El slug ES es el campo `slug` localized:es. El slug EN es `slug` localized:en. Ambos coexisten en el mismo documento de Payload.

## Hreflang + canonical (invariante W-4)

Cada página renderiza:
```html
<link rel="canonical" href="https://brandbrainfoundry.com/manifiesto" />
<link rel="alternate" hreflang="es" href="https://brandbrainfoundry.com/manifiesto" />
<link rel="alternate" hreflang="en" href="https://brandbrainfoundry.com/en/manifesto" />
<link rel="alternate" hreflang="x-default" href="https://brandbrainfoundry.com/manifiesto" />
```

Helper centralizado en `lib/seo/hreflang.ts`. No lo dupliques en cada page.

## Sitemap multilingüe

`sitemap.xml` incluye `<xhtml:link rel="alternate" hreflang="...">` por cada URL. Generado dinámico desde Payload en edge function.

## Fallback policy

`fallback: true` en Payload localization significa: si EN no existe, devuelve ES. Para frontend:

- **Páginas core**: si EN falta, **renderiza ES con banner discreto** "Available in Spanish".
- **Blog/Cases**: si EN falta, redirige a ES con `Vary: Accept-Language`.
- **NUNCA 404** si la versión ES existe. La versión ES siempre es el suelo.

## Language switcher

Component `<LanguageSwitcher>` reutilizable. Persiste preferencia en cookie `bbf-locale` con scope `.brandbrainfoundry.com` (preparado para webapp futura).

## llms.txt multilingüe

Genera `/llms.txt` (ES) y `/en/llms.txt` (EN). Ambos linkean al mismo `/llms-full.txt` (mezcla idiomas con declaración explícita).

## Schema.org `inLanguage`

Cada JSON-LD de Article, BlogPosting, Page, PodcastEpisode lleva `inLanguage`: `"es"` o `"en"`.

## Antes de agregar contenido nuevo

1. Verifica que el field correspondiente en Payload sea `localized: true`.
2. Si no lo es y debería serlo (contenido visible al usuario): **para** y reporta el gap.
3. Si ya está localized: agrega ES + EN en el mismo documento.
4. Si solo tienes ES: marca el documento como `status: 'draft-en-pending'` para que el dashboard lo muestre.
