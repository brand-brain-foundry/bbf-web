# BBF_TypographyAudit — §AA CIERRE Wave 11.4-C2b

**Despacho:** B-BBF-WEB-WAVE-11-4-C2b
**Fecha cierre:** 2026-05-24
**Commit:** [pendiente Zavala stage+commit]

---

## Cambios aplicados

### Archivos modificados (7)

- `src/components/blocks/Stat.tsx` (T-C2b-1)
- `src/components/molecules/NewsletterBox/NewsletterBox.tsx` (T-C2b-2)
- `src/app/(frontend)/[locale]/contacto/page.tsx` (T-C2b-3)
- `src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx` (T-C2b-5)
- `src/components/molecules/MobileSubMenu/MobileSubMenu.tsx` (T-C2b-5)
- `src/components/organisms/Footer/Footer.tsx` (T-C2b-6)
- `src/styles/utilities/section-paddings.css` (T-C2b-6 — agregó utilities default)

### Migraciones aplicadas

| Sub-fase | Componente | De | A | Status |
|---|---|---|---|---|
| C2b-1 | Stat.tsx | `--bbf-text-display-lg` (raw `<p>`) | `--bbf-text-display-2` (raw `<p>`) | DONE (token migrado; refactor Heading atom → §10) |
| C2b-2 | NewsletterBox | 4 raw `<p>` | Text atom (`body-md`, `body-sm`, `body-sm`, `caption`) | DONE |
| C2b-3 | contacto/page | raw `<h1>` + raw intro `<p>` | `<Heading level="display-2" as="h1">` + `<Text variant="body-md">` | DONE |
| C2b-4 | HeroSection | `tracking-[0.15em]` hardcoded | — | SKIPPED (patrón no encontrado — TD-11-46 ya cerrada Wave 11.4-C1) |
| C2b-5 | MegaMenu + MobileSubMenu | Tailwind `leading-snug` (1.375) | `leading-[var(--bbf-leading-snug)]` (1.15) | DONE |
| C2b-6 | Footer | `mt-20 lg:mt-32` | `bbf-section-mt-default lg:bbf-section-mt-xl` | DONE |

### Detalle por sub-fase

**T-C2b-1 Stat.tsx:**
- Patrón encontrado: raw `<p>` con `[font-size:var(--bbf-text-display-lg)]` (NO usa Heading atom)
- Migrado: `--bbf-text-display-lg` → `--bbf-text-display-2` (42px fijo vs fluid legacy)
- §10: Refactor completo a `<Heading level="display-2">` pendiente (excede scope C2b-1)

**T-C2b-2 NewsletterBox.tsx:**
- 4 raw `<p>` migrados a Text atom (+ import `{ Text }` agregado)
- Success title: `<Text variant="body-md" weight="semibold">` con color className
- Success message: `<Text variant="body-sm">` con color className
- Description: `<Text variant="body-sm">` con tone className (`text-on-sand-muted`)
- Privacy note: `<Text variant="caption" as="p">` con tone className (`text-on-sand-subtle`)
- §10: `<p>` título (L94, `text-h2` size + display font + bold) — sin variant Text equivalente. Candidato a `<Heading level="h2" as="p">` en Wave 11.4-C2c o sub-fase dedicada.
- `<p role="alert">` (error state): preservado raw por atributos de accesibilidad (`role`, `aria-live`)

**T-C2b-3 contacto/page.tsx:**
- `<h1>` raw → `<Heading level="display-2" as="h1" weight="semibold">` con responsive `md:[font-size:var(--bbf-typography-display-1-size)]` + `text-[var(--bbf-text-on-sand)]` + `text-balance` vía className
- Intro `<p>` (text-base) → `<Text variant="body-md">` con `max-w-[60ch] text-pretty text-[var(--bbf-text-on-sand)]` vía className
- §10: Subtitle `<p>` (`text-h1` size + medium + muted) — sin variant Text para escala h1. Sin Heading asChild apropiado (font-family cambiaría a display). Candidato a sub-fase dedicada o nuevo Text variant `body-xl`.

