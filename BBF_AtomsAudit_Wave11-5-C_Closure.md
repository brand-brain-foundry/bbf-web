# BBF_AtomsAudit — §BB CIERRE Wave 11.5-C (Atoms Cleanup Final)

**Despacho:** B-BBF-WEB-WAVE-11-5-C
**Fecha cierre:** 2026-05-24
**Commit:** [pendiente Zavala stage+commit]
**Hereda:** 1aeb887

---

## Cambios aplicados

### Sub-fase T-C-1: Badge → CVA (TD-11-14)

- **Creado:** `src/components/atoms/Badge/Badge.variants.ts`
- **Migrado:** `Badge.tsx` consume CVA en lugar de inline Records
- **Variants CVA:**
  - `intent`: default / accent / success / beta
  - `size`: xs / sm / md
- **Tokens mapping aplicado (reales del repo):**
  - default: `--bbf-border-on-sand` + `--bbf-text-on-sand-muted`
  - accent: `--bbf-accent-red` + `--bbf-accent-red-hover`
  - success: `--bbf-color-success-border` + `--bbf-color-success-text`
  - beta: `--bbf-accent-blue` + `--bbf-accent-blue-active`
  - Sin fallbacks necesarios — todos los tokens existen en el repo
- **Fix incluido:** `font-[var(--bbf-weight-medium)]` → `[font-weight:var(--bbf-weight-medium)]` (D-BBF-WEB-AA)
- **Sin hover state** (decorativo — Label/flag indicator)
- **Consumer Footer.tsx** verificado: API compatible (intent + size preservados)
- typecheck post: PASS

### Sub-fase T-C-2: NavLink → CVA (TD-11-23)

- **Creado:** `src/components/atoms/NavLink/NavLink.variants.ts`
- **Migrado:** `NavLink.tsx` consume CVA para base classes y underline
- **Variants CVA:**
  - `navLinkBaseVariants`: active boolean (true/false)
  - `navLinkUnderlineVariants`: active boolean (true/false)
- **isActive** calculado en runtime desde `usePathname()` → pasado como `active` prop a ambos CVA
- **Hover protection preservada:** `[@media(hover:hover)]:hover:` (D-BBF-WEB-ZZ Wave 11.5-B)
- **group-hover protegido:** `[@media(hover:hover)]:group-hover:w-full` en underline
- typecheck post: PASS

### Sub-fase T-C-3: Link atom → CVA + hover (TD-11-61)

- **Creado:** `src/components/atoms/Link/Link.variants.ts`
- **Migrado:** `Link.tsx` consume `linkVariants` CVA en lugar de inline Record
- **Variants CVA:** variant: default / subtle / underline
- **Hover protection mantenida:** `[@media(hover:hover)]:hover:` en todos los variants (aplicada Wave 11.5-B)
- **API preservada:** `href`, `variant`, `external`, `className` sin cambios
- typecheck post: PASS

### Sub-fase T-C-4: NewsletterBox heading-sized p + contacto subtitle (TD-11-54)

**Opción aplicada: A — `<Heading asChild><p>` (Heading soporta asChild via Radix Slot)**

- **NewsletterBox L99:** raw `<p>` heading-sized → `<Heading level="h2" weight="bold" tone="default" asChild><p>`
  - Fix doble: `font-[var(--bbf-font-display)] font-[var(--bbf-weight-bold)]` (ambos broken) → tokens via CVA Heading
  - `tone="default"` → `text-[var(--bbf-text-on-sand)]` ✓
  - Import Heading agregado
- **contacto/page.tsx subtitle:** raw `<p>` con `--bbf-text-h1` → `<Heading level="h1" weight="medium" tone="muted" asChild><p>`
  - Fix: `font-[var(--bbf-weight-medium)]` (broken) → `[font-weight:var(--bbf-typography-h1-weight)]` via CVA
  - `tone="muted"` → `text-[var(--bbf-text-on-sand-muted)]` ✓
  - Import `cn` removido (ya no usado)
- **tone prop aplicada** — habilitada por Wave 11.5-B (D-BBF-WEB-YY)
- typecheck post: PASS

### Sub-fase T-C-5: TD-11-36 WONT-FIX cierre formal

**Sin cambios en código.**

**Razón formal del WONT-FIX:**

- **Hipótesis original:** BBFLogo + Icon tienen prop `surface` declarada sin implementación funcional.
- **Realidad verificada (Wave 11.5-A audit):**
  - BBFLogo: usa `currentColor` (D-77 canónico) — color hereda del context padre via CSS.
  - Icon: usa `color` CVA variant con tokens semánticos canónicos.
  - Ambos atoms son correctos en su API actual.
- **Razón WONT-FIX:** hipótesis original era incorrecta. No hay bug a fixear.
- **Aprendizaje:** futuras TDs deben verificarse con audit READ-ONLY antes de programar fixes.

---

## Verificaciones

