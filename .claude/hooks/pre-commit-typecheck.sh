#!/usr/bin/env bash
# pre-commit-typecheck.sh
# Script auxiliar invocable desde husky o como hook nativo de Claude Code.
# NO está cableado en settings.json — se referencia desde husky o se llama manual.
# Aquí lo dejamos como referencia disponible para cuando F-2 (capa repo) se cierre.

set -euo pipefail

cd "${CLAUDE_PROJECT_DIR:-$(pwd)}"

echo "→ Ejecutando typecheck completo..."
pnpm exec tsc --noEmit

echo "→ Ejecutando lint sobre archivos staged..."
STAGED=$(git diff --cached --name-only --diff-filter=ACMR | grep -E '\.(ts|tsx|js|jsx)$' || true)
if [ -n "$STAGED" ]; then
  pnpm exec eslint $STAGED
fi

echo "✓ Pre-commit checks OK."
exit 0
