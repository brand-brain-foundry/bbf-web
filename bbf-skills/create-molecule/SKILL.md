# SKILL: Create Molecule

**Construir nueva molecule canon BBF (compound o monolítica)**

> Trigger: tarea requiere composition de atoms (FormField, Card, NavigationItem, etc.)
> Output esperado: molecule canon BBF completa
> Tiempo estimado: 45-60 min
> Decisiones canon: D-82, D-85, D-86, D-92, D-94, D-103

---

## Cuándo usar este skill

**Triggers concretos:**
- "Crear molecule FormField (Label + Input + ErrorMessage)"
- "Agregar Card molecule (Image + Heading + Text + Link)"
- "Necesito NavigationItem"
- Strategic despacha B-BBF-* nueva molecule

**NO usar para:**
- Atom (primitive individual) → usar `create-atom/SKILL.md`
- Section (page section completa) → usar `create-section/SKILL.md`

---

## Decisión doctrinal: Monolítica vs Compound

### Monolítica (D-85)

**Cuándo:**
- API simple (≤7 props)
- Uso interno no necesita composition flexible
- Sub-estructura fija (no varía por uso)

**Ejemplo canon:** `LocaleSwitcher` — pocas props, routing interno, no compound necesario

### Compound (D-86)

**Cuándo:**
- Composition flexible necesaria
- Sub-elementos pueden variar por uso (ej: múltiples Sources)
- Parent + sub-components nombrados via dot notation

**Ejemplo canon:** `HeroVideo` — `HeroVideo.Source` × N + `HeroVideo.Overlay` opcional

**Pattern API compound canon:**
```tsx
<Molecule prop="value">
  <Molecule.SubA src="..." type="..." />
  <Molecule.SubB tone="dark" />
</Molecule>
```

**Export compound canon:**
```typescript
export const Molecule = Object.assign(MoleculeRoot, {
  SubA: MoleculeSubA,
  SubB: MoleculeSubB,
});
```

**Si no es claro:** escalar a Strategic.

---

## Pre-requisitos

### Leer primero:
- `src/components/CLAUDE.md` — Atomic design canon
- `src/components/molecules/LocaleSwitcher/CLAUDE.md` — Monolítica ejemplo
- `src/components/molecules/HeroVideo/CLAUDE.md` — Compound ejemplo

### Verificar:
- Atoms necesarios existen en `src/components/atoms/`
- Tokens canon disponibles en `src/styles/tokens/semantic/`
- Surface-aware necesario

---

## Proceso canon (paso a paso)

### Paso 1 — Decidir: monolítica vs compound

Ver sección "Decisión doctrinal" arriba.

### Paso 2 — Crear folder estructura canon

```bash
mkdir -p src/components/molecules/{Name}
```

Archivos canon:
```
molecules/{Name}/
├── {Name}.tsx           Componente (+ sub-components si compound)
├── {Name}.variants.ts   CVA variants
├── index.ts             Barrel export
└── CLAUDE.md            Documentación AI-readable (D-103)
```

### Paso 3a — Implementación MONOLÍTICA

```typescript
/**
 * BBF Design System — {Name} molecule
 *
 * Subordinado a: B-BBF-WEB-{despacho}
 * Decisiones: D-82 (AI-readable), D-85 (monolítica), D-94 (surface)
 */

// 'use client'; ← Si necesita hooks/router/state

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { {name}Variants, type {Name}Variants } from './{Name}.variants';
// Importar atoms necesarios
import { Button } from '@/components/atoms/Button';
import { Heading } from '@/components/atoms/Heading';

export interface {Name}Props extends {Name}Variants {
  // Props específicas
  className?: string;
}

export function {Name}({ surface, size, className }: {Name}Props) {
  return (
    <div
      data-component="bbf-{name}"
      data-surface={surface !== 'auto' ? surface : undefined}
      className={cn({name}Variants({ surface, size }), className)}
    >
      {/* Composition con atoms canon */}
    </div>
  );
}
```

### Paso 3b — Implementación COMPOUND

