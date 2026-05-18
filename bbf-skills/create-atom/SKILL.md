# SKILL: Create Atom

**Construir nuevo atom canon BBF (primitive UI element)**

> Trigger: tarea requiere primitive UI element nuevo (Button, Card, Input, Badge, etc.)
> Output esperado: atom canon BBF completo (4 archivos)
> Tiempo estimado: 30-45 min
> Decisiones canon: D-79, D-80, D-82, D-92, D-95, D-103

---

## Cuándo usar este skill

**Triggers concretos:**
- "Crear atom Card"
- "Agregar Badge primitive"
- "Necesito Input atom"
- Strategic despacha B-BBF-* nuevo atom

**NO usar para:**
- Molecule (atoms compuestos) → usar `create-molecule/SKILL.md`
- Section (page section) → usar `create-section/SKILL.md`

---

## Pre-requisitos

### Leer primero:
- `BBF_DESIGN.md` — Overview sistema canon
- `src/components/CLAUDE.md` — Atomic design canon
- `src/components/atoms/Button/CLAUDE.md` — Ejemplo canon de atom
- `src/styles/CLAUDE.md` — Token system canon

### Verificar disponibilidad:
- Tokens canon CSS variables existentes para el atom
- Si requiere tokens nuevos → escalar a Strategic (L-BBF-98: ≥3 casos justifica foundation)

---

## Proceso canon (paso a paso)

### Paso 1 — Validar scope del atom

Antes de crear, responder:
- ¿Es realmente un atom (primitive) o molecule (composición de atoms)?
- ¿Tiene API semántica clara (`intent` / `level` / `variant`)?
- ¿Usa tokens canon existentes? (ver `src/styles/tokens/semantic/`)
- ¿Es Server o Client Component? (default: Server)

**Si no es claro:** escalar a Strategic.

### Paso 2 — Crear folder estructura canon

```bash
mkdir -p src/components/atoms/{Name}
```

4 archivos canon:
```
atoms/{Name}/
├── {Name}.tsx           Componente
├── {Name}.variants.ts   CVA variants
├── index.ts             Barrel export
└── CLAUDE.md            Documentación AI-readable (D-103)
```

### Paso 3 — Crear `{Name}.variants.ts`

```typescript
/**
 * BBF Design System — {Name} atom variants
 *
 * Subordinado a: B-BBF-WEB-{despacho}
 * Decisiones: D-95 ({prop} semántica), D-92 (Tailwind v4)
 */

import { cva, type VariantProps } from 'class-variance-authority';

export const {name}Variants = cva(
  // Base classes — siempre aplicadas
  [
    'inline-flex items-center',
    'transition-all',
    // ...
  ],
  {
    variants: {
      // Prop semántica canon (D-95) — NO prop genérica
      intent: {
        primary: 'bg-[var(--bbf-surface-black)] text-[var(--bbf-text-on-dark)]',
        secondary: 'bg-[var(--bbf-accent-red)] text-[var(--bbf-text-on-dark)]',
        ghost: 'bg-transparent text-[var(--bbf-text-on-light)]',
      },
      size: {
        sm: 'h-8 px-3 text-sm rounded-md',
        md: 'h-10 px-4 text-base rounded-lg',
        lg: 'h-12 px-6 text-lg rounded-full',
      },
      // Surface-aware si aplica (D-94)
      surface: {
        auto: '',
        dark: '',
        sand: '',
        glass: 'backdrop-blur-md',
      },
    },
    compoundVariants: [
      // Si algún variant tiene override en surface específica
      // { intent: 'ghost', surface: 'dark', class: 'text-[var(--bbf-text-on-dark)]' },
    ],
    defaultVariants: {
      intent: 'primary',
      size: 'md',
      surface: 'auto',
    },
  }
);

export type {Name}Variants = VariantProps<typeof {name}Variants>;
```

### Paso 4 — Crear `{Name}.tsx`

```typescript
/**
 * BBF Design System — {Name} atom
 *
 * Subordinado a: B-BBF-WEB-{despacho}
 * Decisiones: D-82 (AI-readable), D-95 ({prop} semántica)
 *
 * {Description canon BBF del atom}.
 */

// 'use client'; ← Solo si necesita interactividad (state, events, browser APIs)

import * as React from 'react';
import { cn } from '@/lib/utils';
import { {name}Variants, type {Name}Variants } from './{Name}.variants';

export interface {Name}Props
  extends React.HTMLAttributes<HTMLDivElement>, // O elemento apropiado
    {Name}Variants {
  children?: React.ReactNode;
}

export const {Name} = React.forwardRef<HTMLDivElement, {Name}Props>(
  ({ intent, size, surface, className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-component="bbf-{name}"
        className={cn({name}Variants({ intent, size, surface }), className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

{Name}.displayName = '{Name}';
```

### Paso 5 — Crear `index.ts`

```typescript
export { {Name} } from './{Name}';
export type { {Name}Props } from './{Name}';
export { {name}Variants } from './{Name}.variants';
export type { {Name}Variants } from './{Name}.variants';
```

