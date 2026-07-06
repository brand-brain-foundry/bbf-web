---
name: process-feedback
description: Procesa el archivo feedback.md de Zavala como primer paso de cada turno. Lee, parsea, identifica tareas, valida contra Canon, ejecuta o reporta. Usa al inicio de cada sesión si feedback.md existe en la raíz del repo.
---

# Skill — Procesar `feedback.md`

## Cuándo usar

**Siempre al inicio de un turno si `feedback.md` existe en la raíz del repo.** Este es el canal canónico por el que Zavala te da instrucciones puntuales.

El `session-start.sh` hook ya avisa si feedback.md está presente. Cuando lo veas: actívate.

## Procedimiento

### 1. Lee feedback.md completo

```bash
cat feedback.md
```

No skim. Léelo entero antes de actuar.

### 2. Clasifica las instrucciones

Zavala puede pedirte:

| Tipo | Ejemplo | Tu respuesta |
|---|---|---|
| **Ejecutar** | "Crea la collection Posts según §4.1.1" | Aplica skill `create-payload-collection` |
| **Auditar** | "Revisa que el endpoint /api/contact cumpla regla 40" | Aplica skill `audit-canon-compliance` |
| **Investigar** | "Investiga next-intl vs next-i18next en mayo 2026" | Web search + reporte estructurado |
| **Decisión** | "Vamos con CSP pragmático en lugar de estricto" | Reconocer firma, anotar en respuesta, no modificar archivos hasta que aplique |
| **Pausa/reset** | "Detente, revierte el último commit, retomemos mañana" | Stash o reset según indique, confirmar antes de aplicar |
| **Pregunta** | "¿Qué riesgos tiene usar Mux gratis vs Cloudflare Stream?" | Responder texto + posibles fuentes, no modificar archivos |

### 3. Valida contra Canon y SB_Law

Antes de ejecutar:
- ¿La instrucción está cubierta por el Canon? Si no: **para** y aclara.
- ¿Viola algún invariante W-1..W-7? Si sí: **para** y reporta.
- ¿Cumple SB_Law? Si dudosa: pregunta antes.

### 4. Plan corto antes de ejecutar

Para tareas no-triviales (más de 5 minutos de trabajo), antes de tocar archivos:

```markdown
## Plan para feedback.md (interpretado por Claude Code)

1. [acción 1] — [archivo/recurso afectado] — [verificación]
2. [acción 2] — ...
3. [acción 3] — ...

¿Procedo?
```

**Espera confirmación de Zavala** si la tarea es destructiva, toca config, o pisa decisiones previas.

Para tareas triviales (typo fix, agregar un import faltante): procede sin plan.

### 5. Ejecuta

Aplica las skills relevantes. Una skill por sub-tarea. No mezcles.

### 6. Reporta resultado

Al final:
- Qué se hizo.
- Qué quedó pendiente.
- Qué decisiones pendientes detectaste durante el trabajo.
- Sugerencia para próximo `feedback.md` de Zavala.

### 7. Archivar el feedback procesado

Una vez completado, sugiere a Zavala:

```bash
mkdir -p .claude/feedback-archive
mv feedback.md .claude/feedback-archive/feedback_$(date +%Y-%m-%d_%H%M).md
```

**Tú no lo mueves automáticamente.** Sugiérelo y deja que él decida si conservar o mover. Algunos feedbacks vale la pena mantenerlos abiertos varias sesiones.

## Reglas

- **Una instrucción ambigua no se interpreta — se pregunta.** "Cuando dices 'mejora el header', ¿te refieres al `<header>` de layout, al header de blog page, o al header del admin?"
- **Si Zavala incluye una decisión que contradice el Canon firmado**: reportar la contradicción, pedir confirmación de superación, anotar para audit.
- **Si Zavala te pide algo que viola SB_Law**: rehusar con explicación clara. Citar el principio violado.
- **No proceses feedback de turnos anteriores**: solo el actual. Si hay archivo `.claude/feedback-archive/feedback_X.md` es histórico, no lo apliques.

## Formato sugerido de `feedback.md` (para Zavala)

```markdown
# Feedback turno YYYY-MM-DD

## Contexto
[1-3 líneas]

## Tareas
1. [Tarea concreta]
2. [Tarea concreta]

## Decisiones nuevas
- [D-BBF-WEB-XX: descripción y opción elegida]

## Lo que NO toques
- [Path o área off-limits este turno]

## Reportar al final
- [Qué quiero ver en tu respuesta]
```

Si Zavala usa otro formato: respétalo y extrae las tareas igual.
