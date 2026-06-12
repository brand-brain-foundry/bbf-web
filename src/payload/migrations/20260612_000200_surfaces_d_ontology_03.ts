import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from '@payloadcms/db-postgres';

// D-ONTOLOGY-03 (FIRMADA 2026-06-07) — Surfaces: contentItemRef optional + globalRef polymorphic.
// 4B-ON-11: homepage es Global 'site-homepage', no ContentItem.
//
// Guards idempotentes: dev-mode push previo puede haber aplicado el enum antes de esta migración.
// (L-BBF-254: migrate:create hace dev-push en background — enums aparecen en DB sin registro formal)
//
// UP:
//   1. Create enum enum_surfaces_global_ref (idempotente via DO EXCEPTION)
//   2. ALTER surfaces.content_item_ref_id DROP NOT NULL
//   3. ADD COLUMN IF NOT EXISTS surfaces.global_ref
//   4. CREATE INDEX IF NOT EXISTS surfaces_global_ref_idx
//
// DOWN: reverse — SET NOT NULL, DROP COLUMN, DROP ENUM.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Step 1: Create enum (idempotente) ─────────────────────────────────────
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_surfaces_global_ref" AS ENUM(
        'site-homepage',
        'site-identity',
        'socialLinks',
        'brandSystem',
        'site-navigation',
        'seoDefaults',
        'site-newsletter',
        'site-contact'
      );
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
  `);

  // ── Step 2: Make contentItemRef nullable ──────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "public"."surfaces"
      ALTER COLUMN "content_item_ref_id" DROP NOT NULL;
  `);

  // ── Step 3: Add globalRef column (idempotente) ────────────────────────────
  await db.execute(sql`
    ALTER TABLE "public"."surfaces"
      ADD COLUMN IF NOT EXISTS "global_ref" "public"."enum_surfaces_global_ref";
  `);

  // ── Step 4: Index on globalRef ────────────────────────────────────────────
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "surfaces_global_ref_idx"
      ON "public"."surfaces" USING btree ("global_ref");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "surfaces_global_ref_idx";
  `);

  await db.execute(sql`
    ALTER TABLE "public"."surfaces"
      DROP COLUMN IF EXISTS "global_ref";
  `);

  await db.execute(sql`
    ALTER TABLE "public"."surfaces"
      ALTER COLUMN "content_item_ref_id" SET NOT NULL;
  `);

  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_surfaces_global_ref";
  `);
}
