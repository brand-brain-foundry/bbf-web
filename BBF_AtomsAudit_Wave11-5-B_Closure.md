# BBF_AtomsAudit — §AA CIERRE Wave 11.5-B (Atoms HIGH Fixes)

**Despacho:** B-BBF-WEB-WAVE-11-5-B
**Fecha cierre:** 2026-05-24
**Commit:** [pendiente Zavala stage+commit]
**Hereda:** 3c874f7

---

## Cambios aplicados

### Sub-fase T-B-1: tone prop CVA fix (TD-11-55)

- `Heading.tsx`: `tone` agregado a destructuring de props + a llamada `headingVariants()`
- `Text.tsx`: `tone` agregado a destructuring de props + a llamada `textVariants()`
- API ahora consistente: `level/weight/align/tone` aplicados uniformemente en CVA
- 0 cambio visual (0 consumers activos previos — tone prop era dead code)
- Habilita: TD-11-54 fix (NewsletterBox + contacto subtitle con tonos canónicos)
- Decisión aplicada: D-BBF-WEB-YY Opción A

### Sub-fase T-B-2: Hover sticky mobile fix (TD-11-57)

- Scope C aplicado: atoms + 2 CSS files (D-BBF-WEB-ZZ Opción C)
- **Approach aplicado:** Tailwind v4 arbitrary variant stacking `[@media(hover:hover)]:hover:` para atoms; `@media (hover: hover)` wrap directo en CSS files
- Atoms afectados:
  - `Button.variants.ts`: 7 hovers protegidos (intent primary/secondary/outline/ghost + 3 compoundVariants)
  - `Link.tsx`: 3 hovers protegidos (default/subtle/underline variants)
  - `NavLink.tsx`: 2 hovers protegidos (`hover:text-accent-red` + `group-hover:w-full` underline)
- CSS files:
  - `hero.css`: `.bbf-cta-pill:hover` + `.bbf-cta-pill:hover .bbf-cta-arrow` envueltos en `@media (hover: hover)`
  - `gradient-animations.css`: `.bbf-gradient-red-hover:hover` + `.bbf-btn-gradient-primary:hover` envueltos en `@media (hover: hover)`
- Fuera de scope (Wave 11.6+): molecules, organisms, blocks, sections, templates (~14 hovers)
- Ya protegidos — no tocados: `logo.css`, `motion-patterns.css`

### Sub-fase T-B-3: CSS warnings font-weight fix (TD-11-30)

- 22 instancias migradas total (11 en `Heading.variants.ts` + 11 en `Text.variants.ts`)
- Causa raíz: `font-[var(--bbf-typography-*-weight)]` → Tailwind v4 interpreta `font-[var()]` como `font-family:` (no `font-weight:`) cuando no hay type hint
- Fix canónico aplicado (extiende L-BBF-92 a font-weight):
  - `font-[var(--bbf-typography-*-weight)]` → `[font-weight:var(--bbf-typography-*-weight)]`
  - `font-[var(--bbf-weight-*)]` → `[font-weight:var(--bbf-weight-*)]`
  - `font-[var(--bbf-*-font)]` → `[font-family:var(--bbf-*-font)]` (bonus: elimina ambigüedad)
  - `font-[var(--bbf-font-*)]` → `[font-family:var(--bbf-font-*)]` (base class)
- Build CSS warnings: 8 → 0 (solo queda 1 ESLint directive warning, no CSS)
- Posible impacto visual positivo: pesos de headings/text ahora aplicados correctamente

---

## Verificaciones

| Check | Resultado |
|---|---|
| `pnpm typecheck` pre-fix | PASS |
| T-B-1 typecheck | PASS |
| T-B-2 typecheck | PASS |
| T-B-3 typecheck | PASS |
| `pnpm typecheck` final | PASS |
| `next build` | PASS — todas las páginas generadas |
| CSS warnings ANTES | ~8 |
| CSS warnings DESPUÉS | 0 (1 ESLint no-CSS) |
| `font-[var(--bbf-typography-*-weight)]` restantes | 0 |
| `[font-weight:var(--bbf-typography-*)]` en atoms | 22 |
| `@media (hover: hover)` en hero.css | 1 bloque |
| `@media (hover: hover)` en gradient-animations.css | 2 bloques |

---

## Diff stat

