# CLAUDE.md — src/lib/

**Lib utilities canon BBF**

> Helpers, contexts, hooks, i18n utilities, types.
> Lee antes de crear/modificar utilities compartidas.

---

## Estructura

```
lib/
├── context/
│   └── SurfaceContext.tsx     Surface canon context + provider
├── hooks/
│   └── useSurface.ts          Surface consumer hook
├── i18n/
│   ├── buildAlternates.ts     Genera hreflang alternates para SEO
│   └── index.ts               Re-exports i18n utilities
└── utils.ts                    cn() canon (clsx + twMerge)
```

---

## Surface canon

### Type (D-94 RATIFICADA)

```typescript
export type Surface = 'auto' | 'dark' | 'sand' | 'glass';
```

**4 valores canon:**
- `auto`: contexto heredado (default)
- `dark`: fondos oscuros
- `sand`: fondos claros canon (default BBF página)
- `glass`: superficies translúcidas (backdrop blur)

### Flow (D-97 NUEVA)

Surface se propaga ÚNICAMENTE via `SurfaceContext` (top-down).
DOM traversal por ref DESCARTADO (RSC incompatible).

### Pattern

```tsx
// Provider
import { SurfaceProvider } from '@/lib/context/SurfaceContext';
<SurfaceProvider surface="dark">
  <ChildComponents />
</SurfaceProvider>

// Consumer (Client Component)
import { useSurface } from '@/lib/hooks/useSurface';
const surface = useSurface(); // 'auto' | 'dark' | 'sand' | 'glass'
```

---

## utils.ts (cn canon)

```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Uso:** combinar classes condicionales con merge Tailwind canon.

---

## i18n utilities

### buildAlternates

Genera el objeto `alternates` para Next.js `generateMetadata`:

```typescript
import { buildAlternates } from '@/lib/i18n/buildAlternates';

// En generateMetadata()
const alternates = buildAlternates({ slug: '/manifiesto', locale: 'es' });
```

Produce canonical + hreflang (es, en, x-default) conforme a Canon §5 + regla 30-i18n.

---

## Decisiones aplicables

- **D-77** Surface-awareness híbrido
- **D-94** Surface type canon 4 valores
- **D-97** Surface flow context-only (RSC compatible)

---

## Cómo agregar nuevos utilities

1. Hook reutilizable → `hooks/useNombre.ts`
2. Context global → `context/Nombre.tsx`
3. i18n helper → `i18n/nombre.ts` + re-export en `i18n/index.ts`
4. Utility function → agregar a `utils.ts` o nuevo archivo en `lib/`
5. JSDoc canon con D-* refs

---

## NO crear

- DOM traversal hooks (RSC incompatible, D-97)
- Side-effects globales en módulos
- State management no-context (preferir React Context)
- Types duplicados de Payload (vienen de `payload-types.ts` auto-generado, C-01)
