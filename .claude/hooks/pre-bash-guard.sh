#!/usr/bin/env bash
# pre-bash-guard.sh
# Se ejecuta antes de cualquier Bash. Bloquea patrones peligrosos.
# Exit 2 = blocking error → stderr regresa a Claude.

set -euo pipefail

INPUT=$(cat)
CMD=$(echo "$INPUT" | jq -r '.tool_input.command // empty')

if [ -z "$CMD" ]; then
  exit 0
fi

# Patrones absolutamente prohibidos (defensa adicional a settings.json deny).
DANGEROUS=(
  'rm[[:space:]]+-rf[[:space:]]+/'
  'rm[[:space:]]+-rf[[:space:]]+~'
  'rm[[:space:]]+-rf[[:space:]]+\.\.?($|[[:space:]])'
  ':\(\)\{[[:space:]]*:\|:&[[:space:]]*\};:'
  'mkfs\.'
  'dd[[:space:]]+if='
  'chmod[[:space:]]+777[[:space:]]+/'
  'git[[:space:]]+push[[:space:]]+.*--force.*main'
  'git[[:space:]]+push[[:space:]]+.*--force.*master'
  'git[[:space:]]+push[[:space:]]+-f.*main'
  'git[[:space:]]+push[[:space:]]+-f.*master'
  'git[[:space:]]+reset[[:space:]]+--hard[[:space:]]+HEAD~[0-9]+'
  'history[[:space:]]+-c'
  'shred'
  '>[[:space:]]*/dev/sd'
)

for pattern in "${DANGEROUS[@]}"; do
  if echo "$CMD" | grep -qE "$pattern"; then
    echo "BLOQUEADO: el comando contiene un patrón prohibido por el harness: $pattern" >&2
    echo "Comando completo: $CMD" >&2
    echo "Si necesitas esta operación, pide a Zavala que la ejecute manualmente." >&2
    exit 2
  fi
done

# Bloquear escritura a bbf-docs/ desde bash (deny en settings.json cubre Edit/Write,
# pero un mv o cp desde bash podría burlarlo).
if echo "$CMD" | grep -qE '(mv|cp|>|>>|tee)[[:space:]]+.*bbf-docs/'; then
  echo "BLOQUEADO: el harness bbf-web no escribe en bbf-docs/. Ese repo se edita por separado." >&2
  exit 2
fi

# Bloquear npm/yarn (este proyecto es pnpm).
if echo "$CMD" | grep -qE '^[[:space:]]*(npm|yarn)[[:space:]]+(install|i|add|run)'; then
  echo "BLOQUEADO: este proyecto usa pnpm. Reescribe el comando con pnpm." >&2
  exit 2
fi

exit 0
