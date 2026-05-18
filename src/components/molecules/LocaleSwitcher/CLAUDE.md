# CLAUDE.md — LocaleSwitcher

**Locale switcher molecule canon BBF — monolítica, locale via hook**

> Tier: molecule
> Subordinado a: B-BBF-WEB-M5-D2-LOCALESWITCHER
> Decisiones: D-77 (surface-aware), D-82 (AI-readable), D-85 (monolítica API)

---

## API

### Props

```typescript
interface LocaleSwitcherProps extends LocaleSwitcherVariants {
  locales?: SupportedLocale[];  // default: ['es', 'en']
  className?: string;
  ariaLabel?: string;           // default: "Language switcher"
}

type SupportedLocale = 'es' | 'en';
```

### Variants (CVA — dos CVAs separados)

**Container (`localeSwitcherVariants`):**
- **surface:** `auto` | `sand` | `dark` | `glass`
- **size:** `sm` | `md` | `lg`

**Pill (`localeSwitcherPillVariants`):**
- **size:** `sm` | `md` | `lg`
- **active:** `true` | `false`

### Defaults

- locales: `['es', 'en']`
- surface: `auto`
- size: `md`

---

## Pattern canon

- **Server/Client:** **Client** (`'use client'` — `useLocale`, `useRouter`, `useTransition`)
- **Surface-aware:** Sí (D-94) — `data-surface` en nav container
- **Composition:** **Monolítica** (D-85) — NO dot notation
- **AI-readable:** `data-component="bbf-locale-switcher"` + pills `data-component="bbf-locale-switcher-pill"` + `data-locale` + `data-active` ✓

---

## Routing canon

Usa **`@/i18n/navigation`** (next-intl) — NO `next/navigation` directamente:

```typescript
import { useRouter, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

// currentLocale viene del hook (NO prop)
const currentLocale = useLocale() as SupportedLocale;

// Switch via router.replace con locale
router.replace({ pathname, params }, { locale });
```

---

## Accesibilidad canon

- `aria-current="true"` en pill activa
- `aria-label` bilingüe por locale (`LOCALE_ARIA_LABELS` canon)
- `disabled` en pill activa e isPending
- `<nav>` con aria-label container

---

## Decisiones aplicables

- **D-77** Surface-awareness via data-surface
- **D-82** AI-readable canon
- **D-85** API monolítica (pocas props + routing interno)
- **D-94** Surface type canon 4 valores

---

## Lecciones canon BBF

- **L-95** Primitives vs Semantic separation en token system
- Auto-corrección §14: import path es `@/i18n/navigation` (no `@/lib/i18n/routing`)

---

## Ejemplos canon

### Default (hero)

```tsx
import { LocaleSwitcher } from '@/components/molecules/LocaleSwitcher';

<LocaleSwitcher />
```

### Surface dark

```tsx
<LocaleSwitcher surface="dark" />
```

### Custom aria-label

```tsx
<LocaleSwitcher ariaLabel="Cambiar idioma" />
```

---

## NO usar

- `<LocaleSwitcher.Option>` — NO es compound (D-85 monolítica)
- `currentLocale` prop — viene internamente de `useLocale()`
- Modificar locales sin actualizar routing en `middleware.ts` + next-intl config
- `locales={['fr', 'de']}` sin registrar en i18n config primero

---

## Files

- `LocaleSwitcher.tsx` — Client Component
- `LocaleSwitcher.variants.ts` — 2 CVAs: container + pill
- `index.ts` — Barrel export

---

## Cómo modificar

1. Nuevo locale → agregar a `SupportedLocale`, `LOCALE_LABELS`, `LOCALE_ARIA_LABELS`, locales config + middleware
2. Cambios visuales pill → `localeSwitcherPillVariants` CVA
3. Si compound necesario (muchos variants), escalar a Strategic primero
4. Preservar routing canon `@/i18n/navigation` (NO importar de next/navigation)
5. Actualizar este CLAUDE.md si cambia API
