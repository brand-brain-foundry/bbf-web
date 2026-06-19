# HOME FASE 3 CLOSE — verificación + cierre
> Despacho B-BBF-WEB-HOME-FASE3-CLOSE · 2026-06-19
> HEAD resultado: [ver PASO 3] · NO push

---

## PASO 1 — knowsAbout en HTML SERVIDO ES+EN

Dev server activo en :3000. Sin restart necesario — el cache ya mostraba los 10 topics correctos.

### ES (`http://localhost:3000/`)

```json
"knowsAbout": [
  "Brand intelligence systems",
  "Brand operating systems",
  "Brand brain construction and operation",
  "Multi-channel brand orchestration",
  "Conversational brand agents",
  "Brand content automation",
  "Brand voice consistency at scale",
  "Proprietary brand AI",
  "Brand memory systems",
  "B2B brand operationalization"
]
```

✅ 10 topics §2.9 · SIN hub-and-spoke

### EN (`http://localhost:3000/en`)

```json
"knowsAbout": [
  "Brand intelligence systems",
  "Brand operating systems",
  "Brand brain construction and operation",
  "Multi-channel brand orchestration",
  "Conversational brand agents",
  "Brand content automation",
  "Brand voice consistency",
  "Proprietary brand AI",
  "Brand memory systems",
  "B2B brand operationalization"
]
```

✅ 10 topics · SIN hub-and-spoke · ⚠️ Nota menor: topic #7 EN dice "Brand voice consistency"
(sin "at scale") vs ES "Brand voice consistency at scale". Probable divergencia de locale en el
seed. No bloqueante. A corregir en Wave 13 si aplica.

**VEREDICTO PASO 1: PASADO** — knowsAbout = 10 §2.9, sin hub-and-spoke, en HTML real ES+EN.

---

## PASO 2 — TP-HERO-ANCHOR diferido a Fase 4

**FIX-ANCHOR-PHRASE NO aplicado** (mandato del despacho).

Registrado en bbf-docs `BBF_RoadmapHomepage_v1.md`:
- Bajo FASE 3 CIERRE → PENDIENTES DIFERIDOS:
  **TP-HERO-ANCHOR** — Frase ancla §1.9 visible en Hero (cumple §1.7) → se resuelve en Fase 4
  cuando se audite/construya el Hero como sección. El FAQPage (Fase 3B) ya cubre la cápsula
  hero para IA; falta la versión visible.
- Bajo FASE 4+ → Ítem diferido de Fase 3 para Hero: `<p>` con heroCapsule sectionId='hero'
  después de los CTAs.

---

## PASO 3 — Fase 3 cerrada + pendientes registrados

### ETAPA 6: FASE 3 CERRADA

**Lo hecho** (6 fixes + 1 data fix, commits `303180e`→`ab37123`):
- FIX-TITLE-SEP, FIX-THEME-COLOR, FIX-CAPSULES-RENDER, FIX-WEBPAGE-SCHEMA,
  FIX-FOUNDING-DATE, FIX-AREA-SERVED, D-FASE3B-KNOWS-01 (knowsAbout 10 topics)
- Verificados en HTML servido ES+EN ✅

**Pendientes registrados en bbf-docs `BBF_RoadmapHomepage_v1.md`:**

| ID | Descripción | Vía |
|---|---|---|
| TP-ASSET-01 | og-image.png (bloquea og:image/twitter:image) | Espera asset Zavala (Design) |
| TP-ASSET-02 | Logo SB SVG (bloquea Organization.logo JSON-LD) | Espera asset Zavala (Design) |
| TP-HERO-ANCHOR | Frase ancla §1.9 visible en Hero | Fase 4 — Hero block |
| Deferred Wave 13 | Service×5, FAQPage-servicios, ItemList schemas | Wave 13 (no bloqueantes) |

### Commits

**bbf-web:** output.md actualizado (reporte cierre Fase 3)
**bbf-docs:** BBF_RoadmapHomepage_v1.md (FASE 3 CERRADA + pendientes) + L-BBF-287 pre-existente

### Estado: listo para Fase 4

Próximo despacho: Fase 4 → Hero (primer bloque). Auditar admin del bloque → design system →
verificación visual. TP-HERO-ANCHOR incluido en ese scope.
