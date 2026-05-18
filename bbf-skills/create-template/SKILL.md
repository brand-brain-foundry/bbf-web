# SKILL: Create Template

**Construir nuevo template canon BBF (composition de sections)**

> Trigger: tarea requiere layout reutilizable que orquesta múltiples sections
> Output esperado: template canon BBF como thin wrapper de sections
> Tiempo estimado: 20-30 min (templates son thin wrappers)
> Decisiones canon: D-82, D-88, D-89, D-103, D-106

---

## Cuándo usar este skill

**Triggers concretos:**
- "Crear CaseTemplate (hero + content + CTA)"
- "Necesito BlogTemplate para pages de posts"
- "Crear HomeTemplate"
- Strategic despacha B-BBF-* nueva template

**NO usar para:**
- Section individual → usar `create-section/SKILL.md`
- Molecule/Atom → skills correspondientes
- Page única sin reutilización (hacer directo en `page.tsx`)

**Regla de decisión:** Si ≥2 pages comparten la misma composition de sections, crear template. Si solo hay 1 page de ese tipo, no necesita template.

---

## Qué es un Template BBF

```
Tokens → Atoms → Molecules → Sections → Templates → Pages
                                          ↑
                              Composition de sections
                              Layout reutilizable
                              Slots via ReactNode props
```

**Templates son thin wrappers** — solo orquestan sections, sin lógica propia.

---

## Pre-requisitos

### Verificar antes de crear:
- ¿Las sections que necesita el template existen?
- Si no existen → crear sections primero (usar `create-section/SKILL.md`)
- `src/components/templates/CLAUDE.md` — documentación del tier
- `src/components/templates/index.ts` — barrel (si existe, agregar)

---

## Proceso canon (paso a paso)

### Paso 1 — Validar scope template

Responder antes de crear:
- ¿Cuántas pages usarán este template? (Debe ser ≥2)
- ¿Qué sections orquesta? (listar)
- ¿Qué slots son obligatorios vs opcionales?
- ¿Tiene lógica de layout (orden fijo, espaciado entre sections)?

### Paso 2 — Crear folder estructura canon

```bash
mkdir -p src/components/templates/{Name}Template
```

Archivos canon:
```
templates/{Name}Template/
├── {Name}Template.tsx    Template (thin wrapper, Server Component)
└── index.ts             Barrel export
```

> Templates NO tienen `.variants.ts` ni `CLAUDE.md` propio.
> El tier completo está documentado en `templates/CLAUDE.md`.

### Paso 3 — Crear `{Name}Template.tsx`

```typescript
/**
 * BBF Design System — {Name}Template
 *
 * Composition de sections para {tipo de página}.
 *
 * Subordinado a: B-BBF-WEB-{despacho}
 * Decisiones: D-88 (sections folder), D-89 (compound API),
 *             D-106 (Templates Tier 4)
 *
 * Slots:
 *   hero  — obligatorio: HeroSection
 *   main  — obligatorio: {ContentSection específica}
 *   cta   — opcional:   CTASection
 */

import type { ReactNode } from 'react';

export interface {Name}TemplateProps {
  hero: ReactNode;
  main: ReactNode;
  cta?: ReactNode;
}

export function {Name}Template({ hero, main, cta }: {Name}TemplateProps) {
  return (
    <>
      {hero}
      {main}
      {cta}
    </>
  );
}
```

**Reglas template:**
- Server Component (sin `'use client'`)
- Sin lógica de negocio
- Sin tokens directos (spacing = responsabilidad de cada section)
- Slots como `ReactNode` props
- JSDoc documenta qué section va en cada slot

### Paso 4 — Crear `index.ts`

```typescript
export { {Name}Template } from './{Name}Template';
export type { {Name}TemplateProps } from './{Name}Template';
```

### Paso 5 — Agregar a barrel `templates/index.ts`

Si `templates/index.ts` no existe, crearlo:

```typescript
export * from './{Name}Template';
```

Si ya existe:
```typescript
export * from './{Name}Template'; // agregar línea
```

### Paso 6 — Usar template en page.tsx

```tsx
// app/(frontend)/[locale]/casos/[slug]/page.tsx
import { CaseTemplate } from '@/components/templates/CaseTemplate';
import { HeroSection } from '@/components/sections/HeroSection';
import { CaseContentSection } from '@/components/sections/CaseContentSection';
import { CTASection } from '@/components/sections/CTASection';

export default async function CasePage({ params }) {
  const data = await getCaseData(params.slug);

  return (
    <CaseTemplate
      hero={
        <HeroSection surface="dark">
          <HeroSection.Content align="center">
            {/* ... */}
          </HeroSection.Content>
        </HeroSection>
      }
      main={<CaseContentSection data={data} />}
      cta={<CTASection />}
    />
  );
}
```

### Paso 7 — Verificación canon

```bash
pnpm typecheck
# Visual: pages que usan el template NO afectadas visualmente
```

### Paso 8 — Commit canon

```bash
git add src/components/templates/{Name}Template/
git add src/components/templates/index.ts

git commit -m "feat(templates): {Name}Template canon BBF

Subordinado a: B-BBF-WEB-{despacho}

Template Tier 4 canon (D-106):
- Thin wrapper — 0 lógica de negocio
- Slots: hero (required), main (required), cta (optional)
- Server Component — RSC compatible
- Orquesta: {lista sections}

Refs: D-88, D-89, D-106"

git push origin main
```

---

## Anti-patterns (NO hacer)

| ❌ NO | ✅ Canon BBF |
|------|-------------|
| Lógica de negocio en template | Solo slots ReactNode |
| Data fetching en template | En page.tsx o section |
| Tokens/estilos directos en template | Responsabilidad de sections |
| Template sin ≥2 páginas que lo usen | Composition directa en page.tsx |
| `.variants.ts` en template | Templates no tienen variants CVA |
| Spacing entre sections en template | Spacing = margin/padding de cada section |

---

## Verificación canon checklist

- [ ] Folder canon: `templates/{Name}Template/`
- [ ] Solo archivos: `.tsx` + `index.ts` (sin `.variants.ts`)
- [ ] Server Component (sin `'use client'`)
- [ ] Props son `ReactNode` slots
- [ ] 0 lógica de negocio / data fetching
- [ ] JSDoc documenta qué section va en cada slot
- [ ] Export en `templates/index.ts`
- [ ] tsc exit 0
- [ ] Visual SIN regresiones en pages existentes

---

## Refs

### Decisiones canon
- **D-88** Sections folder canon (base)
- **D-89** Section compound API (lo que templates orquestan)
- **D-106** Templates Tier 4 canon BBF

### Skill relacionado
- `create-section/SKILL.md` — crear sections que van dentro del template

### Documentación tier
- `src/components/templates/CLAUDE.md` — Templates Tier 4 overview
