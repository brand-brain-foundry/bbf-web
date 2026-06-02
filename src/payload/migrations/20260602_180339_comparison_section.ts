import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Enums — ADD VALUE IF NOT EXISTS (idempotente, L-BBF-205)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TYPE "public"."lis_var" ADD VALUE IF NOT EXISTS 'case-2d';
    EXCEPTION WHEN others THEN null; END $$;
    DO $$ BEGIN
      ALTER TYPE "public"."lis_var" ADD VALUE IF NOT EXISTS 'comparison-2d';
    EXCEPTION WHEN others THEN null; END $$;
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_site_homepage_case_study_video_sources_type') THEN
        CREATE TYPE "public"."enum_site_homepage_case_study_video_sources_type"
          AS ENUM('webm-av1', 'webm-vp9', 'mp4-h264', 'mp4-h265', 'mp4-av1', 'mov');
      END IF;
    END $$;
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cmp_cells_state') THEN
        CREATE TYPE "public"."enum_cmp_cells_state" AS ENUM('yes', 'no', 'mid', 'text');
      END IF;
    END $$;
  `);

  // 2. caseStudy tables — carry-forward from case_study_section migration (IF NOT EXISTS — idempotente)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_homepage_case_study_phases" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "site_homepage_case_study_phases_locales" (
      "tag" varchar NOT NULL,
      "title" varchar NOT NULL,
      "body" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "site_homepage_case_study_video_sources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "src" varchar NOT NULL,
      "type" "enum_site_homepage_case_study_video_sources_type" NOT NULL
    );
  `);

  // 3. caseStudy scalar columns (IF NOT EXISTS — idempotente)
  await db.execute(sql`
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "case_study_media_timestamp" varchar;
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "case_study_media_asset_id" integer;
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "case_study_video_poster_id" integer;
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "case_study_cta_href" varchar DEFAULT '/casos/sivar-brains';
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "case_study_eyebrow" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "case_study_h2_line1" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "case_study_h2_line2_soft" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "case_study_lead" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "case_study_media_chrome_label" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "case_study_quote_text" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "case_study_quote_caption" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "case_study_cta_label" varchar;
  `);

  // 4. comparison §4 tables (IF NOT EXISTS — idempotente)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "cmp_columns" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "is_highlighted" boolean DEFAULT false
    );
    CREATE TABLE IF NOT EXISTS "cmp_columns_locales" (
      "label" varchar NOT NULL,
      "sub" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "cmp_cells" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "state" "enum_cmp_cells_state" DEFAULT 'text' NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "cmp_cells_locales" (
      "value" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "cmp_rows" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL
    );
    CREATE TABLE IF NOT EXISTS "cmp_rows_locales" (
      "attribute" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `);

  // 5. comparison §4 scalar columns (IF NOT EXISTS)
  await db.execute(sql`
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "comparison_eyebrow" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "comparison_h2_line1" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "comparison_h2_line2_soft" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "comparison_lead" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "comparison_epilogue_title" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "comparison_epilogue_body" varchar;
  `);

  // 6. Foreign keys — DO blocks (L-BBF-205: duplicate_object → null)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "site_homepage_case_study_phases"
        ADD CONSTRAINT "site_homepage_case_study_phases_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage_case_study_phases_locales"
        ADD CONSTRAINT "site_homepage_case_study_phases_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_case_study_phases"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage_case_study_video_sources"
        ADD CONSTRAINT "site_homepage_case_study_video_sources_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage"
        ADD CONSTRAINT "site_homepage_case_study_media_asset_id_media_id_fk"
        FOREIGN KEY ("case_study_media_asset_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage"
        ADD CONSTRAINT "site_homepage_case_study_video_poster_id_media_id_fk"
        FOREIGN KEY ("case_study_video_poster_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "cmp_columns"
        ADD CONSTRAINT "cmp_columns_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "cmp_columns_locales"
        ADD CONSTRAINT "cmp_columns_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."cmp_columns"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "cmp_cells"
        ADD CONSTRAINT "cmp_cells_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."cmp_rows"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "cmp_cells_locales"
        ADD CONSTRAINT "cmp_cells_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."cmp_cells"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "cmp_rows"
        ADD CONSTRAINT "cmp_rows_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;

    DO $$ BEGIN
      ALTER TABLE "cmp_rows_locales"
        ADD CONSTRAINT "cmp_rows_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."cmp_rows"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null; END $$;
  `);

  // 7. Indexes (IF NOT EXISTS — idempotente)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_video_sources_order_idx"
      ON "site_homepage_case_study_video_sources" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_video_sources_parent_id_idx"
      ON "site_homepage_case_study_video_sources" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_phases_order_idx"
      ON "site_homepage_case_study_phases" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_phases_parent_id_idx"
      ON "site_homepage_case_study_phases" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "site_homepage_case_study_phases_locs_locale_parent_id_uni"
      ON "site_homepage_case_study_phases_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_media_asset_idx"
      ON "site_homepage" USING btree ("case_study_media_asset_id");
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_video_poster_idx"
      ON "site_homepage" USING btree ("case_study_video_poster_id");
    CREATE INDEX IF NOT EXISTS "cmp_columns_order_idx"
      ON "cmp_columns" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "cmp_columns_parent_id_idx"
      ON "cmp_columns" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "cmp_columns_locales_locale_parent_id_unique"
      ON "cmp_columns_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "cmp_cells_order_idx"
      ON "cmp_cells" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "cmp_cells_parent_id_idx"
      ON "cmp_cells" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "cmp_cells_locales_locale_parent_id_unique"
      ON "cmp_cells_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "cmp_rows_order_idx"
      ON "cmp_rows" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "cmp_rows_parent_id_idx"
      ON "cmp_rows" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "cmp_rows_locales_locale_parent_id_unique"
      ON "cmp_rows_locales" USING btree ("_locale","_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "cmp_columns" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "cmp_columns_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "cmp_cells" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "cmp_cells_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "cmp_rows" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "cmp_rows_locales" DISABLE ROW LEVEL SECURITY;
    DROP TABLE IF EXISTS "cmp_columns" CASCADE;
    DROP TABLE IF EXISTS "cmp_columns_locales" CASCADE;
    DROP TABLE IF EXISTS "cmp_cells" CASCADE;
    DROP TABLE IF EXISTS "cmp_cells_locales" CASCADE;
    DROP TABLE IF EXISTS "cmp_rows" CASCADE;
    DROP TABLE IF EXISTS "cmp_rows_locales" CASCADE;
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "comparison_eyebrow";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "comparison_h2_line1";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "comparison_h2_line2_soft";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "comparison_lead";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "comparison_epilogue_title";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "comparison_epilogue_body";
    DROP TYPE IF EXISTS "public"."enum_cmp_cells_state";
  `);
}
