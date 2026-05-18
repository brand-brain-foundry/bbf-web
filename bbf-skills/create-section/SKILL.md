# SKILL: Create Section

**Construir nueva section canon BBF (page section compound)**

> Trigger: tarea requiere page section completa (Features, CTA, Footer, Testimonials, etc.)
> Output esperado: section canon BBF con compound API
> Tiempo estimado: 60-90 min
> Decisiones canon: D-82, D-88, D-89, D-94, D-103

---

## Cuándo usar este skill

**Triggers concretos:**
- "Crear FeaturesSection"
- "Agregar TestimonialsSection"
- "Necesito FooterSection"
- Strategic despacha B-BBF-* nueva section

**Pattern canon sections:**
- Viven en `src/components/sections/` (D-88: NO organisms/)
- Compound pattern obligatorio — mínimo Root + Content (D-89)
- Surface-aware via `data-surface` attribute (patrón canon BBF)

---

## Pre-requisitos

### Leer primero:
- `src/components/CLAUDE.md` — Atomic design canon
- `src/components/sections/HeroSection/CLAUDE.md` — Ejemplo canon real
- `src/lib/CLAUDE.md` — Surface context (opcional, override programático)

### Verificar:
- Atoms + molecules necesarios existen
- Tokens canon disponibles en `src/styles/tokens/semantic/`
- Qué elemento HTML semántico corresponde (`<section>`, `<main>`, `<footer>`, `<aside>`)

---

## Proceso canon (paso a paso)

### Paso 1 — Validar scope section

Responder antes de crear:
- ¿Es una page section completa (no solo wrapper de componentes)?
- ¿Qué elemento HTML semántico? (`<section>` por default — `<main>` solo una vez por página)
- ¿Requiere composition flexible (compound obligatorio)?
- ¿Surface-aware? (default sí — `auto`)

### Paso 2 — Crear folder estructura canon

```bash
mkdir -p src/components/sections/{Name}
```

Archivos canon:
```
sections/{Name}/
├── {Name}.tsx           Section compound (Root + sub-components)
├── {Name}.variants.ts   CVA variants
├── index.ts             Barrel export
└── CLAUDE.md            Documentación AI-readable (D-103)
```

### Paso 3 — Crear `{Name}.variants.ts`

```typescript
/**
 * BBF Design System — {Name} section variants
 *
 * Subordinado a: B-BBF-WEB-{despacho}
 * Decisiones: D-88 (sections folder), D-89 (compound), D-94 (surface)
 */

import { cva, type VariantProps } from 'class-variance-authority';

// === Root variants ===

export const {name}SectionVariants = cva(
  ['bbf-{name}', 'relative', 'w-full'],
  {
    variants: {
      surface: {
        auto:        'bg-[var(--bbf-color-bg-base)]',
        dark:        'bg-[var(--bbf-surface-black)]',
        sand:        'bg-[var(--bbf-surface-sand)]',
        transparent: '',
      },
      height: {
        screen: 'min-h-screen',
        auto:   '',
        half:   'min-h-[50vh]',
      },
    },
    defaultVariants: {
      surface: 'auto',
      height:  'auto',
    },
  }
);

// === Content sub-variants ===

export const {name}ContentVariants = cva(
  ['bbf-{name}__content', 'relative', 'z-10', 'mx-auto'],
  {
    variants: {
      align: {
        left:   'text-left items-start',
        center: 'text-center items-center',
        right:  'text-right items-end',
      },
    },
    defaultVariants: {
      align: 'center',
    },
  }
);

export type {Name}SectionVariants = VariantProps<typeof {name}SectionVariants>;
export type {Name}ContentVariants = VariantProps<typeof {name}ContentVariants>;
```

### Paso 4 — Crear `{Name}.tsx` con compound API canon

