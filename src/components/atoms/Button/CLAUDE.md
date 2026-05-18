# CLAUDE.md — Button

**Button atom canon BBF — intent semántico API, Slot polymorphic**

> Tier: atom
> Subordinado a: B-BBF-WEB-M5-D1-FOUNDATION-ATOMS
> Decisiones: D-79 (compound NO), D-80 (asChild Slot), D-92 (Tailwind v4), D-95 (intent API)

---

## API

### Props

```typescript
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, ButtonVariants {
  asChild?: boolean; // Radix Slot — hereda props al children
}
```

### Variants (CVA)

- **intent:** `primary` | `secondary` | `ghost` | `outline`
- **size:** `sm` | `md` | `lg` | `icon`
- **surface:** `auto` | `sand` | `dark` | `glass`
- **loading:** `true` | `false`

### Defaults

- intent: `primary`
- size: `md`
- surface: `auto`
- loading: `false`
- asChild: `false`

---

## Pattern canon

- **Server/Client:** **Client** (`'use client'` — Slot + event handlers)
- **Surface-aware:** Sí (D-94) — compoundVariants para ghost/outline en dark
- **Composition:** Monolítica + asChild polymorphism (D-80)
- **AI-readable:** `data-component="bbf-button"` + `data-loading` ✓

---

## Tokens canon usados

```css
--bbf-surface-black            /* intent=primary background */
--bbf-surface-black-elevated   /* intent=primary hover */
--bbf-accent-red               /* intent=secondary background */
--bbf-accent-red-hover         /* intent=secondary hover */
--bbf-surface-sand-elevated    /* intent=ghost/outline hover */
--bbf-border-on-light          /* intent=outline border */
--bbf-border-on-dark           /* intent=outline border dark surface */
--bbf-text-on-dark             /* texto en primary/secondary */
--bbf-text-on-light            /* texto en ghost/outline */
--bbf-color-focus-ring         /* focus-visible ring */
```

---

## CompoundVariants canon

```typescript
// Ghost en surface dark
{ intent: 'ghost', surface: 'dark', class: 'text-[var(--bbf-text-on-dark)] hover:...' }
// Outline en surface dark
{ intent: 'outline', surface: 'dark', class: 'border-[var(--bbf-border-on-dark)] ...' }
```

---

## Decisiones aplicables

- **D-79** Atoms NO compound (monolítica)
- **D-80** asChild pattern via Radix Slot
- **D-92** Tailwind v4 arbitrary properties canon
- **D-95** Prop `intent` semántica (NO `variant` genérica)

---

## Lecciones canon BBF

- **L-92** Tailwind v4 arbitrary properties
- **L-93** Variants semánticos — `intent` expresa propósito, no tamaño

---

## Ejemplos canon

### CTA primario

```tsx
import { Button } from '@/components/atoms/Button';

<Button intent="primary" size="lg">Contáctanos</Button>
```

### asChild con Link (polymorphism canon)

```tsx
import { Button } from '@/components/atoms/Button';
import Link from 'next/link';

<Button asChild intent="ghost">
  <Link href="/contacto">Ir a contacto</Link>
</Button>
```

### Secundario en surface dark

```tsx
<Button intent="outline" surface="dark" size="md">Saber más</Button>
```

### Icon button

```tsx
<Button intent="ghost" size="icon" aria-label="Cerrar">
  <Icon icon={X} size="sm" />
</Button>
```

---

## NO usar

- `href` prop directamente — usar `asChild` + `<Link>` o `<a>`
- `intent="variant"` — no existe, usar `intent` semántico
- Inline styles de color/padding (tokens canon)
- `loading={true}` sin feedback visual al usuario

---

## Files

- `Button.tsx` — Client Component (Slot + forwardRef)
- `Button.variants.ts` — CVA intent × size × surface × loading
- `index.ts` — Barrel export

---

## Cómo modificar

1. Nuevo intent → CVA variant + tokens canon
2. Nuevo size → respetar 8pt grid (h-8/10/12 pattern)
3. CompoundVariant si nuevo intent cambia en dark surface
4. Preservar D-92 (arbitrary properties)
5. Actualizar este CLAUDE.md si cambia API
