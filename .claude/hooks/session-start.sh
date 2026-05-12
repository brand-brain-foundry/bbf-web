#!/usr/bin/env bash
# session-start.sh
# Se ejecuta al inicio de cada sesión de Claude Code.
# Inyecta contexto fresco: branch actual, estado del Roadmap, feedback pendiente.
# Stdout se agrega al contexto de Claude vía hookSpecificOutput.additionalContext.

set -euo pipefail

PROJECT_DIR="${CLAUDE_PROJECT_DIR:-$(pwd)}"
DOCS_DIR="/Volumes/PK/BBF/Repos/bbf-docs"

BRANCH=$(git -C "$PROJECT_DIR" branch --show-current 2>/dev/null || echo "no-git")
DIRTY=$(git -C "$PROJECT_DIR" status --porcelain 2>/dev/null | wc -l | tr -d ' ')

FEEDBACK_NOTE=""
if [ -f "$PROJECT_DIR/feedback.md" ]; then
  FEEDBACK_LINES=$(wc -l < "$PROJECT_DIR/feedback.md" | tr -d ' ')
  FEEDBACK_NOTE="⚠️  feedback.md presente (${FEEDBACK_LINES} líneas). LÉELO PRIMERO."
fi

DOCS_NOTE="❌ bbf-docs no encontrado en $DOCS_DIR"
if [ -d "$DOCS_DIR" ]; then
  DOCS_NOTE="✅ bbf-docs accesible en $DOCS_DIR"
fi

CANON_PATH="$DOCS_DIR/04-strategic/web-public/BBF_WebPublicaTopologiaCanon_v0_1.md"
ROADMAP_PATH="$DOCS_DIR/04-strategic/web-public/BBF_WebPublicaRoadmap_v0_1.md"
SBLAW_PATH="$DOCS_DIR/00-context/SB_Law_Construction.md"
TAX_PATH="$DOCS_DIR/00-context/SB_TaxComponentes.md"

CANON_OK="❌"
[ -f "$CANON_PATH" ] && CANON_OK="✅"
ROADMAP_OK="❌"
[ -f "$ROADMAP_PATH" ] && ROADMAP_OK="✅"
SBLAW_OK="❌"
[ -f "$SBLAW_PATH" ] && SBLAW_OK="✅"
TAX_OK="❌"
[ -f "$TAX_PATH" ] && TAX_OK="✅"

CONTEXT=$(cat <<EOF
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SESIÓN bbf-web — contexto inyectado por session-start.sh
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Branch: $BRANCH ($DIRTY archivos sin commit)

Doctrina:
  $DOCS_NOTE
  $SBLAW_OK SB_Law_Construction.md (00-context/)
  $TAX_OK SB_TaxComponentes.md (00-context/)
  $CANON_OK BBF_WebPublicaTopologiaCanon_v0_1.md (04-strategic/web-public/)
  $ROADMAP_OK BBF_WebPublicaRoadmap_v0_1.md (04-strategic/web-public/)

$FEEDBACK_NOTE

PROTOCOLO DE TURNO:
1. Si hay feedback.md, léelo primero.
2. Identifica capa del Roadmap a la que pertenece la tarea.
3. Verifica que el Canon cubre lo que vas a hacer. Si no, para y pregunta.
4. Verifica dependencias. No avances con bases inestables.
5. Ejecuta el mínimo que resuelve.
6. Verifica contra SB_Law.
7. Reporta estado REAL, no aspiracional.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
EOF
)

# Salida como JSON con additionalContext para que se inyecte al contexto.
jq -nc --arg ctx "$CONTEXT" '{
  hookSpecificOutput: {
    hookEventName: "SessionStart",
    additionalContext: $ctx
  }
}'
