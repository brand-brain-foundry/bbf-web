#!/usr/bin/env bash
# stop-validate.sh
# Se ejecuta cuando Claude intenta terminar su turno (Stop event).
# Si hay cambios pendientes en TS/TSX y el typecheck falla, devuelve exit 2 con
# el error para que Claude lo corrija antes de terminar.
#
# IMPORTANTE: detectar stop_hook_active para evitar loops infinitos.

set -euo pipefail

INPUT=$(cat)
STOP_HOOK_ACTIVE=$(echo "$INPUT" | jq -r '.stop_hook_active // false')

if [ "$STOP_HOOK_ACTIVE" = "true" ]; then
  # Ya estamos en un re-loop; dejar que Claude termine.
  exit 0
fi

cd "$CLAUDE_PROJECT_DIR" || exit 0

# Si no hay package.json, no es un proyecto inicializado todavía. Pasar.
if [ ! -f "package.json" ]; then
  exit 0
fi

# Si no hay cambios TS/TSX en el staging area + working tree, no validar.
TS_CHANGED=$(git status --porcelain 2>/dev/null | grep -E '\.(ts|tsx)$' | wc -l | tr -d ' ')
if [ "$TS_CHANGED" = "0" ]; then
  exit 0
fi

# Correr typecheck. Capturar salida.
TYPECHECK_OUTPUT=$(pnpm exec tsc --noEmit 2>&1 || echo "TYPECHECK_FAILED")

if echo "$TYPECHECK_OUTPUT" | grep -qE 'error TS[0-9]+'; then
  # Hay errores de tipo. Bloquear el Stop con feedback a Claude.
  REASON=$(cat <<EOF
El turno no puede cerrarse: hay errores de TypeScript. Corrige antes de terminar.

Errores detectados:
$(echo "$TYPECHECK_OUTPUT" | grep -E 'error TS[0-9]+' | head -20)

Cumple los principios D-01 (Tipado Estricto) y B-01 (Primitivo → Específico) de SB_Law antes de cerrar el turno.
EOF
)
  jq -nc --arg reason "$REASON" '{
    decision: "block",
    reason: $reason
  }'
  exit 0
fi

exit 0
