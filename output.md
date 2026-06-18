# CAPSULES POBLAR — admin + canon §4.2
> Despacho B-BBF-WEB-HOME-CAPSULES-POBLAR · 2026-06-18
> TP-SEO-01 CERRADO

---

## 1. Población confirmada (raspy-hat)

5 items en `SiteHomepage.seo.answerCapsules` con ES+EN:

| sectionId | ES (inicio) | EN (inicio) |
|---|---|---|
| hero | Sivar Brains construye, opera y mantiene… | Sivar Brains builds, operates and maintains… |
| capabilities | El cerebro de marca de Sivar Brains agrupa… | Sivar Brains' brand brain brings five… |
| caseStudy | Hacienda Real ya opera su cerebro de marca… | Hacienda Real already runs its brand brain… |
| comparison | La diferencia no es el resultado: es quién… | The difference isn't the outcome: it's who… |
| method | Tres etapas sin permanencia: diagnóstico… | Three stages with no lock-in: a closed… |

Seed: `src/scripts/seed-answer-capsules.ts` (L-BBF-256 workaround: ES via Payload API + EN via SQL ON CONFLICT DO UPDATE).

---

## 2. Canon §4.2 actualizado (bbf-docs)

`SEO-AEO-home-SB.md §4.2` ahora contiene:
- ✅ hero ES + EN: **AGREGADA** (no existía)
- ✅ capabilities ES: mantida (ya cumplía spec) · EN: **AGREGADA**
- ✅ caseStudy ES: **EXPANDIDA** (36→50 palabras, spec=40-60) · EN: **AGREGADA**
- ✅ comparison ES: **EXPANDIDA** (36→49 palabras) · EN: **AGREGADA**
- ✅ method ES: **EXPANDIDA** (33→46 palabras) · EN: **AGREGADA**

---

## 3. Confirmación admin = §4.2

Verificado por query SQL directo. Los textos en DB coinciden carácter a carácter con los textos firmados en el Plan Mode y registrados en §4.2.

---

## 4. TP-SEO-01 CERRADO

Gap cerrado: Answer Capsules EN que faltaban en Fase 0 → pobladas.
Hero ES que faltaba en §4.2 → agregada.
3 capsules ES cortas (< 40 palabras) → expandidas a spec.

---

## 5. Validación para Zavala

Admin → SiteHomepage → grupo "Optimización SEO + GEO" → subsección answerCapsules
→ 5 items, cada uno con capsule ES + EN visible y guardable.
