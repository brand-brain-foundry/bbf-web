---
name: create-page-block
description: Crea un bloque composable de Lexical para el editor de Payload. Usa cuando se necesite un block reutilizable para componer páginas dinámicas (Hero, CTA, FeatureGrid, TestimonialQuote, etc.). Cada block es un schema + un componente React que lo renderiza.
---

# Skill — Crear bloque composable

## Cuándo usar

Cuando una Page (o Post si tiene `blocks` field) necesita un layout-block nuevo y reutilizable. Patrón: cada block es una pieza visual con su propio schema editable desde Payload.

## Estructura

Un block vive en dos lugares:
- `blocks/<BlockName>.ts` — schema Payload (Block config).
- `components/blocks/<BlockName>.tsx` — componente React que lo renderiza.

## Pasos

### 1. Definir el schema

`blocks/<BlockName>.ts`:

```ts
import type { Block } from 'payload';

export const <BlockName>: Block = {
  slug: '<block-name-kebab>',
  labels: {
    singular: { es: '...', en: '...' },
    plural: { es: '...', en: '...' },
  },
  fields: [
    // Campos del block. Recuerda localized: true en lo visible al usuario.
  ],
};
```

### 2. Registrar en collections que lo usen

Por ejemplo en `collections/Pages.ts`:

```ts
{
  name: 'layout',
  type: 'blocks',
  blocks: [Hero, FeatureGrid, CTA, <BlockName>],
}
```

### 3. Generar types

```bash
pnpm payload generate:types
```

### 4. Crear el componente React

`components/blocks/<BlockName>.tsx`:

```tsx
import type { <BlockName>Block } from '@/payload-types';

export function <BlockName>({ data }: { data: <BlockName>Block }) {
  return (
    <section className="...">
      {/* Renderizado mínimo. Respeta tokens del BrandSystem global. */}
    </section>
  );
}
```

### 5. Mapper de blocks

En `components/blocks/index.tsx` agrega al map:

```tsx
import { <BlockName> } from './<BlockName>';

export const blockComponents = {
  hero: Hero,
  featureGrid: FeatureGrid,
  cta: CTA,
  <blockName>: <BlockName>,
};

export function RenderBlocks({ blocks }) {
  return blocks?.map((block, i) => {
    const Component = blockComponents[block.blockType];
    return Component ? <Component key={i} data={block} /> : null;
  });
}
```

### 6. Verificación

- `pnpm typecheck` → 0 errors.
- En el admin Payload, en una Page: el block aparece como opción para agregar a `layout`.
- Renderiza correctamente con datos de prueba.

## Reglas

- **Un block hace una cosa.** Si tu block tiene 12 campos y 3 variantes lógicas: son 3 blocks distintos.
- **Tokens visuales del `BrandSystem` global.** No hardcodees colores, spacing, font sizes.
- **Sin estado de cliente** salvo que sea explícitamente interactivo. Si lo necesita: `'use client'` solo en el sub-árbol interactivo.
- **Accesibilidad obligatoria**: headings semánticos, alt text en imágenes, contraste mínimo AA.
- **Performance**: lazy-load imágenes con `next/image`, evita libraries pesadas para un block decorativo.

## Blocks típicos (no inventes otros sin firma de D-BBF-05)

Sugeridos por Canon §4.1.4 + práctica común:
- `Hero` — headline + subhead + CTA.
- `FeatureGrid` — 3-6 features con icon.
- `CTA` — call to action de página completa.
- `TestimonialQuote` — quote + autor.
- `RichTextSection` — Lexical rich text wrapper.
- `MediaBlock` — imagen o video Mux con caption.
- `LogoCloud` — logos clientes (Canon §4.2.1 `/clientes`).
- `FAQ` — accordion de Q&A (importante para GEO).
- `CaseHighlight` — preview de un Case.

Si Zavala pide un block fuera de esta lista: pídele confirmación antes de inventar el schema.
