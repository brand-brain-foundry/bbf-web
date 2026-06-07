import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Migration: Refactor founder group → founders array (FASE 3.6 multi-founder).
 *
 * What this does (idempotent):
 * 1. Create site_identity_founders table (array main table)
 * 2. Create site_identity_founders_locales table (localized role field)
 * 3. Migrate existing founder data (Christian Zavala) as founders[0]
 * 4. Drop old founder_name, founder_url, founder_linkedin columns from site_identity
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Step 1: Create founders array table ─────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_identity_founders" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"          varchar PRIMARY KEY NOT NULL,
      "name"        varchar NOT NULL,
      "url"         varchar,
      "linkedin"    varchar,
      "affiliation" varchar
    );
  `);

  // ── Step 2: Create founders locales table (localized role field) ─────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_identity_founders_locales" (
      "role" varchar,
      "id"   serial PRIMARY KEY NOT NULL,
      "_locale"    "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `);

  // ── Step 3: Add FKs and indexes ─────────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "site_identity_founders"
      ADD CONSTRAINT "site_identity_founders_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_identity"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "site_identity_founders_locales"
      ADD CONSTRAINT "site_identity_founders_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_identity_founders"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "site_identity_founders_order_idx"
      ON "site_identity_founders" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_identity_founders_parent_id_idx"
      ON "site_identity_founders" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "site_identity_founders_locales_locale_parent_id_un"
      ON "site_identity_founders_locales" USING btree ("_locale", "_parent_id");
  `);

  // ── Step 4: Migrate existing founder data as founders[0] ─────────────────
  await db.execute(sql`
    INSERT INTO "site_identity_founders" ("_order", "_parent_id", "id", "name", "url", "linkedin", "affiliation")
    SELECT
      1,
      si.id,
      gen_random_uuid()::varchar,
      COALESCE(si.founder_name, 'Christian Zavala'),
      si.founder_url,
      si.founder_linkedin,
      'Brand Brain Foundry'
    FROM "site_identity" si
    WHERE NOT EXISTS (
      SELECT 1 FROM "site_identity_founders" WHERE "_parent_id" = si.id AND "_order" = 1
    );
  `);

  // Insert ES locale row (role = NULL — Zavala fills in admin post-migration)
  await db.execute(sql`
    INSERT INTO "site_identity_founders_locales" ("role", "_locale", "_parent_id")
    SELECT NULL, 'es', f.id
    FROM "site_identity_founders" f
    WHERE NOT EXISTS (
      SELECT 1 FROM "site_identity_founders_locales"
      WHERE "_parent_id" = f.id AND "_locale" = 'es'
    );
  `);

  // Insert EN locale row
  await db.execute(sql`
    INSERT INTO "site_identity_founders_locales" ("role", "_locale", "_parent_id")
    SELECT NULL, 'en', f.id
    FROM "site_identity_founders" f
    WHERE NOT EXISTS (
      SELECT 1 FROM "site_identity_founders_locales"
      WHERE "_parent_id" = f.id AND "_locale" = 'en'
    );
  `);

  // ── Step 5: Drop old founder flat columns ────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "site_identity" DROP COLUMN IF EXISTS "founder_name";
    ALTER TABLE "site_identity" DROP COLUMN IF EXISTS "founder_url";
    ALTER TABLE "site_identity" DROP COLUMN IF EXISTS "founder_linkedin";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore flat columns from array data
  await db.execute(sql`
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "founder_name" varchar;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "founder_url" varchar;
    ALTER TABLE "site_identity" ADD COLUMN IF NOT EXISTS "founder_linkedin" varchar;
  `);

  await db.execute(sql`
    UPDATE "site_identity" si
    SET
      founder_name     = (SELECT name     FROM "site_identity_founders" WHERE "_parent_id" = si.id ORDER BY "_order" LIMIT 1),
      founder_url      = (SELECT url      FROM "site_identity_founders" WHERE "_parent_id" = si.id ORDER BY "_order" LIMIT 1),
      founder_linkedin = (SELECT linkedin FROM "site_identity_founders" WHERE "_parent_id" = si.id ORDER BY "_order" LIMIT 1);
  `);

  await db.execute(sql`
    DROP TABLE IF EXISTS "site_identity_founders_locales" CASCADE;
    DROP TABLE IF EXISTS "site_identity_founders" CASCADE;
  `);
}
