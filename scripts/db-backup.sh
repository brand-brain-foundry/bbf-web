#!/usr/bin/env bash
# ============================================================
# db-backup.sh — BBF Database Backup (D-BACKUP-01)
#
# Usage:
#   ./scripts/db-backup.sh [label]
#   label: optional tag for the filename (default: "manual")
#   Example: ./scripts/db-backup.sh pre-draft-mode
#
# Reads from env (load .env.local before running):
#   DATABASE_URL_UNPOOLED  — preferred: explicit unpooled URL
#   DATABASE_URI           — fallback: pooler URL (auto-derives unpooled)
#
# Output: backups/<YYYYMMDD_HHMMSS>_<label>.dump  (pg_dump -Fc)
# ============================================================
set -euo pipefail

LABEL="${1:-manual}"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
BACKUP_DIR="${SCRIPT_DIR}/../backups"
DUMP_FILE="${BACKUP_DIR}/${TIMESTAMP}_${LABEL}.dump"

mkdir -p "$BACKUP_DIR"

# ── Connection (UNPOOLED required — PgBouncer/pooler blocks COPY, SET, etc.) ──
if [ -n "${DATABASE_URL_UNPOOLED:-}" ]; then
  UNPOOLED_URI="$DATABASE_URL_UNPOOLED"
elif [ -n "${DATABASE_URI:-}" ]; then
  # Neon: pooler host = ep-xxx-pooler.region. → unpooled = ep-xxx.region.
  UNPOOLED_URI="$(echo "$DATABASE_URI" | sed 's/-pooler\./\./g')"
else
  echo "ERROR: set DATABASE_URI or DATABASE_URL_UNPOOLED in env" >&2
  exit 1
fi

# Safety guard — abort if pooler sneaked through
if echo "$UNPOOLED_URI" | grep -qE '@[^@]*-pooler\.'; then
  echo "ERROR: Connection still points to pooler endpoint." >&2
  echo "       pg_dump requires an UNPOOLED (direct) connection." >&2
  exit 1
fi

ENDPOINT="$(echo "$UNPOOLED_URI" | grep -oE 'ep-[a-z0-9-]+' | head -1)"
echo "── BBF Database Backup ──────────────────────────────────"
echo "  Label:    ${LABEL}"
echo "  Endpoint: ${ENDPOINT:-unknown} (unpooled)"
echo "  Output:   ${DUMP_FILE}"
echo "  Format:   custom (-Fc, input for pg_restore)"
echo "────────────────────────────────────────────────────────"
echo ""

# NOTE: pg_dump client is $(pg_dump -V | head -1). Neon runs PostgreSQL 17.x.
# pg_dump 17+ client is recommended for exact match; 18.x is backward-compatible.
echo "▶ pg_dump version: $(pg_dump -V | head -1)"
echo "▶ Running pg_dump..."
PGSSLMODE=require pg_dump \
  --format=custom \
  --verbose \
  --no-acl \
  --no-owner \
  --file="$DUMP_FILE" \
  "$UNPOOLED_URI"

echo ""
echo "▶ Verifying dump..."

if [ ! -f "$DUMP_FILE" ]; then
  echo "ERROR: dump file was not created: $DUMP_FILE" >&2
  exit 1
fi

# Cross-platform file size (macOS: -f%z, Linux: -c%s)
SIZE_BYTES="$(stat -f%z "$DUMP_FILE" 2>/dev/null || stat -c%s "$DUMP_FILE" 2>/dev/null || echo 0)"
if [ "$SIZE_BYTES" -eq 0 ]; then
  echo "ERROR: dump file is 0 bytes — backup is empty/broken" >&2
  rm -f "$DUMP_FILE"
  exit 1
fi

# Count non-comment lines in the object listing (real objects, not headers)
OBJECT_COUNT="$(pg_restore --list "$DUMP_FILE" 2>/dev/null | grep -cv '^;' || echo 0)"
if [ "$OBJECT_COUNT" -eq 0 ]; then
  echo "ERROR: dump lists 0 objects — likely corrupt or empty schema" >&2
  rm -f "$DUMP_FILE"
  exit 1
fi

SIZE_HUMAN="$(du -sh "$DUMP_FILE" | cut -f1)"

echo ""
echo "── Backup Complete ──────────────────────────────────────"
echo "  File:    ${DUMP_FILE}"
echo "  Size:    ${SIZE_HUMAN}"
echo "  Objects: ${OBJECT_COUNT}"
echo "────────────────────────────────────────────────────────"
echo ""
echo "Restore with: ./scripts/db-restore.sh ${DUMP_FILE}"

# ============================================================
# EXTENSION POINT — Offsite Upload (D-BACKUP-01 roadmap)
#
# When ready to implement:
#   1. Upload $DUMP_FILE to Vercel Blob or S3 (use env vars for tokens).
#   2. Print the remote URL after successful upload.
#   3. Optionally delete local file after confirmed upload.
#   4. Add retention/cleanup of old dumps here.
#
# This block is intentionally a stub so the upload is ADDITIVE —
# no rewrite of the verification logic above is needed.
#
# upload_offsite() {
#   local file="$1"
#   # TODO: vercel blob upload "$file" --token "$VERCEL_BLOB_TOKEN"
#   # or: aws s3 cp "$file" "s3://bbf-backups/$(basename $file)"
# }
# upload_offsite "$DUMP_FILE"
# ============================================================
