#!/usr/bin/env bash
# ============================================================
# verify-prod-build.sh — verificación local del build de producción
# standalone (cierra HAL-SBWEB-NO-PROD-BUILD-VERIFY-01)
#
# Por qué existe: `output:'standalone'` (next.config.mjs) genera un
# server bundle que NO incluye `.next/static` ni `public/` — el
# Dockerfile de este repo (stage `runner`) los copia aparte con 2 `COPY`.
# Sin esos 2 pasos el server standalone "sirve sin CSS" — el fallo real
# que motivó esta herramienta (HAL-SBWEB-NO-PROD-BUILD-VERIFY-01, ver
# incidente PR#24). Este script replica exactamente esos 2 `COPY` fuera
# de Docker — quick-win rápido para el 90% de los deploys. Para paridad
# total Mac/Linux (sharp nativo, glibc), ver docs/verify-prod-build.md
# §Docker.
#
# Uso:
#   ./scripts/verify-prod-build.sh [puerto]     # default 3000
#
# Requiere `.env.verify` en la raíz del repo (gitignorado, ver
# .gitignore). Crear a MANO, fuera de Claude Code — el guard S-3
# (secret-guard.sh) bloquea por diseño cualquier archivo .env*, plantilla
# o no, así que no existe un .env.verify.example generado por esta
# herramienta. Ver docs/verify-prod-build.md para las 14 claves exactas
# y sus valores de dev/staging. NUNCA usar `.env.local` aquí (S-3/S-6)
# ni credenciales de producción real.
#
# DATABASE_URL debe apuntar a una DB de prueba/dev REALMENTE alcanzable:
# `pnpm build` corre `payload generate:importmap && payload generate:types`,
# que conectan a la DB de verdad para introspección — no basta con una
# URL bien formada.
#
# Fail-closed (paso 6/6): si el CSS servido no responde `text/css`, el
# script FALLA — es la señal exacta del incidente que esta herramienta
# existe para cazar antes de desplegar, nunca pasa silencioso.
#
# Esto NO verifica el crash de cliente (WebGL2) — ese es un fallo de
# navegador, invisible a curl/Docker. Ver scripts/verify-webgl2-fail.js
# para inyectar sobre el server que este script deja arriba.
# ============================================================
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$REPO_ROOT"

PORT="${1:-3000}"
ENV_FILE="$REPO_ROOT/.env.verify"
STANDALONE_DIR="$REPO_ROOT/.next/standalone"
LOG_FILE="$REPO_ROOT/.verify-prod-build.log"
SERVER_PID=""

cleanup() {
  if [ -n "$SERVER_PID" ] && kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "▶ Deteniendo server (PID ${SERVER_PID})..."
    kill "$SERVER_PID" 2>/dev/null || true
    wait "$SERVER_PID" 2>/dev/null || true
  fi
}
trap cleanup EXIT

echo "── verify-prod-build ────────────────────────────────────"
echo "  Puerto:  ${PORT}"
echo "  Env:     ${ENV_FILE}"
echo "────────────────────────────────────────────────────────"
echo ""

if [ ! -f "$ENV_FILE" ]; then
  echo "ERROR: falta ${ENV_FILE}" >&2
  echo "       Crear a mano con las 14 claves de docs/verify-prod-build.md (valores de PRUEBA, nunca prod)." >&2
  exit 1
fi

# Carga .env.verify al entorno del propio script (build-time Y runtime del
# paso 5) — el script NUNCA imprime los valores.
set -a
# shellcheck disable=SC1090
source "$ENV_FILE"
set +a

# ── Paso 1/6: build de producción real (mismo comando que Dockerfile stage builder) ──
echo "▶ [1/6] pnpm build"
pnpm build

if [ ! -f "$STANDALONE_DIR/server.js" ]; then
  echo "ERROR: ${STANDALONE_DIR}/server.js no existe — ¿sigue output:'standalone' en next.config.mjs?" >&2
  exit 1
