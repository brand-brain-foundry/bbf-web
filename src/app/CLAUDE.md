# CLAUDE.md — src/app/

**Next.js App Router canon BBF**

> App Router structure + routing + layout.
> Lee antes de modificar app structure.

---

## Estructura

```
app/
├── globals.css                Orchestrator import CSS canon
├── layout.tsx                 Root layout (html, body, providers)
├── (frontend)/                Frontend route group (público)
│   ├── layout.tsx             Frontend layout wrapper
│   └── [locale]/              Locale dynamic segment
│       ├── layout.tsx         Locale layout (next-intl, metadata)
│       ├── page.tsx           Homepage (hero)
│       └── [...pathSegments]/ Catch-all para pages futuras
│           └── page.tsx
└── (payload)/                 Payload admin route group
    ├── admin/[[...segments]]/ Admin CMS (/admin)
    └── api/[...slug]/         Payload API handler
```

---

## Routing canon

### Locales

- ES default (root path `/`) — sin prefijo
- EN secondary (`/en`) — con prefijo
- Implementado via `next-intl` + `src/middleware.ts`

### Route groups

- `(frontend)`: páginas públicas user-facing — SSG/ISR canon
- `(payload)`: admin Payload CMS — Node runtime obligatorio

---

## globals.css canon

Orchestrator que importa CSS en **orden tier canon** (CRÍTICO):

```css
/* TIER 0: BASE */
@import '../styles/base/reset.css';
@import '../styles/base/focus.css';

/* TIER 1: PRIMITIVES */
@import '../styles/tokens/primitives/colors.css';
@import '../styles/tokens/primitives/typography.css';
@import '../styles/tokens/primitives/spacing.css';
@import '../styles/tokens/primitives/motion.css';
@import '../styles/tokens/primitives/shadows.css';
@import '../styles/tokens/primitives/breakpoints.css';
@import '../styles/tokens/primitives/radius.css';
@import '../styles/tokens/primitives/z-index.css';

/* TIER 2: SEMANTIC */
@import '../styles/tokens/semantic/colors.css';
@import '../styles/tokens/semantic/typography.css';
@import '../styles/tokens/semantic/spacing.css';
@import '../styles/tokens/semantic/motion.css';
@import '../styles/tokens/semantic/shadows.css';

/* TIER 3: COMPONENT */
@import '../styles/tokens/components/button.css';
@import '../styles/tokens/components/hero.css';
@import '../styles/tokens/components/hero-section.css';
@import '../styles/tokens/components/locale-switcher.css';
@import '../styles/tokens/components/logo.css';

/* UTILITIES */
@import '../styles/utilities/animations.css';
@import '../styles/utilities/motion-patterns.css';
```

**Orden CRÍTICO:** base → primitives → semantic → component → utilities.
Agregar nuevos @imports en el tier correcto.

---

## page.tsx pattern canon (D-90)

Thin composition layer — sin lógica, sin inline styles:

```tsx
import { setRequestLocale } from 'next-intl/server';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { BBFLogo, BBFLogoAnimator } from '@/components/atoms/BBFLogo';
import { HeroSection } from '@/components/sections/HeroSection';
import { LocaleSwitcher } from '@/components/molecules/LocaleSwitcher';
import { HeroVideo } from '@/components/molecules/HeroVideo';

export default async function Page({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <HeroSection>
      <HeroVideo ... />
      <LocaleSwitcher ... />
      <HeroSection.Content align="center">
        <BBFLogoAnimator>
          <BBFLogo variant="stamp" animated />
        </BBFLogoAnimator>
        <Heading level="display-lg">...</Heading>
        <Text variant="tagline">...</Text>
        <Button intent="primary">...</Button>
      </HeroSection.Content>
    </HeroSection>
  );
}
```

**Reglas canon (D-90):**
1. **0 inline styles** — todos vía atoms con tokens canon
2. **Composition pattern** — solo wrap, sin business logic
3. **i18n via next-intl** — `setRequestLocale` + `getTranslations`
4. **Server Component default** — `'use client'` solo si interactividad ineludible

---

## i18n pattern canon

```tsx
import { getTranslations, setRequestLocale } from 'next-intl/server';

// En page.tsx o layout.tsx
setRequestLocale(locale);
const t = await getTranslations('namespace');

<Heading>{t('hero.title')}</Heading>
```

Namespaces en `messages/{locale}.json`. Agregar ES + EN simultáneamente.

---

## Render strategy (invariante W-3)

- **SSG** para páginas estáticas sin edición (manifiesto, método)
- **ISR** para páginas con contenido Payload (blog, casos, home)
- **Edge runtime** para sitemap.xml, robots.txt, llms.txt, api/og
- **Node runtime** para todo lo que toca Payload Local API

```ts
// En page.tsx o route handler
export const revalidate = 3600; // ISR cada hora
// export const revalidate = false; // SSG puro
// export const runtime = 'edge'; // Edge runtime
```

---

## Decisiones aplicables

- **D-90** Eliminar inline styles en page.tsx (D-90 canon)
- **D-92** Tailwind v4 arbitrary properties
- **D-94** Surface type canon
- **D-97** Surface flow context-only

---

## Cómo agregar nuevas pages

1. Crear `app/(frontend)/[locale]/{page-name}/page.tsx`
2. Default export Server Component async
3. `setRequestLocale(locale)` al inicio
4. Composition exclusiva con atoms/molecules/sections existentes
5. Si necesita nuevo section/molecule, escalar scope M6+
6. i18n: agregar namespace en `messages/es.json` + `messages/en.json`
7. **0 inline styles** (D-90 canon BBF)
8. Metadata SEO: `generateMetadata()` con canonical + hreflang + OG (W-4)
