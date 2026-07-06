#!/usr/bin/env bash
# post-edit-format.sh
# Se ejecuta después de Edit/Write/MultiEdit.
# Formatea con prettier y linta con eslint el archivo modificado.
# Determinista: garantiza que el código no entre al repo sin formato canónico.

set -euo pipefail

INPUT=$(cat)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')

if [ -z "$FILE_PATH" ]; then
  exit 0
fi

# Solo procesar archivos que existen y son del proyecto.
if [ ! -f "$FILE_PATH" ]; then
  exit 0
fi

# Determinar extensión.
EXT="${FILE_PATH##*.}"

case "$EXT" in
  ts|tsx|js|jsx|mjs|cjs|json|jsonc|md|mdx|yaml|yml|css)
    # Prettier si está disponible.
    if command -v pnpm >/dev/null 2>&1; then
      pnpm exec prettier --write "$FILE_PATH" --log-level=warn 2>/dev/null || true
    fi
    ;;
esac

# ESLint solo para TS/JS.
case "$EXT" in
  ts|tsx|js|jsx)
    if command -v pnpm >/dev/null 2>&1; then
      pnpm exec eslint --fix "$FILE_PATH" --no-warn-ignored 2>/dev/null || true
    fi
    ;;
esac

# Si tocó payload.config.ts o una collection, regenerar types.
if echo "$FILE_PATH" | grep -qE '(payload\.config\.ts|collections/.*\.ts|globals/.*\.ts)$'; then
  if [ -f "$CLAUDE_PROJECT_DIR/package.json" ]; then
    cd "$CLAUDE_PROJECT_DIR" && pnpm payload generate:types 2>/dev/null || true
  fi
fi

exit 0