**T-C2b-4 HeroSection — SKIPPED:**
- `tracking-[0.15em]` NO encontrado en `src/components/sections/HeroSection/`
- TD-11-46 ya estaba cerrada en Wave 11.4-C1 (Text.tagline variant consume `--bbf-typography-tagline-tracking`)

**T-C2b-5 Nav leading-snug:**
- `MegaMenuPanel.tsx` L149: `leading-snug` → `leading-[var(--bbf-leading-snug)]`
- `MobileSubMenu.tsx` L160: `leading-snug` → `leading-[var(--bbf-leading-snug)]`
- NavLink y Header: 0 matches (sin cambio)
- Ambos casos: sub-description text de menu items (texto de 1-2 líneas)

**T-C2b-6 Footer + section-paddings:**
- `.bbf-section-mt-default` y `.bbf-section-py-default` agregados a `section-paddings.css` (Caso A — no existían)
- Footer L67: `'mt-20 lg:mt-32'` → `'bbf-section-mt-default lg:bbf-section-mt-xl'`
- Mapping: mt-20 (5rem) → `--bbf-space-section-gap-default` (5rem) ≡; mt-32 (8rem) → `--bbf-space-section-gap-xl` (8rem) ≡
- 0 cambio visual esperado (valores idénticos)

---

## Cambios visuales

| Sub-fase | Cambio visual |
|---|---|
| C2b-1 Stat | Posible — `display-lg` clamp(40→72px) → `display-2` 42px fijo. En mobile (≤40px) sin cambio; en desktop posible reducción. |
| C2b-2 NewsletterBox | 0 — Text atom usa mismos tokens de tamaño base |
| C2b-3 contacto h1 | Leve — Tier 2 agrega tracking canónico + leading de display-2. Font display ya estaba aplicado. |
| C2b-4 HeroSection | N/A — SKIPPED |
| C2b-5 Nav | ⚠ **VISIBLE** — `leading-snug` 1.375 → `leading-[var(--bbf-leading-snug)]` 1.15. Sub-descriptions de menu items más compactos (19.6%). Zavala smoke test requerido. |
| C2b-6 Footer | 0 — valores idénticos (5rem y 8rem) |

---

## Verificaciones typecheck

| Sub-fase | Resultado |
|---|---|
| Baseline pre | PASS |
| Post T-C2b-1 | PASS |
| Post T-C2b-2 | PASS |
| Post T-C2b-3 | PASS |
| Post T-C2b-5 | PASS |
| Post T-C2b-6 | PASS |
| Final | PASS |

---

## TDs cerradas

- ✅ TD-11-39 consumer side Footer (`mt-20/mt-32` → utility classes)
- ✅ TD-11-42 Tailwind `leading-snug` divergence (Nav sub-items)
- ✅ TD-11-43 contacto/page raw h1 (→ Heading atom)
- ✅ TD-11-44 Stat display-lg legacy (→ display-2 token)
- ✅ TD-11-45 NewsletterBox raw paragraphs (→ Text atom)
- ✅ TD-11-46 HeroSection tagline — SKIPPED/ya cerrada Wave 11.4-C1

---

## Git diff --stat

```
src/app/(frontend)/[locale]/contacto/page.tsx      | 31 +++++++++-------------
src/components/blocks/Stat.tsx                     |  2 +-
src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx |  2 +-
src/components/molecules/MobileSubMenu/MobileSubMenu.tsx |  2 +-
src/components/molecules/NewsletterBox/NewsletterBox.tsx | 21 +++++++++------
src/components/organisms/Footer/Footer.tsx         |  2 +-
src/styles/utilities/section-paddings.css          |  7 +++++
7 files changed, 36 insertions(+), 31 deletions(-)
```

---

