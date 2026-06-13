import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * D-DS-18 + D-NAV-11 (2026-06-14)
 *
 * UP:
 *   1. CREATE site_cta_library global + items array + items_locales
 *   2. nav.headerCta: ADD ctaKey, DROP label (locales) + DROP intent (enum)
 *
 * DOWN: reverses all changes (re-adds label/intent to nav).
 *
 * Idempotent: IF NOT EXISTS / IF EXISTS guards en todas las operaciones.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- ── SiteCtaLibrary enums ────────────────────────────────────────────────
    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_cta_library_items_type"
        AS ENUM('solid', 'outline');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_cta_library_items_intent"
        AS ENUM('primary', 'secondary', 'outline', 'outline-dark');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    -- ── site_cta_library (global root — 1 row) ──────────────────────────────
    CREATE TABLE IF NOT EXISTS "public"."site_cta_library" (
      "id"         serial PRIMARY KEY NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    -- ── site_cta_library_items (array) ──────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "public"."site_cta_library_items" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "key"       varchar NOT NULL,
      "type"      "enum_site_cta_library_items_type" DEFAULT 'solid' NOT NULL,
      "intent"    "enum_site_cta_library_items_intent" DEFAULT 'primary' NOT NULL
    );

    -- ── site_cta_library_items_locales ─────────────────────────────────────
    CREATE TABLE IF NOT EXISTS "public"."site_cta_library_items_locales" (
      "label"      varchar NOT NULL,
      "id"         serial PRIMARY KEY NOT NULL,
      "_locale"    "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    -- ── Constraints ─────────────────────────────────────────────────────────
    DO $$ BEGIN
      ALTER TABLE "public"."site_cta_library_items"
        ADD CONSTRAINT "site_cta_library_items_parent_id_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "public"."site_cta_library"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "public"."site_cta_library_items_locales"
        ADD CONSTRAINT "site_cta_library_items_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "public"."site_cta_library_items"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    -- ── Indexes ─────────────────────────────────────────────────────────────
    CREATE INDEX IF NOT EXISTS "site_cta_library_items_order_idx"
      ON "public"."site_cta_library_items" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "site_cta_library_items_parent_id_idx"
      ON "public"."site_cta_library_items" USING btree ("_parent_id");

    CREATE UNIQUE INDEX IF NOT EXISTS "site_cta_library_items_locales_locale_parent_id_unique"
      ON "public"."site_cta_library_items_locales"
      USING btree ("_locale", "_parent_id");

    -- ── nav.headerCta: ADD ctaKey ────────────────────────────────────────────
    ALTER TABLE "public"."site_navigation"
      ADD COLUMN IF NOT EXISTS "header_cta_cta_key" varchar;

    -- ── nav.headerCta: DROP intent column + enum ────────────────────────────
    ALTER TABLE "public"."site_navigation"
      DROP COLUMN IF EXISTS "header_cta_intent";

    DROP TYPE IF EXISTS "public"."enum_site_navigation_header_cta_intent";

    -- ── nav.headerCta: DROP localized label + empty locales table ───────────
    -- header_cta_label was the only data column in site_navigation_locales.
    -- After dropping it, the table has no data columns → drop the table itself.
    -- Structural columns (_id, _locale, _parent_id) carry no content without data cols.
    DROP TABLE IF EXISTS "public"."site_navigation_locales";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- ── Restore nav.headerCta label ─────────────────────────────────────────
    -- Re-create site_navigation_locales (UP dropped it along with its only data col).
    CREATE TABLE IF NOT EXISTS "public"."site_navigation_locales" (
      "id"         serial PRIMARY KEY NOT NULL,
      "_locale"    "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );
    DO $$ BEGIN
      ALTER TABLE "public"."site_navigation_locales"
        ADD CONSTRAINT "site_navigation_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "public"."site_navigation"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
    CREATE UNIQUE INDEX IF NOT EXISTS "site_navigation_locales_locale_parent_id_unique"
      ON "public"."site_navigation_locales" USING btree ("_locale", "_parent_id");
    ALTER TABLE "public"."site_navigation_locales"
      ADD COLUMN IF NOT EXISTS "header_cta_label" varchar NOT NULL DEFAULT '';

    -- ── Restore nav.headerCta intent ────────────────────────────────────────
    DO $$ BEGIN
      CREATE TYPE "public"."enum_site_navigation_header_cta_intent"
        AS ENUM('primary', 'secondary', 'outline');
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    ALTER TABLE "public"."site_navigation"
      ADD COLUMN IF NOT EXISTS "header_cta_intent"
        "enum_site_navigation_header_cta_intent"
        NOT NULL DEFAULT 'primary';

    ALTER TABLE "public"."site_navigation"
      DROP COLUMN IF EXISTS "header_cta_cta_key";

    -- ── Drop SiteCtaLibrary tables ───────────────────────────────────────────
    DROP TABLE IF EXISTS "public"."site_cta_library_items_locales";
    DROP TABLE IF EXISTS "public"."site_cta_library_items";
    DROP TABLE IF EXISTS "public"."site_cta_library";
    DROP TYPE IF EXISTS "public"."enum_site_cta_library_items_intent";
    DROP TYPE IF EXISTS "public"."enum_site_cta_library_items_type";
  `);
}
