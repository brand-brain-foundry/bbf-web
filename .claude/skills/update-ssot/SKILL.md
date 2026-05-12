---
name: update-ssot
description: Prepara el documento BBF_<Capa>SSOT.md cuando se cierra una capa del Roadmap. Genera el snapshot del estado REAL verificable, no aspiracional. Usa cuando una capa H1/H2 está terminada y se va a declarar cerrada.
---

# Skill — Preparar SSOT de capa cerrada

## Cuándo usar

Una capa del Roadmap está cerrada cuando:
1. Todas las sub-áreas listadas en el Roadmap (§4 H0, §5 H1, §6 H2) están ejecutadas.
2. Los criterios de éxito de la capa están verificados (resumen al final de cada horizonte).
3. Cero typecheck errors. Cero lint errors. Build pasa.
4. Si aplica: tests pasan.

## Importante

**Tú no escribes el SSOT directamente en `bbf-docs/`.** Ese repo es de Zavala. Tú produces el **borrador completo en respuesta directa** para que Zavala lo paste y firme.

## Estructura del SSOT (heredada del patrón BBF)

```markdown
# BBF_<Capa>SSOT.md

**Documento:** State Source of Truth — Capa <ID-Capa>: <nombre>
**Versión:** v1.0
**Fecha cierre:** YYYY-MM-DD
**Autor verificación:** Claude Code (ejecutor) + Zavala (firma)
**Estado:** ✅ VERIFICADO — capa cerrada

---

## §0 — Resumen ejecutivo

[3-5 líneas sobre qué se construyó realmente y qué quedó como salida.]

## §1 — Inventario de artefactos creados

| Artefacto | Path | Tipo | Verificado |
|---|---|---|---|
| ... | ... | ... | ✅ |

## §2 — Configuración aplicada

[Variables de entorno definidas (sin valores reales, solo nombres y descripción).]
[Settings en servicios externos (Vercel, Cloudflare, Neon, etc.) con timestamp de aplicación.]

## §3 — Decisiones tomadas durante construcción no previstas en Canon

[Si durante la construcción se tomaron decisiones que el Canon no cubría: listarlas aquí.]
[Cada una: contexto, opciones consideradas, decisión, justificación, requiere firma retroactiva de Zavala (Y/N).]

## §4 — Discrepancias contra Canon

[Si algo se construyó distinto a lo que el Canon decía: listarlo aquí.]
[Cada discrepancia: qué dice el Canon, qué se construyó, por qué.]
[Acción: actualizar Canon a v0.X o revertir construcción.]

## §5 — Verificaciones ejecutadas

| Verificación | Resultado | Comando |
|---|---|---|
| typecheck | ✅ 0 errors | `pnpm typecheck` |
| lint | ✅ 0 errors | `pnpm lint` |
| build | ✅ build OK | `pnpm build` |
| dev local | ✅ arranca | `pnpm dev` |
| ... | ... | ... |

## §6 — Output handoff a siguiente capa

[¿Qué deja esta capa lista para la siguiente?]
[¿Qué dependencias está habilitando?]

## §7 — Próximos pasos sugeridos

[Capa que sigue según Roadmap.]
[Investigaciones pendientes que esta capa identificó.]
[Decisiones que Zavala debe firmar antes de avanzar.]

---

*BBF_<Capa>SSOT v1.0 — YYYY-MM-DD*
*Ejecutor: Claude Code · Firma: Zavala*
*Estado real al cierre — NO aspiracional*
```

## Procedimiento

### 1. Lee el Roadmap para la capa

`/Volumes/PK/BBF/Repos/bbf-docs/04-strategic/web-public/BBF_WebPublicaRoadmap_v0_1.md` — busca la sección de la capa (ej: §5.1 para H1-1).

Identifica:
- Sub-áreas listadas.
- Patrón documental esperado.
- Dependencias y "redirige al Canon".

### 2. Inventaria lo construido REALMENTE

```bash
git log --oneline --since="<fecha inicio capa>" -- <paths relevantes>
git diff --name-status <commit inicio>..HEAD -- <paths>
```

### 3. Ejecuta verificaciones

```bash
pnpm typecheck && pnpm lint && pnpm build
```

Si **cualquiera falla**: la capa no está cerrada. Detente. No prepares SSOT de algo que no funciona.

### 4. Identifica desvíos

Compara cada sub-área del Roadmap contra lo construido. Si algo no se hizo: lístalo en §3 o §4. Si se hizo distinto: §4 obligatoria.

### 5. Genera el borrador

Llena el template completo. **No dejes placeholders `[...]`** — si algo no aplica, dilo explícitamente con "N/A".

### 6. Entrega a Zavala

Output: bloque markdown completo en respuesta. Sugerencia: "Copia este bloque a `bbf-docs/04-strategic/web-public/BBF_<Capa>SSOT.md` y fírmalo cuando lo apruebes."

## Reglas

- **Estado real, no aspiracional.** Si un check falló y se "arregló parcialmente": dilo. No mientas al futuro.
- **Cero ficción.** Si no verificaste algo, no lo marques verificado.
- **Las discrepancias son obligatorias.** Si todo coincidió perfectamente con el Canon: dilo explícitamente "Sin discrepancias detectadas." y deja la sección.
- **Sugiere actualización al Canon si hubo desvío justificado.** "Esta capa requiere actualizar Canon §X.Y a v0.Z para reflejar X."
