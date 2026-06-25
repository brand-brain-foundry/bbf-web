#!/usr/bin/env bash
# ============================================================
# db-restore.sh — BBF Database Restore (D-BACKUP-01)
#
# ⚠️  DESTRUCTIVE: drops and recreates ALL objects in target DB.
#
# Usage:
#   ./scripts/db-restore.sh <path-to-dump.dump>
#
# Reads from env (load .env.local before running):
#   DATABASE_URL_UNPOOLED  — preferred: explicit unpooled URL
#   DATABASE_URI           — fallback: pooler URL (auto-derives unpooled)
#
# Flags used:
#   --clean     : DROP objects before recreating (full state restore)
#   --if-exists : skip DROP errors for objects that don't exist yet
#   --no-acl    : skip GRANT/REVOKE (owner may differ between envs)
#   --no-owner  : skip ALTER OWNER (same reason)
# ============================================================
set -euo pipefail

DUMP_FILE="${1:-}"
if [ -z "$DUMP_FILE" ]; then
  echo "Usage: ./scripts/db-restore.sh <path-to-dump.dump>" >&2
  exit 1
fi

if [ ! -f "$DUMP_FILE" ]; then
  echo "ERROR: dump file not found: $DUMP_FILE" >&2
  exit 1
fi

# ── Connection (UNPOOLED required) ────────────────────────────
if [ -n "${DATABASE_URL_UNPOOLED:-}" ]; then
  UNPOOLED_URI="$DATABASE_URL_UNPOOLED"
elif [ -n "${DATABASE_URI:-}" ]; then
  UNPOOLED_URI="$(echo "$DATABASE_URI" | sed 's/-pooler\./\./g')"
else
  echo "ERROR: set DATABASE_URI or DATABASE_URL_UNPOOLED in env" >&2
  exit 1
fi

ENDPOINT="$(echo "$UNPOOLED_URI" | grep -oE 'ep-[a-z0-9-]+' | head -1)"
DUMP_SIZE="$(du -sh "$DUMP_FILE" | cut -f1)"

echo ""
echo "╔══════════════════════════════════════════════════════╗"
echo "║  ⚠️   DATABASE RESTORE — DESTRUCTIVE OPERATION  ⚠️   ║"
echo "╚══════════════════════════════════════════════════════╝"
echo ""
echo "  Dump:   $DUMP_FILE ($DUMP_SIZE)"
echo "  Target: ${ENDPOINT:-unknown}"
echo ""
echo "  All objects in the target database will be DROPPED and"
echo "  RECREATED from the dump. Existing data will be REPLACED."
echo "  This operation cannot be undone."
echo ""

# ── Double-confirm if target looks like production (non-dev branch) ──
# Raspy-hat and dev/staging branches: single RESTORE confirmation.
# Any other endpoint (could be main): require RESTORE-PRODUCTION.
IS_DEV_BRANCH=false
if echo "${ENDPOINT:-}" | grep -qE 'raspy-hat|dev-|test-|staging-'; then
  IS_DEV_BRANCH=true
fi

if [ "$IS_DEV_BRANCH" = false ]; then
  echo "  ⚠️  WARNING: Target endpoint '${ENDPOINT:-unknown}' does not"
  echo "  ⚠️  look like a dev/test branch. If this is PRODUCTION (main),"
  echo "  ⚠️  abort NOW and confirm intent with Zavala first."
  echo ""
  printf "  Type RESTORE-PRODUCTION to continue (Ctrl+C to abort): "
  read -r EXTRA_CONFIRM
  if [ "$EXTRA_CONFIRM" != "RESTORE-PRODUCTION" ]; then
    echo "Aborted — no changes made." && exit 0
  fi
  echo ""
fi

printf "  Type RESTORE to proceed (Ctrl+C to abort): "
read -r CONFIRM
if [ "$CONFIRM" != "RESTORE" ]; then
  echo "Aborted — no changes made." && exit 0
fi

echo ""
echo "▶ Running pg_restore..."
PGSSLMODE=require pg_restore \
  --verbose \
  --clean \
  --if-exists \
  --no-acl \
  --no-owner \
  --dbname="$UNPOOLED_URI" \
  "$DUMP_FILE"

echo ""
echo "▶ Verifying restore (spot-check key tables)..."
PGSSLMODE=require psql "$UNPOOLED_URI" --no-psqlrc --tuples-only --command="
  SELECT 'site_homepage'   AS tbl, COUNT(*) AS rows FROM site_homepage
  UNION ALL
  SELECT 'site_navigation' AS tbl, COUNT(*) AS rows FROM site_navigation
  UNION ALL
  SELECT 'site_cta_library',        COUNT(*) FROM site_cta_library
  UNION ALL
  SELECT 'site_homepage_capabilities_items', COUNT(*)
    FROM site_homepage_capabilities_items;
" 2>/dev/null || echo "  (psql verification failed — check manually)"

echo ""
echo "── Restore Complete ─────────────────────────────────────"
echo "  Restored: ${DUMP_FILE}"
echo "  Target:   ${ENDPOINT:-unknown}"
echo "────────────────────────────────────────────────────────"
