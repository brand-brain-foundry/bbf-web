# BBF_TypographyAudit — §FINAL CIERRE Wave 11.4 COMPLETA

**Despachos:** B-BBF-WEB-WAVE-11-4-A through C2d
**Fecha cierre Wave 11.4:** 2026-05-24
**Último commit:** [pendiente Zavala stage+commit]
**Estado:** Wave 11.4 COMPLETA — Sistema typography canonical activo

## Resumen Wave 11.4 completa

| Sub-Wave | Commit | TDs cerradas |
|---|---|---|
| 11.4-A audit | (docs) | — |
| 11.4-B tokens | 95d48a2 | TD-11-39, 40, 46, 48 (4) |
| 11.4-C1 cascade | 3ae05f5 | TD-11-41 CRITICAL, 48 (2) |
| 11.4-C2a tokens preservados | 04efb18 | TD-11-50, 17 parcial (2) |
| 11.4-C2b consumidores externos | a785a63 | TD-11-39 cons, 42, 43, 44, 45 (5) |
| 11.4-C2c-bis safe cleanup | 609b5b0 | TD-11-53, 58 (2) |
| 11.4-C2d cierre final | [pendiente] | TD-11-17 CIERRE, 59 (2) |

**Total TDs cerradas Wave 11.4:** 17

## Cambios C2d aplicados

### Archivos modificados (13)

- `src/components/blocks/RichTextRenderer.tsx` — h1 mapping display-md → display-2
- `src/components/atoms/Heading/Heading.tsx` — inferElement() cleanup + JSDoc
- `src/components/atoms/Text/Text.tsx` — inferElement() overline cleanup + JSDoc
- `src/components/atoms/Heading/Heading.variants.ts` — 3 variants eliminados
- `src/components/atoms/Text/Text.variants.ts` — overline variant + compoundVariant eliminados
- `src/styles/tokens/primitives/typography.css` — 4 tokens eliminados + header @deprecated
- `src/app/(frontend)/[locale]/page.tsx` — display-lg → display-2
- `src/app/(frontend)/[locale]/not-found.tsx` — display-xl → display-1
- `src/components/sections/HeroSection/HeroSection.tsx` — JSDoc comments actualizados
- `src/components/templates/CornerstoneTemplate.tsx` — display-xl → display-1
- `src/components/templates/ErrorTemplate/ErrorTemplate.tsx` — display-lg → display-2
- `src/components/templates/NotFoundTemplate/NotFoundTemplate.tsx` — display-lg → display-2
- `src/components/templates/PillarTemplate.tsx` — display-lg → display-2

### Variants Heading eliminados (3)
- `display-md` — clamp(32→56px) legacy fluid
- `display-lg` — clamp(40→72px) legacy fluid
- `display-xl` — clamp(48→96px) legacy fluid

### Variant Text eliminado (1)
- `overline` — reemplazado por `tagline` (canon D-91)

### Tokens Tier 1 eliminados (4)
- `--bbf-text-display-md` (clamp 32→56px)
- `--bbf-text-display-lg` (clamp 40→72px)
- `--bbf-text-display-xl` (clamp 48→96px)
- `--bbf-text-overline` (0px small caps — 0 consumers confirmados)

### Migraciones consumers (D-BBF-WEB-XX firmada)

| Consumer | Antes | Después | Razón |
|---|---|---|---|
| RichTextRenderer.tsx h1 | display-md (clamp 32→56) | display-2 (42px fijo) | D-XX firmada Wave 11.4-C2d |
| page.tsx hero | display-lg (clamp 40→72) | display-2 (42px fijo) | hipótesis §0.2 + ⚠️ ver anomalía §12 |
| NotFoundTemplate h1 | display-lg | display-2 | 404 page heading |
| PillarTemplate h1 | display-lg | display-2 | Content pillar page |
| ErrorTemplate h1 | display-lg | display-2 | Error page heading |
| not-found.tsx "404" | display-xl (clamp 48→96) | display-1 (68px fijo) | Impacto máximo número 404 |
| CornerstoneTemplate h1 | display-xl | display-1 (68px fijo) | Cornerstone page hero |

### TDs cerradas C2d
- ✅ TD-11-17 Legacy migration (CIERRE COMPLETO — último consumidor removido)
- ✅ TD-11-59 RichText h1 mapping (D-BBF-WEB-XX aplicada)

## Sistema typography canonical FINAL (post Wave 11.4)

### Display scale φ (golden ratio)
```
display-1   →  68px  (4.25rem)   → hero único, máximo impacto (not-found "404", CornerstoneTemplate)
display-2   →  42px  (2.625rem)  → section heroes + RichText h1 + page heroes
h1          →  26px  (1.625rem)  → page titles
h2          →  22px  (1.375rem)  → Major Third desde h3
h3          →  20px  (1.25rem)   → sub-jerarquía
h4          →  18px  (1.125rem)  → sub-jerarquía
body-lg     →  18px              → lead paragraphs
body-md     →  16px              → default
body-sm     →  14px              → secondary
caption     →  14px              → labels, metadata (span element)
tagline     →  16px + tracking 0.15em + uppercase → BBF tagline pattern
```

### Pesos canónicos (4)
regular (400) · medium (500) · semibold (600) · bold (700)

### Line-heights (6)
none (1.0) · tight (1.05) · snug (1.15) · snug-small (1.45) · base (1.55) · relaxed (1.65)

### Letter-spacings (5 + tagline)
tighter (-0.03em) · tight (-0.02em) · normal (0) · wide (0.02em) · wider (0.04em) · tagline (0.15em)

## §12 Anomalías Wave 11.4-C2d

**⚠️ page.tsx homepage hero visual change:**
- Consumer: `src/app/(frontend)/[locale]/page.tsx:40` heading "Tú diriges. / Tu marca ejecuta."
- Antes: `display-lg` = clamp(40px, 5.5vw, 72px) — 72px desktop, ~40px mobile
- Después: `display-2` = 42px fijo en todas las pantallas
- Impacto: desktop heading visualmente más pequeño (~42% reducción en desktop)
- Mapping default aplicado per despacho §T-C2d-4
- **Strategic debe verificar en smoke test visual.** Si 42px resulta insuficiente para el hero principal, override a `display-1` (68px) es la alternativa canónica.

## Próximo paso

**Wave 11.5 Atoms** — PRIORIDADES HIGH:

1. **TD-11-55 HIGH** Heading/Text tone prop CVA no aplicado (workaround className actual)
2. **TD-11-57 HIGH** Hover sticky en mobile (@media (hover: hover))
3. TD-11-23 NavLink sin CVA
4. TD-11-14 Badge sin CVA
5. TD-11-36 BBFLogo + Icon surface sin implementación
6. TD-11-30 8 CSS warnings Tailwind arbitrary placeholder rotas
7. TD-11-54 NewsletterBox heading-sized `<p>` + contacto subtitle (desbloqueada por TD-11-55)
8. TD-11-60 Mejora metodología scan string literals (proceso Strategic)

**Después Wave 11.5:** 11.6 Molecules, 11.7 Organisms, 11.X Icons, 11.X Motion, 11.9 Master Doc.

---

*Wave 11.4 Typography Foundation: COMPLETA*
*Sistema áureo activo, dead code eliminado, cascada Tier 2 funcional*
*17 TDs cerradas, sistema sólido para Wave 11.5+*
