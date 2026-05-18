# CLAUDE.md — src/components/templates/

**Templates Tier 4 canon BBF — Composition de sections**

> Tier: template (Nivel 4, entre sections y pages)
> Decisiones: D-88, D-89, D-106

---

## Qué es un Template BBF

Un template es una **composición de sections** que define el layout de una categoría de página, sin datos reales. Templates reciben slots (sections como children) y definen estructura visual + espaciado entre sections.

```
Atomic Design BBF (6 tiers):
Tokens → Atoms → Molecules → Sections → Templates → Pages
                                          ↑
                                       ESTE NIVEL
```

**Diferencia clave:**
- Section = bloque UI autónomo (HeroSection, FeaturesSection, CTASection)
- Template = layout que orquesta sections (qué sections aparecen + en qué orden)
- Page = template + data de Payload CMS

---

## Cuándo usar Templates

Templates son necesarios cuando:
- Múltiples pages comparten la misma estructura de sections (ej: todas las blog posts pages)
- El layout de sections varía entre categorías de páginas (ej: Case layout ≠ Blog layout)
- La composition de sections es compleja y reutilizable

**NO usar templates si:**
- Una page tiene composición única (se puede hacer directo en `page.tsx`)
- Solo hay una página de ese tipo

---

## Folder estructura canon

```
components/templates/
├── {Name}Template/
│   ├── {Name}Template.tsx     Template (Server Component, thin wrapper)
│   └── index.ts               Barrel export
└── index.ts                   Barrel export templates
```

> Templates NO tienen `.variants.ts` (son thin wrappers de sections).
> Templates NO tienen `CLAUDE.md` por folder (este archivo cubre todos).

---

## Pattern canon

```tsx
/**
 * BBF Design System — {Name}Template
 *
 * Composition de sections para {tipo de página}.
 * Decisiones: D-88, D-89, D-106
 */

import type { ReactNode } from 'react';

interface {Name}TemplateProps {
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

**Templates son:**
- Server Components (no interactividad propia)
- Thin wrappers — NUNCA lógica de negocio
- Slots via `ReactNode` props (no composition fija)
- Sin tokens directos (spacing entre sections va en cada section)

---

## Relación con Pages

```tsx
// app/(frontend)/[locale]/casos/[slug]/page.tsx
import { CaseTemplate } from '@/components/templates/CaseTemplate';
import { HeroSection } from '@/components/sections/HeroSection';
import { CaseContentSection } from '@/components/sections/CaseContentSection';
import { CTASection } from '@/components/sections/CTASection';

export default function CasePage({ data }) {
  return (
    <CaseTemplate
      hero={<HeroSection>...</HeroSection>}
      main={<CaseContentSection data={data} />}
      cta={<CTASection />}
    />
  );
}
```

---

## Estado actual (M5-ADMIN-1)

Templates Tier 4 está DOCUMENTADO pero NO hay templates implementados aún.

Las primeras templates se crearán cuando se construyan:
- `CaseTemplate` — para páginas de casos (B-BBF-WEB-H1-*)
- `BlogTemplate` — para páginas de posts
- `HomeTemplate` — si la home requiere composition compleja

---

## Skill relacionado

`bbf-skills/create-template/SKILL.md` — proceso canon para crear nuevos templates.

---

## Decisiones aplicables

- **D-88** Sections folder canon (base para templates)
- **D-89** Section compound API (lo que templates orquestan)
- **D-106** Templates Tier 4 canon BBF

---

## Lecciones aplicables

- **L-96** Cleanups técnicos antes de foundations nuevas
- **L-98** Foundations cuando ≥3 casos justifican