## §10 — Anomalías y pendientes

1. **Stat.tsx — Heading atom refactor pendiente:** Stat usa raw `<p>` con token typography directo. Migración a `<Heading level="display-2">` excedía scope C2b-1. Propuesta: sub-fase C2b-1b o incluir en C2c.
2. **NewsletterBox L94 — `<p>` heading-sized:** Párrafo con `text-h2` + display font + bold. Sin variante Text equivalente. Candidato: `<Heading level="h2" as="p">` en sub-fase dedicada.
3. **contacto/page subtitle — `<p>` h1-sized:** Párrafo subtitle con `text-h1`. Sin variante Text para escala h1. Cambiaría font-family si se usa Heading asChild. Candidato: nuevo variant `Text.size="lead-xl"` o limpiar con Heading asChild en sub-fase post-C2c.
4. **Text.tsx / Heading.tsx — `tone` prop no aplicado:** Ambos atoms tienen `tone` en CVA variants pero no lo pasan a la llamada de variantes. Afecta a `tone="default/muted/subtle"`. Actualmente workaround vía className. Propuesta TD nueva para Wave 11.5.

---

## Commit propuesto (NO ejecutado — Zavala)

```bash
git add src/components/blocks/Stat.tsx \
        src/components/molecules/NewsletterBox/NewsletterBox.tsx \
        src/app/\(frontend\)/\[locale\]/contacto/page.tsx \
        src/components/molecules/MegaMenuPanel/MegaMenuPanel.tsx \
        src/components/molecules/MobileSubMenu/MobileSubMenu.tsx \
        src/components/organisms/Footer/Footer.tsx \
        src/styles/utilities/section-paddings.css \
        BBF_TypographyAudit_Wave11-4-C2b_Closure.md

git commit -m "feat(wave11.4-c2b): migrate external typography consumers + close 5 TDs

Wave 11.4-C2b migra consumidores externos al sistema typography canonical.

MIGRACIONES:
  - Stat.tsx: display-lg token → display-2 token (TD-11-44)
  - NewsletterBox.tsx: 4 raw <p> → Text atom body-md/body-sm/caption (TD-11-45)
  - contacto/page.tsx: raw <h1> → Heading display-2 + raw <p> → Text body-md (TD-11-43)
  - MegaMenuPanel + MobileSubMenu: Tailwind leading-snug → token canon 1.15 (TD-11-42)
  - Footer: mt-20/mt-32 → .bbf-section-mt-default/xl (TD-11-39 consumer side)

AGREGACIONES (utility classes, sin tokens nuevos):
  - .bbf-section-mt-default + .bbf-section-py-default en section-paddings.css

CAMBIO VISUAL VISIBLE:
  - Nav sub-descriptions: leading-snug 1.375 → 1.15 (R-BBF-12 §1.2)
  - contacto h1: Tier 2 tracking + leading canónico aplicado

TD-11-46 HeroSection tagline: SKIPPED (ya cerrada Wave 11.4-C1)

TDs cerradas: TD-11-39 (consumer), TD-11-42, TD-11-43, TD-11-44, TD-11-45
Refs: AUD-BBF-024, D-BBF-KB-145, R-BBF-12"
```

---

## Próximo paso

**Wave 11.4-C2c (final):**
- Eliminar variants legacy `Heading`: `display-md`, `display-lg`, `display-xl`, `h5`, `h6`
- Eliminar variants legacy `Text`: `lead`, `small`, `micro`, `overline` (si 0 consumers post-C2b)
- Resolver §10 anomalías: Stat Heading refactor + NewsletterBox heading `<p>` + contacto subtitle
- TD nueva: `tone` prop en Text.tsx / Heading.tsx no aplicada a variantes CVA

---

*B-BBF-WEB-WAVE-11-4-C2b*
*7 archivos modificados · 5 TDs cerradas · 1 SKIPPED (ya cerrada) · 4 anomalías §10*
