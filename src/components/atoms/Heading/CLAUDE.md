# CLAUDE.md — Heading

**Heading atom canon BBF — level semántico API, HTML decoupled**

> Tier: atom
> Subordinado a: B-BBF-WEB-M5-D1
> Decisiones: D-80 (asChild), D-82 (AI-readable), D-92 (Tailwind v4 fix), D-95 (level semántico)

---

## API

### Props

```typescript
interface HeadingProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'>, HeadingVariants {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'; // HTML element override
  asChild?: boolean; // Radix Slot
}
```

### Variants (CVA)

- **level:** `display-xl` | `display-lg` | `display-md` | `h1` | `h2` | `h3` | `h4` | `h5` | `h6`
- **weight:** `regular` | `medium` | `semibold` | `bold` | `extrabold` | `black`
- **color:** `primary` | `secondary` | `inverse` | `accent`
- **align:** `left` | `center` | `right`

### Defaults

- level: `h1`
- weight: `bold`
- color: `primary`
- align: `left`

### HTML element inference

- `display-xl`, `display-lg`, `display-md` → `<h1>`
- `h1`..`h6` → el elemento correspondiente

---

## Pattern canon

- **Server/Client:** Server (sin interactividad)
- **Surface-aware:** Vía tokens semánticos (`primary` → `--bbf-text-on-light`, `inverse` → `--bbf-text-on-dark`)
- **Composition:** Monolítica + asChild para casos polimórficos
- **AI-readable:** `data-component="bbf-heading"` + `data-level={level}` ✓

---

## Tokens canon usados

```css
--bbf-font-display             /* font-family display */
--bbf-leading-display          /* line-height para display levels */
--bbf-leading-heading          /* line-height para h1-h6 */
--bbf-tracking-display         /* letter-spacing display */
--bbf-tracking-heading         /* letter-spacing h1-h6 */

/* font-size por level (D-92 arbitrary property) */
--bbf-text-display-xl
--bbf-text-display-lg
--bbf-text-display-md
--bbf-text-h1 .. --bbf-text-h6

/* weight */
--bbf-weight-regular .. --bbf-weight-black

/* color */
--bbf-text-on-light            /* color=primary */
--bbf-text-on-light-secondary  /* color=secondary */
--bbf-text-on-dark             /* color=inverse */
--bbf-accent-red               /* color=accent */
```

---

## D-92 fix crítico (L-92)

```tsx
// ✅ CANON — arbitrary property explícita
className="[font-size:var(--bbf-text-display-lg)]"

// ❌ BUG Tailwind v4 — defaultea a color: (no font-size)
className="text-[var(--bbf-text-display-lg)]"
```

---

## Decisiones aplicables

- **D-80** asChild polymorphism (Radix Slot)
- **D-82** AI-readable canon
- **D-92** Tailwind v4 arbitrary properties (fix TD-M5-D4-CRIT-01)
- **D-95** Prop `level` semántica (NO `size` genérica)

---

## Lecciones canon BBF

- **L-91** Migrar inline-style requiere verificar variant mapea al token exacto
- **L-92** Tailwind v4 `text-[var()]` = color: bug — usar `[font-size:var()]`
- **L-93** Variants semánticos vs tamaño genérico

---

## Ejemplos canon

### Display hero (uso en homepage)

```tsx
import { Heading } from '@/components/atoms/Heading';

<Heading level="display-lg" align="center" color="inverse">
  we build brand brains.
</Heading>
```

### H2 semántico con visual display

```tsx
<Heading as="h2" level="display-md">
  Nuestro método
</Heading>
```

### H3 secundario

```tsx
<Heading level="h3" color="secondary" weight="medium">
  Subtítulo sección
</Heading>
```

### asChild con Link

```tsx
<Heading asChild level="h2">
  <Link href="/manifiesto">Manifiesto</Link>
</Heading>
```

---

## NO usar

- `<Heading size="3rem">` — prop `size` no existe (usar `level`)
- `text-[var(--bbf-text-*)]` en CVA — bug Tailwind v4 (L-92)
- Inline styles font-size (tokens canon obligatorio)
- `color="white"` — usar `color="inverse"` (semántico)

---

## Files

- `Heading.tsx` — Server Component + forwardRef + asChild
- `Heading.variants.ts` — CVA level × weight × color × align
- `index.ts` — Barrel export

---

## Cómo modificar

1. Nuevo level → CVA variant + token typography canon
2. Nuevo weight → CVA variant + `--bbf-weight-*` token
3. Nuevo color → CVA variant + token text-on-* semántico
4. Preservar D-92 (`[font-size:var()]` pattern)
5. Actualizar este CLAUDE.md si cambia API
