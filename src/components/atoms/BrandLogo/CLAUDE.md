# CLAUDE.md — BrandLogo

**Brand logo atom canon — 4 variantes compositional + WAAPI animator**

> Tier: atom (Server + Client split, D-99)
> Decisiones: D-77 (surface-aware), D-78 (animated state), D-82 (AI-readable),
>             D-84 (assets), D-99 (split canon), D-DS-08 (rename BBFLogo → BrandLogo)

---

## API

### BrandLogo (Server Component)

```typescript
interface BrandLogoProps {
  variant?: 'icon' | 'horizontal' | 'name-only' | 'stamp';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'hero' | number | string;
  animated?: boolean; // solo relevante con variant="stamp"
  className?: string;
  ariaLabel?: string; // default: "Sivar Brains" — pasar siteName real desde el call site cuando sea posible
}
```

### BrandLogoAnimator (Client Component)

```typescript
interface BrandLogoAnimatorProps {
  children: ReactNode; // BrandLogo esperado (variant=stamp + animated=true)
}
```

### Defaults

- variant: `icon`
- size: `md`
- animated: `false`
- ariaLabel: `"Sivar Brains"` (fallback agnóstico; call sites deberían pasar siteName real vía `getSiteIdentity()`)

---

## Pattern canon

- **Server/Client:** **Server + Client split (D-99)**
  - `BrandLogo`: Server — `fs.readFileSync` SVG inline via `dangerouslySetInnerHTML`
  - `BrandLogoAnimator`: Client — WAAPI `updatePlaybackRate()` en hover
- **Surface-aware:** Sí — color via `currentColor` (heredado del padre)
- **Composition:** Wrap (`<BrandLogoAnimator><BrandLogo /></BrandLogoAnimator>`)
- **AI-readable:** `data-component="brand-logo"` + `data-variant` + `data-animated` ✓

---

## Asset naming contract (D-DS-08 / AssetGenerationCanon §3)

```
CANON FINAL (sb-logo-* — drop-in cuando Zavala/diseño entregue los SVG finales):
  public/assets/brand/logos/sb-logo-icon.svg          variant="icon"
  public/assets/brand/logos/sb-logo-name.svg           nameH (horizontal / name-only)
  public/assets/brand/logos/sb-logo-stamp.svg          nameCircle (stamp)

ACTUAL (apuntando a assets existentes):
  public/assets/brand/logos/BBF-Logo-Icon.svg          → sb-logo-icon.svg
  public/assets/brand/logos/BBF-Logo-Name-H.svg        → sb-logo-name.svg
  public/assets/brand/logos/BBF-Logo-Name-Circle.svg   → sb-logo-stamp.svg
```

**CRÍTICO:** IDs SVG preservados — `BrandLogoAnimator` busca `.bbf-logo-name-circle` class para WAAPI.
Cuando lleguen los SVG finales, actualizar `LOGO_FILES` en `BrandLogo.tsx` (drop-in).

---

## Circuit D-DS-01 ↔ D-DS-08

`getBrandSystem().logoVariant` es exactamente el tipo de `variant` prop de `BrandLogo`.
Se puede pasar directo:

```tsx
const bs = await getBrandSystem();
<BrandLogo variant={bs.logoVariant} size="md" />
```

---

## Tokens canon usados

```css
--bbf-logo-rendered          /* custom prop para size override */
--bbf-logo-size-hero         /* clamp responsive para variant hero */
```

WAAPI constants (en BrandLogoAnimator.tsx):

```typescript
ROTATION_DURATION_IDLE  = 40000ms  // 40s
ROTATION_DURATION_HOVER = 12000ms  // 12s
PLAYBACK_RATE_HOVER     = 3.33x    // 40000/12000
```

---

## Ejemplos canon

### Logo estático header

```tsx
import { BrandLogo } from '@/components/atoms/BrandLogo';

<BrandLogo variant="horizontal" size="md" />
```

### Logo animado hero (canon BBF)

```tsx
import { BrandLogo, BrandLogoAnimator } from '@/components/atoms/BrandLogo';

<BrandLogoAnimator>
  <BrandLogo variant="stamp" size="hero" animated />
</BrandLogoAnimator>
```

### Logo footer minimal

```tsx
<BrandLogo variant="name-only" size="sm" />
```

---

## NO usar

- `BrandLogoAnimator` sin `BrandLogo` dentro (no funciona)
- `BrandLogoAnimator` con `variant !== 'stamp'` (animación no aplica)
- `BrandLogoAnimator` con `animated=false` (WAAPI no tiene qué controlar)
- Modificar SVGs directamente (son source assets, preservar IDs)

---

## Files

- `BrandLogo.tsx` — Server Component (fs.readFileSync + dangerouslySetInnerHTML)
- `BrandLogo.variants.ts` — CVA variant × size
- `BrandLogoAnimator.tsx` — Client Component (WAAPI control)
- `index.ts` — Barrel export
