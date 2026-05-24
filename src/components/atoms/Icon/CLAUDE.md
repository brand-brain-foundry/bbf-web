# CLAUDE.md — Icon

**Icon atom canon BBF — Lucide React wrapper type-safe**

> Tier: atom
> Decisiones: D-77 (surface-aware), D-81 (folder canon), D-82 (AI-readable), D-83 (Lucide canon)

---

## API

### Props

```typescript
interface IconProps extends Omit<LucideProps, 'size' | 'color'>, IconVariants {
  icon: LucideIcon; // Lucide component pasado como prop
}
```

### Variants (CVA)

- **size:** `xs`(12px) | `sm`(16px) | `md`(20px) | `lg`(24px) | `xl`(32px)
- **color:** `current` | `primary` | `secondary` | `muted` | `accent` | `inverse`

### Defaults

- size: `md`
- color: `current`

---

## Pattern canon

- **Server/Client:** Server (sin interactividad, SVG estático)
- **Surface-aware:** Vía `color` variant con tokens semánticos
- **Composition:** Wrapper monolítico de `LucideIcon`
- **AI-readable:** `data-component="bbf-icon"` ✓

---

## Tokens canon usados

```css
--bbf-text-on-light            /* color=primary */
--bbf-text-on-light-secondary  /* color=secondary */
--bbf-text-on-light-muted      /* color=muted */
--bbf-accent-red               /* color=accent */
--bbf-text-on-dark             /* color=inverse */
```

`color="current"` (default) hereda del padre via `text-current`.

---

## Icon registry canon (D-108)

`registry.ts` — registro centralizado con ~57 íconos Lucide en 7 categorías con nombres semánticos:

```typescript
import { Icons, Icon } from '@/components/atoms/Icon';

// Acceso semántico (D-108)
<Icon icon={Icons.arrowRight} size="md" />
<Icon icon={Icons.close} size="sm" color="inverse" />
<Icon icon={Icons.checkCircle} size="lg" color="accent" />

// Categorías disponibles:
// Navigation: arrowRight, arrowLeft, arrowUp, arrowDown, chevronRight,
//             chevronLeft, chevronDown, chevronUp, menu, close, externalLink, home
// Actions:    search, plus, minus, edit, trash, download, upload,
//             share, copy, check, refresh, filter
// Status:     checkCircle, error, warning, alert, info, loading, eye, eyeOff
// Communication: mail, phone, message, send, bell
// Content:    file, image, video, play, pause, bookOpen, calendar,
//             clock, star, bookmark, link
// User:       user, users, settings, logout, login, globe
// Brand/Decorative: sparkles, zap, building, briefcase, target,
//                   layers, award, trending, heart
```

`IconCanon` type = `keyof typeof Icons` — type-safe icon names del registry.

---

## Decisiones aplicables

- **D-77** Surface-aware (color hereda o explícito semántico)
- **D-81** Folder structure canon
- **D-82** AI-readable canon
- **D-83** Lucide icon library canon BBF (NO Heroicons, NO Feather, NO Phosphor)
- **D-108** Icon registry centralizado con nombres semánticos

---

## Ejemplos canon

### Icon inline en Button

```tsx
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Icon } from '@/components/atoms/Icon';

<Button intent="primary">
  Continuar <Icon icon={ArrowRight} size="sm" />
</Button>
```

### Icon decorativo (aria-hidden)

```tsx
import { Sparkles } from 'lucide-react';

<Icon icon={Sparkles} size="lg" color="accent" aria-hidden />
```

### Icon con accesibilidad

```tsx
import { Mail } from 'lucide-react';

<Icon icon={Mail} size="md" aria-label="Contacto por email" />
```

### Icon en surface dark (inverse)

```tsx
import { Search } from 'lucide-react';

<Icon icon={Search} color="inverse" size="md" />
```

---

## NO usar

- `name="ArrowRight"` string — pasar el componente directamente: `icon={ArrowRight}` o `icon={Icons.arrowRight}`
- Otros icon libraries (D-83 canon BBF es Lucide)
- Sizes fuera de las 5 variantes (si necesitas size custom, considera si justifica nuevo variant)
- Icons sin `aria-label` ni `aria-hidden` (accesibilidad WCAG)

---

## Files

- `Icon.tsx` — Server Component + forwardRef
- `Icon.variants.ts` — CVA size × color
- `registry.ts` — Icon registry canon (D-108) — `Icons` const + `IconCanon` type
- `index.ts` — Barrel export (re-exporta Icon, iconVariants, Icons, IconCanon)

---

## Cómo modificar

1. Nuevo size → CVA variant (Tailwind h-*/w-* clases)
2. Nuevo color → CVA variant + token semántico canon
3. NO instalar otras icon libraries (D-83)
4. Si icono Lucide no existe, escalar a Strategic para decisión
5. Actualizar este CLAUDE.md si cambia API