### Paso 6 — Agregar a barrel `atoms/index.ts`

```typescript
// Agregar línea al barrel existente
export * from './{Name}';
```

### Paso 7 — Crear `CLAUDE.md`

Seguir template D-103 (ver `src/components/atoms/Button/CLAUDE.md` como ejemplo).

Secciones requeridas:
1. API (Props + Variants + Defaults)
2. Pattern canon (Server/Client, Surface-aware, Composition, AI-readable)
3. Tokens canon usados
4. CompoundVariants (si aplica)
5. Decisiones aplicables (D-*)
6. Lecciones canon (L-*)
7. Ejemplos canon
8. NO usar (anti-patterns)
9. Files inventory
10. Cómo modificar

### Paso 8 — Verificación canon

```bash
pnpm typecheck   # exit 0 esperado
pnpm build       # exit 0 esperado, páginas sin regresión
```

### Paso 9 — Commit canon

```bash
git add src/components/atoms/{Name}/
git add src/components/atoms/index.ts

git commit -m "feat(atoms): {Name} atom canon BBF

Subordinado a: B-BBF-WEB-{despacho}

Pattern canon:
- Prop {prop} semántica (D-95)
- data-component=bbf-{name} (D-82)
- Tokens canon (NO hardcoded)
- {Server | Client} Component
- Surface-aware: {sí D-94 | no}
- CVA + compoundVariants (si necesario)

Files: {Name}.tsx + {Name}.variants.ts + index.ts + CLAUDE.md

Refs: D-82, D-92, D-95, D-103"

git push origin main
```

---

## Template código canon completo

El patrón existente más limpio como referencia es `Button`:

```
src/components/atoms/Button/
├── Button.tsx          'use client' + forwardRef + Slot
├── Button.variants.ts  CVA intent × size × surface × loading
├── index.ts
└── CLAUDE.md
```

Para Server Component (sin interactividad), `Heading` es el ejemplo:

```
src/components/atoms/Heading/
├── Heading.tsx          forwardRef + Slot + inferElement()
├── Heading.variants.ts  CVA level × weight × color × align
├── index.ts
└── CLAUDE.md
```

---

## Anti-patterns (NO hacer)

| ❌ NO | ✅ Canon BBF |
|------|-------------|
| `variant="primary"` (genérica) | `intent="primary"` (semántica D-95) |
| `style={{ fontSize: '1rem' }}` | `[font-size:var(--bbf-text-body-md)]` (D-92) |
| `className="text-[var(--bbf-text-*)]"` | `[font-size:var(--bbf-text-*)]` (bug Tailwind v4) |
| Hardcoded colors | `text-[var(--bbf-text-on-light)]` tokens canon |
| Compound innecesario | Monolítica (D-79 atoms) |
| DOM traversal via ref para surface | `data-surface` attribute o context (D-97) |
| Crear tokens sin justificación | Reusar canon (L-BBF-98: ≥3 casos) |
| Skip JSDoc con D-* refs | JSDoc obligatorio |
| Skip data-component | AI-readable obligatorio (D-82) |
| Skip CLAUDE.md | D-103 obligatorio |

---

## Verificación canon checklist

- [ ] Folder canon: `atoms/{Name}/`
- [ ] 4 archivos: `.tsx` + `.variants.ts` + `index.ts` + `CLAUDE.md`
- [ ] JSDoc canon con D-* refs
- [ ] `data-component="bbf-{name}"`
- [ ] Tokens canon — NO hardcoded values
- [ ] Prop semántica (`intent` / `level` / `variant`)
- [ ] Surface-aware si aplica (D-94)
- [ ] CompoundVariants si variant tiene weight/style override (D-91 pattern)
- [ ] Export en `atoms/index.ts`
- [ ] CLAUDE.md sigue template D-103
- [ ] tsc exit 0
- [ ] pnpm build exit 0, visual SIN regresiones

---

## Refs

### Decisiones canon
- **D-79** Atoms NO compound por default (monolítica)
- **D-80** asChild pattern via Radix Slot (si polymorphism)
- **D-82** AI-readable canon (data-component)
- **D-91** CompoundVariants para override semántico
- **D-92** Tailwind v4 arbitrary properties
- **D-94** Surface canon 4 valores
- **D-95** Prop semántica (intent/level/variant)
- **D-99** Server + Client split (cuando aplica)
- **D-103** Template canon CLAUDE.md por componente

### Lecciones canon
- **L-91** Migrar inline-style requiere verificar variant mapea token exacto
- **L-92** Tailwind v4 text-[var()] = color bug (usar [font-size:var()])
- **L-93** Variants semánticos vs tamaño genérico
- **L-98** Foundations cuando ≥3 casos justifican

### Documentos relacionados
- `BBF_DESIGN.md` — Overview canon sistema
- `src/components/CLAUDE.md` — Atomic design canon
- `src/components/atoms/Button/CLAUDE.md` — Client atom ejemplo
- `src/components/atoms/Heading/CLAUDE.md` — Server atom ejemplo
- `src/styles/CLAUDE.md` — Token system canon
