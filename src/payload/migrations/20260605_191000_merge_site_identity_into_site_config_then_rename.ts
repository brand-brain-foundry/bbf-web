import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Migration: Merge SiteIdentity + SiteConfig → single SiteIdentity global.
 *
 * What this does (in order, all idempotent):
 * 1. Add new columns to site_identity (from SiteConfig schema)
 * 2. Add new localized columns to site_identity_locales
 * 3. Create array tables (schemaKnowsAbout, schemaSameAs)
 * 4. Copy data from site_config → site_identity BEFORE dropping
 * 5. Drop old site_identity columns that moved to locales (site_name, tagline, short_description)
 * 6. Drop old enum for statusBanner.dotColor (now text)
 * 7. Drop site_config tables
 *
 * D-REBRAND-05: Escenario C firmado por Zavala.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Step 1: Add new columns to site_identity ──────────────────────────
  await db.execute(sql`
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "site_domain" varchar NOT NULL DEFAULT 'https://sivarbrains.com';
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "founder_name" varchar;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "founder_url" varchar;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "founder_linkedin" varchar;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "producer_name" varchar;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "producer_url" varchar;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "seo_twitter_handle" varchar;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "seo_og_image_path" varchar DEFAULT '/og-image.png';
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "seo_theme_color" varchar DEFAULT '#0a0a0a';
  `);

  // Create enum for seo_default_locale (new column)
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_identity_seo_default_locale" AS ENUM('es_SV', 'es', 'en_US');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "seo_default_locale" "enum_site_identity_seo_default_locale" DEFAULT 'es_SV';
  `);

  // Change status_banner_dot_color from enum to text (was select, now text field)
  // Handle the column type change safely
  await db.execute(sql`
    DO $$ BEGIN
      IF EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'site_identity'
        AND column_name = 'status_banner_dot_color'
        AND data_type = 'USER-DEFINED'
      ) THEN
        ALTER TABLE "site_identity" ALTER COLUMN "status_banner_dot_color" TYPE varchar USING status_banner_dot_color::text;
      END IF;
    END $$;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "status_banner_enabled" boolean DEFAULT false;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "status_banner_href" varchar;
  `);

  // ── Step 2: Add new localized columns to site_identity_locales ────────
  await db.execute(sql`
    ALTER TABLE "site_identity_locales" ADD COLUMN IF NOT EXISTS "site_name" varchar DEFAULT 'Sivar Brains';
    ALTER TABLE "site_identity_locales" ADD COLUMN IF NOT EXISTS "site_short_name" varchar DEFAULT 'Sivar Brains';
    ALTER TABLE "site_identity_locales" ADD COLUMN IF NOT EXISTS "site_tagline" varchar DEFAULT 'Cerebros de marca operacionales';
    ALTER TABLE "site_identity_locales" ADD COLUMN IF NOT EXISTS "site_description" text;
    ALTER TABLE "site_identity_locales" ADD COLUMN IF NOT EXISTS "status_banner_label" varchar;
  `);

  // ── Step 3: Create array tables ───────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_identity_schema_knows_about" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "topic" varchar,
      CONSTRAINT "site_identity_schema_knows_about_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "site_identity"("id") ON DELETE cascade ON UPDATE no action
    );
    CREATE INDEX IF NOT EXISTS "site_identity_schema_knows_about_order_idx"
      ON "site_identity_schema_knows_about" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_identity_schema_knows_about_parent_id_idx"
      ON "site_identity_schema_knows_about" USING btree ("_parent_id");

    CREATE TABLE IF NOT EXISTS "site_identity_schema_same_as" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "url" varchar,
      CONSTRAINT "site_identity_schema_same_as_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "site_identity"("id") ON DELETE cascade ON UPDATE no action
    );
    CREATE INDEX IF NOT EXISTS "site_identity_schema_same_as_order_idx"
      ON "site_identity_schema_same_as" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_identity_schema_same_as_parent_id_idx"
      ON "site_identity_schema_same_as" USING btree ("_parent_id");
  `);

  // ── Step 4: Copy data from site_config → site_identity ───────────────
  await db.execute(sql`
    UPDATE "site_identity" si
    SET
      site_domain      = COALESCE((SELECT sc.site_domain FROM site_config sc LIMIT 1), si.site_domain),
      founder_name     = (SELECT sc.founder_name FROM site_config sc LIMIT 1),
      founder_url      = (SELECT sc.founder_url FROM site_config sc LIMIT 1),
      founder_linkedin = (SELECT sc.founder_linkedin FROM site_config sc LIMIT 1),
      producer_name    = (SELECT sc.producer_name FROM site_config sc LIMIT 1),
      producer_url     = (SELECT sc.producer_url FROM site_config sc LIMIT 1),
      seo_twitter_handle = (SELECT sc.seo_twitter_handle FROM site_config sc LIMIT 1),
      seo_og_image_path  = COALESCE((SELECT sc.seo_og_image_path FROM site_config sc LIMIT 1), si.seo_og_image_path),
      seo_theme_color    = COALESCE((SELECT sc.seo_theme_color FROM site_config sc LIMIT 1), si.seo_theme_color),
      seo_default_locale = COALESCE(
        (SELECT sc.seo_default_locale::text FROM site_config sc LIMIT 1)::text::"enum_site_identity_seo_default_locale",
        si.seo_default_locale
      )
    WHERE EXISTS (SELECT 1 FROM site_config LIMIT 1);
  `);

  // Copy localized fields from site_config_locales to site_identity_locales
  await db.execute(sql`
    UPDATE "site_identity_locales" sil
    SET
      site_name        = COALESCE(scl.site_name, sil.site_name),
      site_short_name  = COALESCE(scl.site_short_name, sil.site_short_name),
      site_tagline     = COALESCE(scl.site_tagline, sil.site_tagline),
      site_description = COALESCE(scl.site_description, sil.site_description)
    FROM site_config_locales scl
    WHERE sil._locale = scl._locale
      AND sil._parent_id = (SELECT id FROM site_identity LIMIT 1)
    ;
  `);

  // Copy schemaKnowsAbout array from site_config
  await db.execute(sql`
    INSERT INTO "site_identity_schema_knows_about" ("_order", "_parent_id", "id", "topic")
    SELECT
      sck."_order",
      (SELECT id FROM site_identity LIMIT 1),
      gen_random_uuid()::varchar,
      sck.topic
    FROM "site_config_schema_knows_about" sck
    WHERE EXISTS (SELECT 1 FROM site_config LIMIT 1)
    ON CONFLICT DO NOTHING;
  `);

  // Copy schemaSameAs array from site_config
  await db.execute(sql`
    INSERT INTO "site_identity_schema_same_as" ("_order", "_parent_id", "id", "url")
    SELECT
      scs."_order",
      (SELECT id FROM site_identity LIMIT 1),
      gen_random_uuid()::varchar,
      scs.url
    FROM "site_config_schema_same_as" scs
    WHERE EXISTS (SELECT 1 FROM site_config LIMIT 1)
    ON CONFLICT DO NOTHING;
  `);

  // ── Step 5: Drop old site_identity columns that moved to locales ──────
  // site_name was non-localized in old SiteIdentity — now localized
  await db.execute(sql`
    ALTER TABLE "site_identity" DROP COLUMN IF EXISTS "site_name";
    ALTER TABLE "site_identity_locales" DROP COLUMN IF EXISTS "tagline";
    ALTER TABLE "site_identity_locales" DROP COLUMN IF EXISTS "short_description";
  `);

  // ── Step 6: Drop old enum for statusBanner.dotColor ──────────────────
  await db.execute(sql`
    DO $$ BEGIN
      DROP TYPE IF EXISTS "public"."enum_site_identity_status_banner_dot_color";
    EXCEPTION WHEN others THEN NULL;
    END $$;
  `);

  // ── Step 7: Drop site_config tables ──────────────────────────────────
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_config_schema_knows_about" CASCADE;
    DROP TABLE IF EXISTS "site_config_schema_same_as" CASCADE;
    DROP TABLE IF EXISTS "site_config_locales" CASCADE;
    DROP TABLE IF EXISTS "site_config" CASCADE;
    DO $$ BEGIN
      DROP TYPE IF EXISTS "public"."enum_site_config_seo_default_locale";
    EXCEPTION WHEN others THEN NULL;
    END $$;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Intentionally minimal — restoring from backup is safer for this operation
  // The full rollback would require recreating site_config tables and copying data back
  await db.execute(sql`
    SELECT 1; -- placeholder — restore from backup if rollback needed
  `);
}
