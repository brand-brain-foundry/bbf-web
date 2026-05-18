# CLAUDE.md — BBFLogo

**BBF Logo atom canon — 4 variantes compositional + WAAPI animator**

> Tier: atom (Server + Client split, D-99)
> Subordinado a: B-BBF-WEB-M5-D1.5-LOGO-SYSTEM-V2 + B-BBF-WEB-M5-E
> Decisiones: D-77 (surface-aware), D-78 (animated state), D-82 (AI-readable), D-84 (assets), D-99 (split canon)

---

## API

### BBFLogo (Server Component)

```typescript
interface BBFLogoProps {
  variant?: 'icon' | 'horizontal' | 'name-only' | 'stamp';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | number | string;
  animated?: boolean; // solo relevante con variant="stamp"
  className?: string;
  ariaLabel?: string; // default: "Brand Brain Foundry"
}
```

### BBFLogoAnimator (Client Component)

```typescript
interface BBFLogoAnimatorProps {
  children: ReactNode; // BBFLogo esperado (variant=stamp + animated=true)
}
```

### Variants (CVA)

- **variant:** `icon` (solo flor), `horizontal` (icon + nombre), `name-only` (solo nombre), `stamp` (icon + nombre circular)
- **size:** `xs`(1.5rem) | `sm`(2rem) | `md`(2.5rem) | `lg`(4rem) | `xl`(6rem) | `hero`(responsive clamp) | número px | string CSS

### Defaults

- variant: `icon`
- size: `md`
- animated: `false`
- ariaLabel: `"Brand Brain Foundry"`

---

## Pattern canon

- **Server/Client:** **Server + Client split (D-99)**
  - `BBFLogo`: Server — `fs.readFileSync` SVG inline via `dangerouslySetInnerHTML`
  - `BBFLogoAnimator`: Client — WAAPI `updatePlaybackRate()` en hover
- **Surface-aware:** Sí — color via `currentColor` (heredado del padre)
- **Composition:** Wrap (`<BBFLogoAnimator><BBFLogo /></BBFLogoAnimator>`)
- **AI-readable:** `data-component="bbf-logo"` + `data-variant` + `data-animated` ✓

---

## SVG assets (D-84)

```
public/assets/brand/logos/
├── BBF-Logo-Icon.svg          variant="icon" y parte de otros
├── BBF-Logo-Name-H.svg        parte de "horizontal" y "name-only"
└── BBF-Logo-Name-Circle.svg   parte de "stamp" (ID #BBF-Logo-Name-Circle canon)
```

**CRÍTICO:** IDs SVG preservados — `BBFLogoAnimator` busca `.bbf-logo-name-circle` class para WAAPI.

---

## Tokens canon usados

```css
--bbf-logo-rendered          /* custom prop para size override */
--bbf-logo-size-hero         /* clamp responsive para variant hero */
```

WAAPI constants (en BBFLogoAnimator.tsx):

```typescript
ROTATION_DURATION_IDLE  = 40000ms  // 40s
ROTATION_DURATION_HOVER = 12000ms  // 12s
PLAYBACK_RATE_HOVER     = 3.33x    // 40000/12000
```

---

## Decisiones aplicables

- **D-77** Surface-awareness via currentColor (atom no conoce color)
- **D-78** Animated state como prop boolean
- **D-82** AI-readable data-component canon
- **D-84** Assets canon path (public/assets/brand/logos/)
- **D-99** Server + Client split — Server carga SVG, Client controla animación

---

## Research aplicable

- **R-BBF-09** WAAPI canon 2026
  - `updatePlaybackRate()` cambia velocidad SIN salto perceptible
  - `prefers-reduced-motion` respetado (early return en useEffect)
  - Animate solo `transform` (no layout)

---

## Ejemplos canon

### Logo estático header

```tsx
import { BBFLogo } from '@/components/atoms/BBFLogo';

<BBFLogo variant="horizontal" size="md" />
```

### Logo animado hero (canon BBF)

```tsx
import { BBFLogo, BBFLogoAnimator } from '@/components/atoms/BBFLogo';

<BBFLogoAnimator>
  <BBFLogo variant="stamp" size="hero" animated />
</BBFLogoAnimator>
```

### Logo footer minimal

```tsx
<BBFLogo variant="name-only" size="sm" />
```

### Logo tamaño custom

```tsx
<BBFLogo variant="icon" size={48} />     // número → px
<BBFLogo variant="icon" size="3rem" />   // string CSS
```

---

## NO usar

- `BBFLogoAnimator` sin `BBFLogo` dentro (no funciona)
- `BBFLogoAnimator` con `variant !== 'stamp'` (animación no aplica)
- `BBFLogoAnimator` con `animated=false` (WAAPI no tiene qué controlar)
- Modificar SVGs directamente (son source assets, preservar IDs)
- `React.CSSProperties` — usar `import type { CSSProperties } from 'react'` (D-96)

---

## Files

- `BBFLogo.tsx` — Server Component (fs.readFileSync + dangerouslySetInnerHTML)
- `BBFLogo.variants.ts` — CVA variant × size
- `BBFLogoAnimator.tsx` — Client Component (WAAPI control)
- `index.ts` — Barrel export (`BBFLogo`, `BBFLogoAnimator`)

---

## Cómo modificar

1. Cambios visuales SVG → editar en `public/assets/brand/logos/` (preservar IDs)
2. Nueva variante → CVA variant + case en `loadSvg` logic de BBFLogo.tsx
3. Cambios velocidad animación → constantes en BBFLogoAnimator.tsx (alinear con tokens)
4. Nuevo tamaño preset → CVA size + CSS custom prop `--bbf-logo-rendered`
5. Si toca pattern Server/Client split, escalar a Strategic (D-99)
