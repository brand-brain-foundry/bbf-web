import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Enum additions must run outside any implicit transaction context — separate calls
  await db.execute(sql`ALTER TYPE "public"."lis_var" ADD VALUE IF NOT EXISTS 'cross-2d'`);
  await db.execute(sql`ALTER TYPE "public"."lis_var" ADD VALUE IF NOT EXISTS 'metodo-2d'`);

  // Tables (IF NOT EXISTS — dev mode may have already created them)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "mth_phases" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "number" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "mth_phases_locales" (
      "short_label" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "mth_deliverables" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "mth_deliverables_locales" (
      "text" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "mth_services" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "number" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "mth_services_locales" (
      "name" varchar NOT NULL,
      "duration" varchar,
      "commitment" varchar,
      "body" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `);

  // ALTER COLUMN (DROP NOT NULL is idempotent in PG — safe to re-run)
  await db.execute(sql`
    ALTER TABLE "site_homepage_locales" ALTER COLUMN "comparison_h2_line1" DROP NOT NULL;
    ALTER TABLE "site_homepage_locales" ALTER COLUMN "comparison_lead" DROP NOT NULL;
  `);

  // ADD COLUMN IF NOT EXISTS (PG 9.6+)
  await db.execute(sql`
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "method_cta_href" varchar DEFAULT '/metodo';
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "method_eyebrow" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "method_h2_line1" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "method_h2_line2_soft" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "method_quote_text" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "method_quote_text_soft" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "method_quote_attribution" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "method_cta_label" varchar;
  `);

  // Foreign keys (ignore if already exist)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "mth_phases" ADD CONSTRAINT "mth_phases_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "mth_phases_locales" ADD CONSTRAINT "mth_phases_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."mth_phases"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "mth_deliverables" ADD CONSTRAINT "mth_deliverables_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."mth_services"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "mth_deliverables_locales" ADD CONSTRAINT "mth_deliverables_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."mth_deliverables"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "mth_services" ADD CONSTRAINT "mth_services_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
    DO $$ BEGIN
      ALTER TABLE "mth_services_locales" ADD CONSTRAINT "mth_services_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."mth_services"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  // Indexes (IF NOT EXISTS)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "mth_phases_order_idx" ON "mth_phases" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "mth_phases_parent_id_idx" ON "mth_phases" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "mth_phases_locales_locale_parent_id_unique" ON "mth_phases_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "mth_deliverables_order_idx" ON "mth_deliverables" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "mth_deliverables_parent_id_idx" ON "mth_deliverables" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "mth_deliverables_locales_locale_parent_id_unique" ON "mth_deliverables_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "mth_services_order_idx" ON "mth_services" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "mth_services_parent_id_idx" ON "mth_services" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "mth_services_locales_locale_parent_id_unique" ON "mth_services_locales" USING btree ("_locale","_parent_id");
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "mth_phases" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "mth_phases_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "mth_deliverables" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "mth_deliverables_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "mth_services" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "mth_services_locales" DISABLE ROW LEVEL SECURITY;
    DROP TABLE IF EXISTS "mth_phases" CASCADE;
    DROP TABLE IF EXISTS "mth_phases_locales" CASCADE;
    DROP TABLE IF EXISTS "mth_deliverables" CASCADE;
    DROP TABLE IF EXISTS "mth_deliverables_locales" CASCADE;
    DROP TABLE IF EXISTS "mth_services" CASCADE;
    DROP TABLE IF EXISTS "mth_services_locales" CASCADE;
    ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_media_lissajous_variant" SET DATA TYPE text;
    ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_media_lissajous_variant" SET DEFAULT 'trefoil-2d'::text;
    DROP TYPE IF EXISTS "public"."lis_var";
    CREATE TYPE "public"."lis_var" AS ENUM('trefoil-2d', 'pretzel-2d', 'wave-2d', 'ring-2d', 'dense-2d', 'figure8-2d', 'process-2d', 'case-2d', 'comparison-2d');
    ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_media_lissajous_variant" SET DEFAULT 'trefoil-2d'::"public"."lis_var";
    ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_media_lissajous_variant" SET DATA TYPE "public"."lis_var" USING "scene_media_lissajous_variant"::"public"."lis_var";
    ALTER TABLE "site_homepage_locales" ALTER COLUMN "comparison_h2_line1" SET NOT NULL;
    ALTER TABLE "site_homepage_locales" ALTER COLUMN "comparison_lead" SET NOT NULL;
    ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "method_cta_href";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "method_eyebrow";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "method_h2_line1";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "method_h2_line2_soft";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "method_quote_text";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "method_quote_text_soft";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "method_quote_attribution";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "method_cta_label";
  `);
}
