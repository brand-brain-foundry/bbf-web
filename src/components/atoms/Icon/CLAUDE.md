# CLAUDE.md — Icon

**Icon atom canon BBF — Lucide React wrapper type-safe**

> Tier: atom
> Subordinado a: B-BBF-WEB-M5-D1
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

## Decisiones aplicables

- **D-77** Surface-aware (color hereda o explícito semántico)
- **D-81** Folder structure canon
- **D-82** AI-readable canon
- **D-83** Lucide icon library canon BBF (NO Heroicons, NO Feather, NO Phosphor)

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

- `name="ArrowRight"` string — pasar el componente directamente: `icon={ArrowRight}`
- Otros icon libraries (D-83 canon BBF es Lucide)
- Sizes fuera de las 5 variantes (si necesitas size custom, considera si justifica nuevo variant)
- Icons sin `aria-label` ni `aria-hidden` (accesibilidad WCAG)

---

## Files

- `Icon.tsx` — Server Component + forwardRef
- `Icon.variants.ts` — CVA size × color
- `index.ts` — Barrel export

---

## Cómo modificar

1. Nuevo size → CVA variant (Tailwind h-*/w-* clases)
2. Nuevo color → CVA variant + token semántico canon
3. NO instalar otras icon libraries (D-83)
4. Si icono Lucide no existe, escalar a Strategic para decisión
5. Actualizar este CLAUDE.md si cambia API