```typescript
/**
 * BBF Design System — {Name} section (compound)
 *
 * Subordinado a: B-BBF-WEB-{despacho}
 * Decisiones: D-82 (AI-readable), D-88 (sections/), D-89 (compound API),
 *             D-94 (Surface canon)
 *
 * Surface flow: data-surface attribute en root (patrón HTML canon BBF).
 * SurfaceContext React es OPCIONAL — solo para override programático JS.
 */

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import {
  {name}SectionVariants,
  {name}ContentVariants,
  type {Name}SectionVariants,
  type {Name}ContentVariants,
} from './{Name}.variants';

/* ============================================================
   CONTENT sub-component
   ============================================================ */

export interface {Name}ContentProps extends {Name}ContentVariants {
  className?: string;
  children: ReactNode;
}

function {Name}Content({ align, className, children }: {Name}ContentProps) {
  return (
    <div
      data-component="bbf-{name}-content"
      className={cn({name}ContentVariants({ align }), className)}
    >
      {children}
    </div>
  );
}

/* ============================================================
   ROOT
   ============================================================ */

export interface {Name}SectionProps extends {Name}SectionVariants {
  className?: string;
  children: ReactNode;
}

function {Name}SectionRoot({
  surface = 'auto',
  height,
  className,
  children,
}: {Name}SectionProps) {
  return (
    <section // O main/footer/aside según semántica
      data-component="bbf-{name}"
      data-surface={surface}
      className={cn({name}SectionVariants({ surface, height }), className)}
    >
      {children}
    </section>
  );
}

/* ============================================================
   COMPOUND EXPORT canon (D-89)
   ============================================================ */

export const {Name}Section = Object.assign({Name}SectionRoot, {
  Content: {Name}Content,
});
```

### Paso 5 — Crear `index.ts`

```typescript
export { {Name}Section } from './{Name}';
export type { {Name}SectionProps, {Name}ContentProps } from './{Name}';
```

### Paso 6 — Agregar a barrel `sections/index.ts`

```typescript
export * from './{Name}Section';
```

### Paso 7 — Crear `CLAUDE.md`

Seguir template D-103 con énfasis en:
- Compound API canon (Root + Content mínimo)
- HTML element semántico usado (y por qué)
- Surface flow via `data-surface` attribute
- Ejemplo composition completa con atoms/molecules

### Paso 8 — Verificación canon

```bash
pnpm typecheck
pnpm build
# Visual: section nueva NO afecta páginas existentes
```

### Paso 9 — Commit canon

```bash
git add src/components/sections/{Name}/
git add src/components/sections/index.ts

git commit -m "feat(sections): {Name}Section canon BBF

Subordinado a: B-BBF-WEB-{despacho}

Pattern compound canon (D-89):
- {Name}Section root (<section> semántico)
- {Name}Section.Content sub-component
- Surface: data-surface attribute canon
- AI-readable: data-component + data-surface

Refs: D-82, D-88, D-89, D-94, D-103"

git push origin main
```

---

## Nota: Surface flow en sections

**Patrón canon BBF:** `data-surface` attribute en el root HTML element.

```html
<!-- Canon BBF — data-surface attribute -->
<section data-surface="dark" data-component="bbf-features">
  <!-- Children leen surface via CSS [data-surface="dark"] selector -->
</section>
```

`SurfaceContext` React es OPCIONAL — solo para override programático desde JS (ej: tema toggle dinámico). La mayoría de sections NO necesitan SurfaceContext.

---

## Anti-patterns (NO hacer)

| ❌ NO | ✅ Canon BBF |
|------|-------------|
| Folder `organisms/{Name}/` | `sections/{Name}/` (D-88) |
| Section sin Content sub-component | Compound mínimo: Root + Content (D-89) |
| `<div>` genérico como raíz | `<section>` / `<main>` / `<footer>` semántico |
| Múltiples `<main>` en una página | Solo uno — HeroSection ya lo ocupa |
| Surface via prop-drilling a todos los children | `data-surface` attribute CSS |
| Inline styles | Tokens canon |
| `surface="glass"` en section (raro) | `transparent` para fondos sin color |

---

## Verificación canon checklist

- [ ] Folder canon: `sections/{Name}/`
- [ ] Compound API: Root + Content mínimo
- [ ] HTML element semántico correcto
- [ ] `data-surface` attribute propagado desde root
- [ ] `data-component="bbf-{name}"` en root
- [ ] `data-component="bbf-{name}-content"` en Content
- [ ] CVA variants: surface + height + align
- [ ] CLAUDE.md template D-103
- [ ] Export en `sections/index.ts`
- [ ] tsc exit 0
- [ ] pnpm build exit 0, visual SIN regresiones

---

## Refs

### Decisiones canon
- **D-88** Sections folder canon (NO organisms)
- **D-89** Section compound API (Root + sub-components)
- **D-94** Surface canon 4 valores
- **D-82** AI-readable canon
- **D-103** Template CLAUDE.md por componente

### Lecciones canon
- **L-91** Migrar inline-style a section variant
- **L-93** Variants semánticos (surface, height) vs genéricos
- **L-96** Cleanups técnicos antes de foundations nuevas

### Ejemplo canon
- `src/components/sections/HeroSection/` — Compound canon (renderiza `<main>`)