fi

# ── Paso 2/6: copiar estáticos — replica COPY .../.next/static ./.next/static ──
echo "▶ [2/6] copiando .next/static → .next/standalone/.next/static"
rm -rf "$STANDALONE_DIR/.next/static"
cp -r "$REPO_ROOT/.next/static" "$STANDALONE_DIR/.next/static"

# ── Paso 3/6: copiar public — replica COPY .../public ./public ──
echo "▶ [3/6] copiando public/ → .next/standalone/public"
rm -rf "$STANDALONE_DIR/public"
cp -r "$REPO_ROOT/public" "$STANDALONE_DIR/public"

# ── Paso 4/6: env de runtime — archivo de PRUEBA, nunca .env.local ──
echo "▶ [4/6] copiando .env.verify → .next/standalone/.env"
cp "$ENV_FILE" "$STANDALONE_DIR/.env"

# ── Paso 5/6: levantar el runtime REAL de producción (mismo CMD del Dockerfile) ──
echo "▶ [5/6] node server.js (PORT=${PORT})"
(
  cd "$STANDALONE_DIR"
  PORT="$PORT" NODE_ENV=production HOSTNAME=0.0.0.0 node server.js >"$LOG_FILE" 2>&1 &
  echo $! >"$REPO_ROOT/.verify-prod-build.pid"
)
SERVER_PID="$(cat "$REPO_ROOT/.verify-prod-build.pid")"
rm -f "$REPO_ROOT/.verify-prod-build.pid"

echo "  server PID: ${SERVER_PID} — esperando arranque (/api/health, no toca DB/Payload)..."
ATTEMPTS=0
until curl -sf "http://localhost:${PORT}/api/health" >/dev/null 2>&1; do
  ATTEMPTS=$((ATTEMPTS + 1))
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "ERROR: el server murió antes de responder. Log:" >&2
    cat "$LOG_FILE" >&2
    exit 1
  fi
  if [ "$ATTEMPTS" -ge 30 ]; then
    echo "ERROR: el server no respondió en ${ATTEMPTS}s. Log:" >&2
    cat "$LOG_FILE" >&2
    exit 1
  fi
  sleep 1
done

# ── Paso 6/6: confirmar CSS real — fail-closed, la señal exacta del incidente ──
echo "▶ [6/6] verificando content-type de un asset CSS real"
CSS_FILE="$(find "$STANDALONE_DIR/.next/static/css" -maxdepth 1 -name '*.css' -print -quit 2>/dev/null || true)"
if [ -z "$CSS_FILE" ]; then
  echo "" >&2
  echo "FAIL: no se encontró ningún .css en .next/static/css — build sin CSS generado." >&2
  echo "      NO desplegar. (HAL-SBWEB-NO-PROD-BUILD-VERIFY-01)" >&2
  exit 1
fi

CSS_URL="http://localhost:${PORT}/_next/static/css/$(basename "$CSS_FILE")"
CONTENT_TYPE="$(curl -sI "$CSS_URL" | grep -i '^content-type:' | tr -d '\r')"

echo "  URL:          ${CSS_URL}"
echo "  Content-Type: ${CONTENT_TYPE:-<vacío>}"

if ! echo "$CONTENT_TYPE" | grep -qi 'text/css'; then
  echo "" >&2
  echo "FAIL: el CSS no se sirvió como text/css — este es el fallo exacto de" >&2
  echo "      \"sirve sin CSS\" (HAL-SBWEB-NO-PROD-BUILD-VERIFY-01). NO desplegar." >&2
  exit 1
fi

echo ""
echo "── OK — el build standalone sirve CSS real ──────────────"
echo "  Servidor sigue arriba en http://localhost:${PORT} para pruebas manuales"
echo "  (ej. scripts/verify-webgl2-fail.js para el crash de cliente)."
echo "  Ctrl+C para detener."
echo "────────────────────────────────────────────────────────"

wait "$SERVER_PID"
