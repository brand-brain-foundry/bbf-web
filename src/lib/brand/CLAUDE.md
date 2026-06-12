# CLAUDE.md — lib/brand/

**BrandSystem consumer helpers — D-DS-01 (2026-06-12)**

---

## Contrato D-DS-01 (Opción B firmada)

BrandSystem global almacena **selectores de alto nivel**, NUNCA valores CSS crudos.

| Selector | Tipo | Posibles valores | Qué controla |
|---|---|---|---|
| `primaryPalette` | `'red' \| 'blue'` | red, blue | `data-palette` attribute → CSS cascade |
| `themeMode` | `'light' \| 'dark' \| 'auto'` | light, dark, auto | `data-theme` attribute → CSS cascade |
| `displayFamily` | `'inter' \| 'custom'` | inter, custom | Font vars CSS (`--bbf-font-display`) |
| `bodyFamily` | `'mulish' \| 'custom'` | mulish, custom | Font vars CSS (`--bbf-font-body`) |
| `logoVariant` | `'icon' \| 'horizontal' \| 'name-only' \| 'stamp'` | — | `<BrandLogo variant>` prop |
| `accentGradient` | `'red-animated' \| 'blue-animated' \| 'none'` | — | CSS class en gradient consumers |

**Los valores CSS (`#hex`, `font-family`, px) NUNCA entran en este global.**
Viven en tokens CSS (`primitives/*.css`, `semantic/*.css`).

---

## Usage

```tsx
// Server Component (RSC, ISR-safe)
import { getBrandSystem } from '@/lib/brand/getBrandSystem';

const bs = await getBrandSystem();

// Aplicar palette via data attribute
<html data-palette={bs.primaryPalette} data-theme={bs.themeMode}>

// Logo canonical
<BrandLogo variant={bs.logoVariant} size="md" />

// Gradient canonical
<span className={bs.gradientClass}>Texto con gradiente</span>
```

---

## Circuit D-DS-01 ↔ D-DS-08

`getBrandSystem().logoVariant` tiene exactamente el tipo `BrandLogoVariant`.
Se puede pasar directo como `variant` prop a `<BrandLogo>` sin casting.

---

## NUNCA hacer

- Nunca leer BrandSystem desde cliente (`'use client'`)
- Nunca cachear manualmente — Next.js ISR lo gestiona
- Nunca extender con valores CSS crudos
- Nunca duplicar los selectores en otro archivo de config
