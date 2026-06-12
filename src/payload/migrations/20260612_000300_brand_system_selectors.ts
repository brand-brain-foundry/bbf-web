import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from '@payloadcms/db-postgres';

// D-DS-01 (2026-06-12) — BrandSystem schema: texto placeholder → selectores de alto nivel.
// Opción B firmada: selectores como config (ISR-safe, zero runtime overhead).
//
// UP:
//   1. Crear enums para los 6 campos selectores (idempotentes)
//   2. DROP columnas antiguas (colors_primary/background/accent, typography_display/body text)
//   3. ADD columnas nuevas con tipos enum + defaults canónicos
//
// DOWN: revertir — DROP enum columns, ADD varchar columns vacíos.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Step 1: Crear enums (idempotentes) ────────────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_brand_system_colors_primary_palette"
        AS ENUM('red', 'blue');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_brand_system_colors_theme_mode"
        AS ENUM('light', 'dark', 'auto');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_brand_system_typography_display_family"
        AS ENUM('inter', 'custom');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_brand_system_typography_body_family"
        AS ENUM('mulish', 'custom');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_brand_system_brand_logo_variant"
        AS ENUM('icon', 'horizontal', 'name-only', 'stamp');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_brand_system_brand_accent_gradient"
        AS ENUM('red-animated', 'blue-animated', 'none');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  // ── Step 2: DROP columnas placeholder antiguas ───────────────────────────
  await db.execute(sql`
    ALTER TABLE "public"."brand_system"
      DROP COLUMN IF EXISTS "colors_primary",
      DROP COLUMN IF EXISTS "colors_background",
      DROP COLUMN IF EXISTS "colors_accent",
      DROP COLUMN IF EXISTS "typography_display_family",
      DROP COLUMN IF EXISTS "typography_body_family";
  `);

  // ── Step 3: ADD columnas selectores con defaults canónicos ───────────────
  await db.execute(sql`
    ALTER TABLE "public"."brand_system"
      ADD COLUMN IF NOT EXISTS "colors_primary_palette"
        "public"."enum_brand_system_colors_primary_palette" DEFAULT 'blue',
      ADD COLUMN IF NOT EXISTS "colors_theme_mode"
        "public"."enum_brand_system_colors_theme_mode" DEFAULT 'light',
      ADD COLUMN IF NOT EXISTS "typography_display_family"
        "public"."enum_brand_system_typography_display_family" DEFAULT 'inter',
      ADD COLUMN IF NOT EXISTS "typography_body_family"
        "public"."enum_brand_system_typography_body_family" DEFAULT 'mulish',
      ADD COLUMN IF NOT EXISTS "brand_logo_variant"
        "public"."enum_brand_system_brand_logo_variant" DEFAULT 'horizontal',
      ADD COLUMN IF NOT EXISTS "brand_accent_gradient"
        "public"."enum_brand_system_brand_accent_gradient" DEFAULT 'blue-animated';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // ── Revert Step 3: DROP enum columns ──────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "public"."brand_system"
      DROP COLUMN IF EXISTS "colors_primary_palette",
      DROP COLUMN IF EXISTS "colors_theme_mode",
      DROP COLUMN IF EXISTS "typography_display_family",
      DROP COLUMN IF EXISTS "typography_body_family",
      DROP COLUMN IF EXISTS "brand_logo_variant",
      DROP COLUMN IF EXISTS "brand_accent_gradient";
  `);

  // ── Revert Step 1: DROP enums ─────────────────────────────────────────────
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_brand_system_colors_primary_palette";
  `);
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_brand_system_colors_theme_mode";
  `);
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_brand_system_typography_display_family";
  `);
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_brand_system_typography_body_family";
  `);
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_brand_system_brand_logo_variant";
  `);
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_brand_system_brand_accent_gradient";
  `);

  // ── Revert Step 2: Re-add varchar columns ─────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "public"."brand_system"
      ADD COLUMN IF NOT EXISTS "colors_primary" varchar DEFAULT '#000000',
      ADD COLUMN IF NOT EXISTS "colors_background" varchar DEFAULT '#FFFFFF',
      ADD COLUMN IF NOT EXISTS "colors_accent" varchar,
      ADD COLUMN IF NOT EXISTS "typography_display_family" varchar DEFAULT 'Inter',
      ADD COLUMN IF NOT EXISTS "typography_body_family" varchar DEFAULT 'Mulish';
  `);
}
