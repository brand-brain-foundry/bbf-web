---
name: cerrar-turno-agy
description: Ejecuta el procedimiento estricto de cierre de turno para Antigravity CLI, asegurando la sincronización de Baseline-Diff con el BBF Command Hub y la atribución Multi-Proveedor. Invocar SIEMPRE al final de un turno.
---

# Skill: cerrar-turno-agy

**Namespace:** `bbf-web:cerrar-turno-agy`
**Quién la invoca:** Antigravity CLI (automáticamente al final de su tarea gracias a la regla `00-bbf-hub-sync.md`).
**Objetivo:** Sincronizar el trabajo realizado por Antigravity con el repositorio central del HUB sin pisar el trabajo concurrente de Claude Code.

## Secuencia de Ejecución Obligatoria:

Al invocar esta skill, el agente debe ejecutar de forma secuencial y en orden los siguientes comandos en bash. Si alguno falla, debe detenerse y reportar el error:

1. **Atribución de Git (Seguridad de Firma):**
   Asegúrate de exportar la identidad de Antigravity para la autoría del commit:
   ```bash
   export GIT_AUTHOR_NAME="Antigravity CLI"
   export GIT_AUTHOR_EMAIL="agy@bbf.com"
   export GIT_COMMITTER_NAME="Antigravity CLI"
   export GIT_COMMITTER_EMAIL="agy@bbf.com"
   ```

2. **Validación de Integridad:**
   Ejecuta: `bash .claude/hooks/stop-validate.sh` (si el script existe en el proyecto) para verificar lints rápidos o builds de `bbf-web`.

3. **Escáner de Fugas de Secretos:**
   Localiza el transcript activo de la sesión de Antigravity (el más reciente) y pásalo como variable al escáner:
   ```bash
   export CLAUDE_TRANSCRIPT=$(find ~/.gemini/antigravity/brain -name "transcript.jsonl" -o -name "transcript_full.jsonl" 2>/dev/null | xargs ls -t | head -1)
   bash /Volumes/PK/BBF/Repos/bbf-command-hub/plugins/bbf-ops/hooks/leak-scan.sh < /dev/null
   ```

4. **Handoff y Baseline-Diff (Sincronización Hub):**
   Ejecuta: `bash /Volumes/PK/BBF/Repos/bbf-command-hub/plugins/bbf-ops/hooks/handoff-state.sh < /dev/null`
   Este paso es el corazón del pivoteo. El script calculará el delta de tus cambios desde el SessionStart y empujará tu commit al HUB con tu firma unificada de Git.

5. **Notificación (Opcional):**
   Exporta las variables de entorno si el turno fue exitoso:
   ```bash
   export EVENT_TYPE="DONE"
   export MESSAGE="Antigravity completó la tarea asignada."
   bash /Volumes/PK/BBF/Repos/bbf-command-hub/plugins/bbf-ops/hooks/notify.sh
   ```

**Nota para el Agente:** 
No intentes hacer `git push` directamente en el HUB ni en `bbf-web` por tu cuenta. Confía únicamente en el script `handoff-state.sh` para la sincronización Git concurrente.
