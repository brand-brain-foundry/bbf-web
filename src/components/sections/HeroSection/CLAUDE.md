# CLAUDE.md — HeroSection

**Hero section canon BBF — compound pattern, renderiza como `<main>`**

> Tier: section
> Decisiones: D-77 (surface-aware), D-82 (AI-readable), D-88 (sections folder), D-89 (compound API), D-94 (Surface canon)

---

## API

### HeroSection (root)

```typescript
interface HeroSectionProps extends HeroSectionVariants {
  className?: string;
  children: ReactNode; // HeroVideo + HeroSection.Content + otros
}
```

### HeroSection.Content (sub-component)

```typescript
interface HeroSectionContentProps extends HeroSectionContentVariants {
  className?: string;
  children: ReactNode;
}
```

### Variants (CVA)

**HeroSection (root):**
- **surface:** `auto` | `dark` | `sand` | `transparent`
- **height:** `screen` | `auto` | `half`

**HeroSection.Content:**
- **align:** `center` | `left` | `right`

### Defaults

- surface: `auto`
- height: `screen`
- align: `center`

---

## Pattern canon

- **Server/Client:** Server (sin interactividad)
- **Surface-aware:** Sí (D-94) — `data-surface` propagado via `data-surface` attribute en root
- **Composition:** **Compound** (D-89) — `HeroSection.Content` sub-component
- **AI-readable:** `data-component="bbf-hero-section"` + `data-surface` + Content `data-component="bbf-hero-section-content"` ✓

---

## Importante: renderiza como `<main>`

```html
<!-- HeroSection root renderiza -->
<main data-component="bbf-hero-section" data-surface="dark" class="...">
```

En homepage es el `<main>` semántico de la página. Si se usa en otras páginas donde hay otro `<main>`, agregar `as` prop o escalar a Strategic para decisión (solo un `<main>` por página).

---

## Surface flow (D-77)

```
data-surface="dark" en el root <main>
→ Componentes hijos pueden leer via CSS [data-surface="dark"] selector
→ NO usa SurfaceContext React (solo data attribute CSS)
```

---

## Tokens canon usados

```css
--bbf-color-bg-base    /* surface=auto background */
--bbf-surface-black    /* surface=dark background */
--bbf-surface-sand     /* surface=sand background */
```

HeroSection.Content usa Tailwind directamente (flex, min-h-screen, z-20, etc.).

---

## Decisiones aplicables

- **D-77** Surface-awareness via `data-surface` attribute
- **D-82** AI-readable data-component
- **D-88** Sections folder (NO organisms/) — folder canon BBF
- **D-89** HeroSection compound API
- **D-90** Eliminar inline styles (page.tsx thin composition)
- **D-94** Surface type canon

---

## Lecciones canon BBF

- **L-91** Migrar inline-style a section variant
- **L-93** Variants semánticos (surface, height) vs genéricos
- **L-96** Cleanups técnicos antes de foundations nuevas

---

## Ejemplos canon

### Hero completo (uso actual homepage)

```tsx
import { HeroSection } from '@/components/sections/HeroSection';
import { BBFLogo, BBFLogoAnimator } from '@/components/atoms/BBFLogo';
import { Heading } from '@/components/atoms/Heading';
import { Text } from '@/components/atoms/Text';
import { Button } from '@/components/atoms/Button';
import { HeroVideo } from '@/components/molecules/HeroVideo';
import { LocaleSwitcher } from '@/components/molecules/LocaleSwitcher';

<HeroSection surface="auto">
  <HeroVideo autoplay muted loop>
    <HeroVideo.Source src="/assets/media/hero/hero.av1.webm" type="webm-vp9" />
    <HeroVideo.Source src="/assets/media/hero/hero.h264.mp4" type="mp4-h264" />
  </HeroVideo>

  <LocaleSwitcher />

  <HeroSection.Content align="center">
    <BBFLogoAnimator>
      <BBFLogo variant="stamp" size="hero" animated />
    </BBFLogoAnimator>

    <Heading level="display-lg" color="inverse" align="center">
      we build brand brains.
    </Heading>

    <Text variant="tagline" color="inverse" align="center">
      PRÓXIMAMENTE
    </Text>

    <Button asChild intent="primary" size="lg">
      <a href="mailto:contact@brandbrainfoundry.com">contactanos</a>
    </Button>
  </HeroSection.Content>
</HeroSection>
```

### Surface dark con height half

```tsx
<HeroSection surface="dark" height="half">
  <HeroSection.Content align="left">
    {/* ... */}
  </HeroSection.Content>
</HeroSection>
```

---

## NO usar

- `HeroSection` en folder `organisms/` (D-88 canon: sections/)
- Múltiples `HeroSection` en una página (renderiza `<main>`, solo uno por página)
- Inline styles en page.tsx que use HeroSection (D-90 canon)
- `surface="glass"` — no existe en HeroSection (usar `transparent` + overlay via HeroVideo.Overlay)
- `maxWidth` prop en Content — no existe (ajustar via className)

---

## Files

- `HeroSection.tsx` — Server Component compound (Root + Content)
- `HeroSection.variants.ts` — 2 CVAs: root (surface × height) + content (align)
- `index.ts` — Barrel export

---

## Cómo modificar

1. Nueva surface → D-94 surface type es sistema (escalar a Strategic — afecta todo el sistema)
2. Nueva height → CVA height variant + token spacing canon
3. Nuevo sub-component (Background, Header) → compound expansion, escalar a Strategic
4. Preservar `data-surface` attribute (surface flow D-77)
5. Actualizar este CLAUDE.md si cambia API