```
src/components/atoms/Button/Button.variants.ts   | 16 +++++-----
src/components/atoms/Heading/Heading.tsx         |  7 +++--
src/components/atoms/Heading/Heading.variants.ts | 38 +++++++++++++-----------
src/components/atoms/Link/Link.tsx               |  6 ++--
src/components/atoms/NavLink/NavLink.tsx         |  6 ++--
src/components/atoms/Text/Text.tsx               |  3 +-
src/components/atoms/Text/Text.variants.ts       | 35 ++++++++++++----------
src/styles/tokens/components/hero.css            | 16 +++++-----
src/styles/utilities/gradient-animations.css     | 12 +++++---
9 files changed, 79 insertions(+), 60 deletions(-)
```

---

## TDs cerradas

- ✅ TD-11-55 HIGH tone prop CVA bug (D-BBF-WEB-YY aplicada)
- ✅ TD-11-57 HIGH Hover sticky mobile scope C (D-BBF-WEB-ZZ aplicada)
- ✅ TD-11-30 HIGH CSS warnings font-weight (D-BBF-WEB-AA aplicada)
- ✅ TD-11-36 WONT-FIX (hipótesis incorrecta — BBFLogo usa currentColor canónico, Icon usa color CVA variant; ambos correctos)

## TDs habilitadas para Wave 11.5-C

- 🔓 TD-11-54 NewsletterBox heading-sized `<p>` + contacto subtitle (desbloqueada por TD-11-55 cierre)
- 🔓 TD-11-57 PARCIAL (molecules/organisms pendientes Wave 11.6)

---

## Commit propuesto (NO ejecutado — Zavala)

```bash
git add src/components/atoms/Button/Button.variants.ts \
        src/components/atoms/Heading/Heading.tsx \
        src/components/atoms/Heading/Heading.variants.ts \
        src/components/atoms/Link/Link.tsx \
        src/components/atoms/NavLink/NavLink.tsx \
        src/components/atoms/Text/Text.tsx \
        src/components/atoms/Text/Text.variants.ts \
        src/styles/tokens/components/hero.css \
        src/styles/utilities/gradient-animations.css \
        BBF_AtomsAudit.md \
        BBF_AtomsAudit_Wave11-5-B_Closure.md

git commit -m "feat(wave11.5-b): atoms HIGH fixes — tone prop CVA + hover sticky mobile + CSS warnings font-weight

Wave 11.5-B resuelve 3 TDs HIGH detectadas en Atoms audit Wave 11.5-A.

FIXES APLICADOS:
  - TD-11-55 HIGH tone prop CVA bug (D-BBF-WEB-YY aplicada):
    Heading.tsx + Text.tsx: tone agregado a destructuring + *Variants() calls
    API ahora consistente (level/weight/align/tone aplicados uniformemente)
    Habilita TD-11-54 (NewsletterBox + contacto subtitle)

  - TD-11-57 HIGH Hover sticky mobile (D-BBF-WEB-ZZ aplicada):
    Scope C: atoms (Button/Link/NavLink) + 2 CSS files (hero.css, gradient-animations.css)
    Approach: Tailwind v4 [@media(hover:hover)]:hover: stacking para atoms;
              @media (hover: hover) wrap directo en CSS files
    Fuera de scope: molecules/organisms/blocks/sections/templates (Wave 11.6+)

  - TD-11-30 HIGH CSS warnings font-weight (D-BBF-WEB-AA aplicada):
    22 instancias font-[var(--bbf-typography-*-weight)] -> [font-weight:var(--bbf-typography-*-weight)]
    Causa raíz: Tailwind v4 interpreta font-[var()] como font-family
    Build warnings: 8 -> 0

CIERRE TDs:
  TD-11-30, TD-11-55, TD-11-57, TD-11-36 WONT-FIX

PRÓXIMO: Wave 11.5-C (Badge/NavLink/Link CVA + TD-11-54 + TD-11-36 closure formal)

Refs: AUD-BBF-031, AUD-BBF-032, D-BBF-KB-145, D-BBF-WEB-YY/ZZ/AA"
```

---

## Próximo paso

**Wave 11.5-C** (cleanup atoms restantes):
- Badge CVA (TD-11-14)
- NavLink CVA (TD-11-23)
- Link atom CVA + hover (TD-11-61)
- TD-11-36 cierre formal WONT-FIX
- TD-11-54 NewsletterBox + contacto subtitle (post tone fix)

Estimado: ~40-50 min CC.