| Check | Resultado |
|---|---|
| T-C-1 typecheck | PASS |
| T-C-2 typecheck | PASS |
| T-C-3 typecheck | PASS |
| T-C-4 typecheck | PASS |
| `pnpm typecheck` final | PASS |
| `next build` | PASS — todas las páginas generadas |
| 0 warnings nuevos | ✓ |

---

## Diff stat (archivos modificados + nuevos)

```
BBF_AtomsAudit_Wave11-5-B_Closure.md               | moved to bbf-docs (D)
src/app/(frontend)/[locale]/contacto/page.tsx      |  14 +-
src/components/atoms/Badge/Badge.tsx               |  52 +----
src/components/atoms/Badge/Badge.variants.ts       |  NEW
src/components/atoms/Link/Link.tsx                 |  32 +----
src/components/atoms/Link/Link.variants.ts         |  NEW
src/components/atoms/NavLink/NavLink.tsx           |  21 +--
src/components/atoms/NavLink/NavLink.variants.ts   |  NEW
src/components/molecules/NewsletterBox/NewsletterBox.tsx |   7 +-
```

---

## TDs cerradas Wave 11.5-C

- ✅ TD-11-14 MEDIUM Badge → CVA (inline Records → CVA standard)
- ✅ TD-11-23 LOW NavLink → CVA (base + underline variants extraídos)
- ✅ TD-11-54 MEDIUM heading-sized `<p>` (2 instancias: NewsletterBox + contacto)
- ✅ TD-11-61 MEDIUM Link atom → CVA (inline Record → CVA standard)
- ✅ TD-11-36 LOW WONT-FIX formal closure (hipótesis incorrecta documentada)

---

## Wave 11.5 Atoms Foundation COMPLETA

| Sub-Wave | Commit | TDs cerradas |
|---|---|---|
| 11.5-A audit READ-ONLY | (bbf-docs 3c1900c) | — (inventario + TDs detectadas) |
| 11.5-B HIGH fixes | 1aeb887 | TD-11-30, TD-11-55, TD-11-57, TD-11-36 WONT-FIX (4) |
| 11.5-C cleanup atoms | [pendiente commit] | TD-11-14, TD-11-23, TD-11-54, TD-11-61 + TD-11-36 formal (5) |

**Total Wave 11.5: 9 TDs cerradas (incluye 1 WONT-FIX).**

---

## Commit propuesto (NO ejecutado — Zavala)

```bash
git add src/app/\(frontend\)/\[locale\]/contacto/page.tsx \
        src/components/atoms/Badge/Badge.tsx \
        src/components/atoms/Badge/Badge.variants.ts \
        src/components/atoms/Link/Link.tsx \
        src/components/atoms/Link/Link.variants.ts \
        src/components/atoms/NavLink/NavLink.tsx \
        src/components/atoms/NavLink/NavLink.variants.ts \
        src/components/molecules/NewsletterBox/NewsletterBox.tsx \
        BBF_AtomsAudit_Wave11-5-C_Closure.md

git commit -m "feat(wave11.5-c): atoms cleanup final + CIERRE Wave 11.5 — Badge/NavLink/Link CVA + heading-sized p + WONT-FIX TD-11-36

Wave 11.5-C cierra Wave 11.5 Atoms Foundation COMPLETA.

CVA MIGRATIONS:
  Badge: inline Record → CVA intent×size + [font-weight:var()] fix (TD-11-14)
  NavLink: plain cn() → CVA navLinkBaseVariants + navLinkUnderlineVariants (TD-11-23)
  Link: plain Record → CVA linkVariants (TD-11-61)

POST tone CVA FIX (Wave 11.5-B habilitó):
  NewsletterBox L99: raw <p> heading-sized → <Heading level=h2 tone=default asChild><p> (TD-11-54)
  contacto subtitle: raw <p> h1-sized → <Heading level=h1 tone=muted asChild><p> (TD-11-54)

DOCUMENTATION:
  TD-11-36 WONT-FIX formal closure (BBFLogo+Icon ya correctos — hipótesis incorrecta)

PATRONES CANÓNICOS APLICADOS:
  Hover: [@media(hover:hover)]:hover: (D-BBF-WEB-ZZ Wave 11.5-B)
  Font-weight: [font-weight:var()] (D-BBF-WEB-AA Wave 11.5-B)
  CVA: intent×size/variant/active (A-01 Simplicidad)

Wave 11.5 Atoms Foundation COMPLETA — 9 TDs cerradas total.

Próximo: Canon v1.5 + Wave 11.6 Molecules

Refs: AUD-BBF-031, 032, 033, D-BBF-KB-145, D-BBF-WEB-YY/ZZ/AA, R-BBF-12"
```

---

## Próximo paso

**Wave 11.6 Molecules:**
- FormField CVA (TD-11-02/04)
- LanguageSwitcher + MegaMenuPanel + MobileSubMenu + MenuIcon catalog
- Hover protection molecules (14 hovers fuera de scope Wave 11.5-B)
- NavLink underline Option B (TD-11-29 si aplica)

**Sistema atoms 100% canonical, listo para Wave 11.6.**
