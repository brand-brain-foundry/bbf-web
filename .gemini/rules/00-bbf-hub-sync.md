# Regla: Sincronización Estricta con BBF Command Hub (Desde bbf-web)

**Contexto Global:** 
Estás operando en el ecosistema BBF, el cual funciona bajo el patrón de **Dual-Brain Repository** (Multi-Proveedor IA). Estás coexistiendo con Claude Code en un ambiente concurrente donde ambos pivotean las mismas tareas. Para evitar la mezcla de código y la pérdida de gobernanza, **tienes prohibido** operar como un agente estándar; debes emular estrictamente el cableado nativo de Claude Code usando el motor virtual detallado a continuación.

**Directivas Inviolables de Ciclo de Vida:**

1. **Atribución de Identidad Nativa en Git (Indispensable):**
   * Antes de ejecutar cualquier herramienta de Git o invocar la skill de cierre, DEBES exportar las siguientes variables de entorno para que el autor y committer queden perfectamente registrados:
     ```bash
     export GIT_AUTHOR_NAME="Antigravity CLI"
     export GIT_AUTHOR_EMAIL="agy@bbf.com"
     export GIT_COMMITTER_NAME="Antigravity CLI"
     export GIT_COMMITTER_EMAIL="agy@bbf.com"
     ```
   * En todo documento que crees (ej. `OUTPUT-HUB-*.md` o `BITACORA.md`), incluye al inicio la línea: `Ejecutor: Antigravity CLI`.

2. **[SessionStart] - Sincronización Inicial:**
   * En tu primer turno de interacción (al despertar o recibir tu primer prompt de la sesión), tu primera acción oculta (antes de modificar cualquier código) DEBE SER sincronizar tu estado de concurrencia.
   * Debes ejecutar: `bash .claude/hooks/session-start.sh` (si existe en tu directorio) y asegurarte de ejecutar `/Volumes/PK/BBF/Repos/bbf-command-hub/plugins/bbf-ops/hooks/capture-baseline.sh` para fijar el snapshot de inicio.

3. **[PreToolUse] - Escudo de Secretos Activo:**
   * Tienes prohibido modificar archivos o correr comandos destructivos sin validar contra el escudo de seguridad. Debes inyectar tu entrada como JSON por stdin:
     * Si vas a editar/escribir un archivo:
       ```bash
       echo '{"tool_input": {"file_path": "<ruta_del_archivo>"}}' | bash /Volumes/PK/BBF/Repos/bbf-command-hub/plugins/bbf-ops/hooks/secret-guard.sh
       ```
     * Si vas a ejecutar un comando en Bash:
       ```bash
       echo '{"tool_input": {"command": "<comando_completo>"}}' | bash /Volumes/PK/BBF/Repos/bbf-command-hub/plugins/bbf-ops/hooks/secret-guard.sh
       ```
   * Si el script sale con `exit 2`, aborta la acción inmediatamente.

4. **[Stop] - Clausura del Turno:**
   * Al finalizar la meta impuesta, NO debes despedirte del usuario ni terminar tu sesión nativamente.
   * **NUEVA REGLA (Pivoteo Seguro de Producto):** Antes de invocar la skill de cierre del HUB, DEBES analizar si has modificado archivos del repositorio de producto (`bbf-web`). Si es así, debes proponer al usuario ejecutar un `git commit` descriptivo y un `git push` de su rama actual. Al ser un comando destructivo, el CLI pausará y le pedirá autorización interactiva al usuario.
   * Una vez el usuario apruebe y el código de producto esté pusheado (o si el usuario lo rechaza/no hubo cambios), estás OBLIGADO a ejecutar la skill nativa `cerrar-turno-agy` (ubicada en `.gemini/skills/cerrar-turno-agy/SKILL.md`). Esta skill ejecutará el baseline-diff y subirá la metadata administrativa al HUB de forma segura.

**Recuerda:** Tu superpoder es la semántica. Debes leer el `ESTADO_CANONICO.md` provisto por el Hub para entender en qué punto dejó el trabajo el agente anterior (Claude Code o tú mismo en el pasado).
