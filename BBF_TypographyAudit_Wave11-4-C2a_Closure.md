# BBF_TypographyAudit — §Z CIERRE Wave 11.4-C2a

**Despacho:** B-BBF-WEB-WAVE-11-4-C2a
**Fecha cierre:** 2026-05-23
**Commit:** [pendiente Zavala stage+commit]

## Cambios aplicados

### Archivos modificados (5)
- src/components/atoms/Heading/Heading.variants.ts
- src/components/atoms/Text/Text.variants.ts
- src/styles/base/reset.css
- src/styles/tokens/components/hero.css
- src/styles/tokens/primitives/typography.css

### Migraciones de tokens preservados → canonical

| Token legacy | Token canonical | Archivo migrado |
|---|---|---|
| --bbf-leading-display (1.05) | --bbf-leading-tight (1.05) | Heading.variants.ts base classes |
| --bbf-tracking-display (-0.03em) | --bbf-tracking-tighter (-0.03em) | Heading.variants.ts base classes, hero.css |
| --bbf-leading-body (1.55) | --bbf-leading-base (1.55) | Text.variants.ts base classes |
| --bbf-tracking-overline (0.04em) | --bbf-tracking-wider (0.04em) | Text.variants.ts variant overline |
| --bbf-tracking-heading (-0.02em) | --bbf-tracking-tight (-0.02em) | reset.css h1/h2/h3 block |
| --bbf-weight-extrabold | variant eliminado del API | Heading.variants.ts weight group |
| --bbf-weight-black | variant eliminado del API | Heading.variants.ts weight group |

**Decisión tracking-overline:** valor 0.04em = tracking-wider (0.04em). Migrado. No TD-11-51.

**Decisión weight-extrabold/black:** 0 consumers externos confirmados por grep. Variants eliminados. Industria 4 pesos canon (R-BBF-12 §1.4).

### Tokens eliminados de primitives/typography.css (8)
- --bbf-leading-display
- --bbf-leading-body
- --bbf-tracking-display
- --bbf-tracking-heading
- --bbf-tracking-overline
- --bbf-weight-extrabold
- --bbf-weight-black
- --bbf-text-xl (TD-11-50 cierre — alias divergente 21px/h2, no consumer post Wave 11.4-C1)

### Variants NO eliminados (diferidos a C2c post-C2b)

**Heading:** display-md, display-lg, display-xl, h5, h6 — consumidores externos en Stat.tsx y posiblemente RichTextRenderer. Wave 11.4-C2b migra primero.

**Text:** lead, small, micro, overline — consumidores externos a confirmar en Wave 11.4-C2b.

### Invariantes verificadas
- A-01: sin abstracciones nuevas ✓
- A-02: migración limpia, no parches ✓
- A-03: scope exacto §0.3 — 5 archivos ✓
- D-145 §3.3: tokens dead eliminados post-migración ✓
- D-145 §3.6: 0 tokens nuevos creados ✓
- Typecheck PASS en cada sub-task ✓

### TDs cerradas
- ✅ TD-11-50: --bbf-text-xl alias divergente eliminado
- ✅ TD-11-17 (parcial): consumidores legacy reset.css migrados

### TDs nuevas
- ninguna (tracking-overline valor compatible → migrado, no TD-11-51)

### Cambio visual esperado
- **0 impacto visual** — todos los mappings son valor-a-valor idénticos:
  - leading-display (1.05) → leading-tight (1.05) ✓
  - tracking-display (-0.03em) → tracking-tighter (-0.03em) ✓
  - leading-body (1.55) → leading-base (1.55) ✓
  - tracking-overline (0.04em) → tracking-wider (0.04em) ✓
  - tracking-heading (-0.02em) → tracking-tight (-0.02em) ✓

### git diff --stat
```
src/components/atoms/Heading/Heading.variants.ts |  6 ++----
src/components/atoms/Text/Text.variants.ts       |  4 ++--
src/styles/base/reset.css                        |  2 +-
src/styles/tokens/components/hero.css            |  2 +-
src/styles/tokens/primitives/typography.css      | 10 ----------
5 files changed, 6 insertions(+), 18 deletions(-)
```

## Commit propuesto (NO ejecutado — Zavala)

```bash
git add src/components/atoms/Heading/Heading.variants.ts \
        src/components/atoms/Text/Text.variants.ts \
        src/styles/base/reset.css \
        src/styles/tokens/components/hero.css \
        src/styles/tokens/primitives/typography.css \
        BBF_TypographyAudit_Wave11-4-C2a_Closure.md

git commit -m "feat(wave11.4-c2a): atoms cleanup + tokens preservados migration

Wave 11.4-C2a migra los 7 tokens preservados Wave 11.4-B a tokens
canonicos + elimina --bbf-text-xl alias divergente.

MIGRACIONES (Tier 1 preservados → canonical):
  - --bbf-leading-display → --bbf-leading-tight (Heading.variants.ts)
  - --bbf-tracking-display → --bbf-tracking-tighter (Heading.variants.ts, hero.css)
  - --bbf-leading-body → --bbf-leading-base (Text.variants.ts)
  - --bbf-tracking-overline → --bbf-tracking-wider (Text.variants.ts) — valor idéntico 0.04em
  - --bbf-tracking-heading → --bbf-tracking-tight (reset.css) — valor idéntico -0.02em
  - --bbf-weight-extrabold: variant eliminado (0 consumers externos)
  - --bbf-weight-black: variant eliminado (0 consumers externos)

ELIMINACIONES (8 tokens de primitives/typography.css):
  - 7 tokens preservados Wave 11.4-B
  - --bbf-text-xl alias divergente (TD-11-50 cierre)

PRESERVADO (Wave 11.4-C2b migra consumers externos):
  - Variants legacy Heading: display-md/lg/xl, h5, h6
  - Variants legacy Text: lead, small, micro, overline

IMPACTO VISUAL: 0 — todos los mappings son valor-a-valor idénticos

TDs cerradas: TD-11-50, TD-11-17 (parcial)
TD nueva: ninguna (tracking-overline migrado, no preservado)

Refs: AUD-BBF-022, D-BBF-KB-145, R-BBF-12"
```

## Próximo paso

**Wave 11.4-C2b** migrará consumidores externos:
- Stat.tsx display-lg → display-2 (TD-11-44)
- NewsletterBox.tsx raw paragraphs → atoms (TD-11-45)
- contacto/page.tsx raw h1 → Heading atom (TD-11-43)
- HeroSection tagline hardcoded → var(--bbf-tracking-tagline) (TD-11-46 consumer side)
- Nav/MegaMenu/MobileSubMenu Tailwind leading-snug → token canon (TD-11-42)
- Footer mt-20 → utility class .bbf-section-mt-default (TD-11-39 consumer side)

**Wave 11.4-C2c** (final) eliminará variants legacy una vez 0 consumers externos confirmados:
- Heading: display-md/lg/xl, h5, h6
- Text: lead, small, micro, overline