```typescript
/**
 * BBF Design System — {Name} molecule (compound)
 *
 * Subordinado a: B-BBF-WEB-{despacho}
 * Decisiones: D-82 (AI-readable), D-86 (compound API), D-96 (CSSProperties)
 */

import type { CSSProperties, ReactNode } from 'react'; // D-96: import directo
import { cn } from '@/lib/utils';
import { {name}RootVariants, {name}SubVariants } from './{Name}.variants';

// === Sub-component A ===

export interface {Name}SubAProps {
  src: string;
  type: 'format-a' | 'format-b';
}

function {Name}SubA({ src, type }: {Name}SubAProps) {
  return (
    <div
      data-component="bbf-{name}-sub-a"
      data-type={type}
    />
  );
}

// === Sub-component B (opcional) ===

export interface {Name}SubBProps {
  tone?: 'none' | 'dark' | 'light';
  className?: string;
}

function {Name}SubB({ tone = 'none', className }: {Name}SubBProps) {
  if (tone === 'none') return null;
  return (
    <div
      data-component="bbf-{name}-sub-b"
      data-tone={tone}
      className={cn({name}SubVariants({ tone }), className)}
      aria-hidden="true"
    />
  );
}

// === Root ===

export interface {Name}Props {
  className?: string;
  children: ReactNode;
}

function {Name}Root({ className, children }: {Name}Props) {
  return (
    <div
      data-component="bbf-{name}"
      className={cn({name}RootVariants(), className)}
    >
      {children}
    </div>
  );
}

// === Export compound canon (D-86) ===

export const {Name} = Object.assign({Name}Root, {
  SubA: {Name}SubA,
  SubB: {Name}SubB,
});
```

### Paso 4 — Crear `{Name}.variants.ts`

```typescript
/**
 * BBF Design System — {Name} molecule variants
 *
 * Subordinado a: B-BBF-WEB-{despacho}
 * Decisiones: D-85 (monolítica) o D-86 (compound)
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const {name}Variants = cva(
  'bbf-{name} inline-flex items-center',
  {
    variants: {
      surface: {
        auto: '',
        dark: '',
        sand: '',
        glass: 'backdrop-blur-md',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      surface: 'auto',
      size: 'md',
    },
  }
);

export type {Name}Variants = VariantProps<typeof {name}Variants>;
```

### Paso 5 — Crear `index.ts`

```typescript
export { {Name} } from './{Name}';
export type { {Name}Props } from './{Name}';
// Si compound, también los sub-types:
// export type { {Name}SubAProps, {Name}SubBProps } from './{Name}';
```

### Paso 6 — Agregar a barrel `molecules/index.ts`

```typescript
export * from './{Name}';
```

### Paso 7 — Crear `CLAUDE.md`

Seguir template D-103. Para compound, documentar sub-components individualmente.
Ver `src/components/molecules/HeroVideo/CLAUDE.md` como ejemplo completo.

### Paso 8 — Verificación canon

```bash
pnpm typecheck
pnpm build
```

### Paso 9 — Commit canon

```bash
git add src/components/molecules/{Name}/
git add src/components/molecules/index.ts

git commit -m "feat(molecules): {Name} molecule canon BBF

Subordinado a: B-BBF-WEB-{despacho}

Pattern: {monolítica D-85 | compound D-86}
{Server | Client} Component
Surface-aware: {sí D-94 | no}
AI-readable: data-component canon ✓

Refs: D-82, D-{85|86}, D-92, D-103"

git push origin main
```

---

## Anti-patterns (NO hacer)

| ❌ NO | ✅ Canon BBF |
|------|-------------|
| Monolítica con 10+ props | Compound (D-86) |
| Compound innecesario (un solo sub-element fijo) | Monolítica (D-85) |
| Re-implementar atom dentro de molecule | Importar atom existente |
| `React.CSSProperties` | `import type { CSSProperties } from 'react'` (D-96) |
| currentLocale como prop cuando disponible via hook | Hook interno (`useLocale()`) |
| Skip CLAUDE.md | D-103 obligatorio |

---

## Verificación canon checklist

- [ ] Folder canon: `molecules/{Name}/`
- [ ] Archivos: `.tsx` + `.variants.ts` + `index.ts` + `CLAUDE.md`
- [ ] Pattern claro (monolítica D-85 vs compound D-86)
- [ ] Composition de atoms canon — NO re-implementación de atoms
- [ ] `data-component="bbf-{name}"` en root
- [ ] Sub-components con `data-component` propio (si compound)
- [ ] Export en `molecules/index.ts`
- [ ] CLAUDE.md template D-103
- [ ] tsc exit 0
- [ ] pnpm build exit 0, visual SIN regresiones

---

## Refs

### Decisiones canon
- **D-85** Molecules monolítica pattern
- **D-86** Molecules compound pattern
- **D-82** AI-readable canon
- **D-92** Tailwind v4 arbitrary properties
- **D-94** Surface canon 4 valores
- **D-96** `import type { CSSProperties } from 'react'` canon
- **D-103** Template CLAUDE.md por componente

### Lecciones canon
- **L-92** Tailwind v4 arbitrary property bug
- **L-95** Primitives vs Semantic token separation

### Ejemplos canon
- `src/components/molecules/LocaleSwitcher/` — Monolítica (Client, hooks internos)
- `src/components/molecules/HeroVideo/` — Compound (Source + Overlay, Server)
