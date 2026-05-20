# CLAUDE.md — Text

**Text atom canon BBF — variant semántico + compoundVariants para weight override**

> Tier: atom
> Subordinado a: B-BBF-WEB-M5-D1 + M5-D4 + M5-D6
> Decisiones: D-82 (AI-readable), D-91 (tagline canon), D-92 (Tailwind v4), D-95 (variant semántico)

---

## API

### Props

```typescript
interface TextProps extends Omit<React.HTMLAttributes<HTMLElement>, 'color'>, TextVariants {
  as?: 'p' | 'span' | 'div'; // HTML element override
  asChild?: boolean;          // Radix Slot
}
```

### Variants (CVA)

- **variant:** `body-lg` | `body-md` | `body-sm` | `caption` | `overline` | `tagline`
- **weight:** `regular` | `medium` | `semibold` | `bold`
- **color:** `primary` | `secondary` | `muted` | `inverse` | `accent`
- **align:** `left` | `center` | `right`

### Defaults

- variant: `body-md`
- weight: `regular`
- color: `primary`
- align: `left`

### HTML element inference

- `caption`, `overline` → `<span>`
- otros → `<p>`

---

## Pattern canon

- **Server/Client:** Server (sin interactividad)
- **Surface-aware:** Vía tokens semánticos de color
- **Composition:** Monolítica + asChild para polimorfismo
- **AI-readable:** `data-component="bbf-text"` + `data-variant={variant}` ✓

---

## CompoundVariants canon (fix TD-M5-D4-LATENTE-01, M5-D6)

```typescript
compoundVariants: [
  // overline override: siempre bold (weight default regular lo sobreescribia)
  { variant: 'overline', weight: 'regular', class: 'font-[var(--bbf-weight-bold)]' },
  // tagline override: siempre bold
  { variant: 'tagline', weight: 'regular', class: 'font-[var(--bbf-weight-bold)]' },
]
```

**Razón:** `tailwind-merge` eliminaba `font-bold` de overline/tagline porque CVA procesa `defaultVariants` después del variant class. CompoundVariants se aplican LAST → `font-bold` gana correctamente. (L-97 audit técnico HTML reveló este bug)

---

## Tokens canon usados

```css
--bbf-font-body                /* font-family body */
--bbf-leading-body             /* line-height base */
--bbf-leading-snug             /* caption */

/* font-size por variant */
--bbf-text-body-lg
--bbf-text-body-md
--bbf-text-body-sm
--bbf-text-caption
--bbf-text-overline
--bbf-text-base                /* tagline usa body base */

--bbf-tracking-overline        /* 0.12em — overline */
                               /* tagline: tracking-[0.15em] hardcoded */

/* weight */
--bbf-weight-regular .. --bbf-weight-bold

/* color */
--bbf-text-on-light            /* primary */
--bbf-text-on-light-secondary  /* secondary */
--bbf-text-on-light-muted      /* muted */
--bbf-text-on-dark             /* inverse */
--bbf-accent-red               /* accent */
```

---

## Decisiones aplicables

- **D-82** AI-readable canon
- **D-91** Hero composition canon — `tagline` es el variant semántico para hero subtitle (NO `overline`)
- **D-92** Tailwind v4 arbitrary properties (fix TD-M5-D4-CRIT-02)
- **D-95** Prop `variant` semántica

---

## Lecciones canon BBF

- **L-91** Migrar inline-style: verificar variant mapea token exacto
- **L-92** Tailwind v4 `text-[var()]` = color bug
- **L-93** `tagline` ≠ `overline` — semánticamente distintos aunque visualmente similares
- **L-97** Audits técnicos HTML inspection revelan bugs latentes (weight conflict CVA)

---

## Ejemplos canon

### Body texto

```tsx
import { Text } from '@/components/atoms/Text';

<Text variant="body-md">Cuerpo de texto canon BBF.</Text>
```

### Hero tagline (canon D-91)

```tsx
<Text variant="tagline" color="inverse" align="center">
  PRÓXIMAMENTE
</Text>
```

### Overline eyebrow

```tsx
<Text variant="overline" color="accent">
  NUEVO
</Text>
```

### Caption muted

```tsx
<Text variant="caption" color="muted">
  Última actualización: 2026-05-17
</Text>
```

### asChild span polimórfico

```tsx
<Text asChild variant="body-sm" color="muted">
  <time dateTime="2026-05-17">17 de mayo, 2026</time>
</Text>
```

---

## NO usar

- `<Text variant="overline">` para hero subtitle — usar `variant="tagline"` (D-91)
- `weight="regular"` en `overline`/`tagline` esperando que aplique (compoundVariants lo overridea siempre)
- `text-[var(--bbf-text-base)]` sin hint de propiedad — Tailwind v4 lo interpreta como color (L-92); usar `[font-size:var(--bbf-text-base)]`
- `color="white"` — usar `color="inverse"` (semántico)

---

## Files

- `Text.tsx` — Server Component + Slot polymorphism
- `Text.variants.ts` — CVA variant × weight × color × align + compoundVariants
- `index.ts` — Barrel export

---

## Cómo modificar

1. Nuevo variant → CVA + token typography canon
2. Si variant tiene weight inherente → agregar compoundVariant (pattern D-91)
3. Preservar `[font-size:var()]` pattern (D-92)
4. Actualizar este CLAUDE.md si cambia API
