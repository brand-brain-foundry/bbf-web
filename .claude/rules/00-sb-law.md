---
description: Principios de construcción SB_Law aplicados a bbf-web. Inviolables. Aplica a todo el repo.
globs: ["**/*"]
alwaysApply: true
---

# Regla 00 — SB_Law_Construction aplicado a bbf-web

> **Fuente de verdad completa:** `/Volumes/PK/BBF/Repos/bbf-docs/00-context/SB_Law_Construction.md`.
> **Esta regla es la destilación operativa.** Si discrepan, gana SB_Law.

## Los 7 principios que más se violan (atención especial)

### A-01 — Simplicidad Primero
Solución mínima que cumple. No agregues capas "por si acaso". Si vas a meter un wrapper, un abstract, o un manager: prueba primero sin él.

### A-02 — Sin Parches
Si un schema, type, o config está mal: arréglalo. No metas un workaround. Los parches se acumulan y matan la limpieza.

### B-01 — De Primitivo a Específico
**Orden obligatorio:**
1. Schema Payload (collection/global field)
2. Validación Zod
3. Hook beforeChange / afterChange
4. Frontend component que lo consume
5. SEO/metadata que lo expone

**Si construyes un componente sin que la collection exista: paras.** Si construyes un block sin que el bloque tenga su schema en Payload: paras.

### B-02 — Capas Independientes
Frontend público y admin Payload viven en route groups separados: `app/(frontend)/` y `app/(payload)/`. No comparten estado. No comparten components salvo via `lib/` o `components/ui/`.

### C-01 — Una Sola Fuente de Verdad
- Los tipos vienen de Payload (`payload-types.ts` auto-generado). **Nunca redefinas un type que Payload ya generó.**
- El contenido vive en Payload, no en JSON ni constantes (invariante W-2).
- La config de SEO defaults vive en Global `SEO`, no en cada page.

### D-01 — Tipado Estricto
- `strict: true` en `tsconfig.json`. No flexible.
- Cero `any` sin comentario `// @ts-justify: <razón concreta>`. Cero `as unknown as X` sin justificación.
- `unknown` antes que `any` cuando dudes.

### F-01 — Seguridad por Diseño
- Toda escritura desde el público: rate limit (Upstash) + validación Zod + honeypot + Turnstile.
- Toda lectura sensible: access control declarativo en Payload `access` field, no en frontend.
- Secrets siempre vía `process.env`, validados con Zod al startup. **Nunca hardcoded.**

## Lista corta de los 35 (referencia rápida)

| ID | Principio | Aplicación crítica en bbf-web |
|---|---|---|
| A-01 | Simplicidad Primero | Sin wrappers innecesarios |
| A-02 | Sin Parches | Arregla la raíz, no la salida |
| A-03 | Impacto Mínimo | Una decisión, no dos |
| B-01 | Primitivo → Específico | Schema antes que componente |
| B-02 | Capas Independientes | (frontend) vs (payload) |
| C-01 | Una Fuente de Verdad | Payload types únicos |
| C-02 | Sin Duplicación | Local API evita network calls duplicadas |
| D-01 | Tipado Estricto | strict: true, no any |
| E-01 | Trazabilidad | Todo cambio de schema en git |
| F-01 | Seguridad por Diseño | Rate limit + Zod + honeypot |
| G-01 | Automatización | Hooks beforeChange/afterChange |
| H-01 | Escalabilidad Modular | Plugins, custom fields |

## Cuándo pausar

Si cualquiera de estas se cumple, **paras y consultas a Zavala** vía `feedback.md`:

- Vas a desviarte de A-01 (agregar abstracción no justificada).
- Vas a meter un parche en lugar de arreglar la raíz.
- Vas a saltarte un nivel del orden primitivo→específico.
- Vas a duplicar una fuente de verdad.
- Vas a usar `any` sin tener `// @ts-justify` defensible.
- Vas a tocar `.env`, secretos, o cualquier deny del settings.json.

**Pausar no es fracasar. Improvisar arquitectura sí lo es.**
