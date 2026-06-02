import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. Enum — ADD VALUE IF NOT EXISTS (idempotente, separado del resto)
  await db.execute(sql`ALTER TYPE "public"."lis_var" ADD VALUE IF NOT EXISTS 'case-2d'`);

  // 2. Tablas (IF NOT EXISTS — idempotente si dev mode ya las creó)
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
  `);

  // 3. Columnas escalares (IF NOT EXISTS — idempotente)
  await db.execute(sql`
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "case_study_media_timestamp" varchar;
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "case_study_media_asset_id" integer;
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

  // 4. Foreign keys — DO block con EXCEPTION (L-BBF-205: duplicate_object → null)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "site_homepage_case_study_phases"
        ADD CONSTRAINT "site_homepage_case_study_phases_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage_case_study_phases_locales"
        ADD CONSTRAINT "site_homepage_case_study_phases_locales_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_case_study_phases"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage"
        ADD CONSTRAINT "site_homepage_case_study_media_asset_id_media_id_fk"
        FOREIGN KEY ("case_study_media_asset_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  // 5. Indexes (IF NOT EXISTS — idempotente)
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_phases_order_idx"
      ON "site_homepage_case_study_phases" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_phases_parent_id_idx"
      ON "site_homepage_case_study_phases" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "site_homepage_case_study_phases_locales_locale_parent_id_un"
      ON "site_homepage_case_study_phases_locales" USING btree ("_locale","_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_homepage_case_study_phases_locales" CASCADE;
    DROP TABLE IF EXISTS "site_homepage_case_study_phases" CASCADE;

    ALTER TABLE "site_homepage" DROP CONSTRAINT IF EXISTS "site_homepage_case_study_media_asset_id_media_id_fk";
    ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "case_study_media_timestamp";
    ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "case_study_media_asset_id";
    ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "case_study_cta_href";

    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "case_study_eyebrow";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "case_study_h2_line1";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "case_study_h2_line2_soft";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "case_study_lead";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "case_study_media_chrome_label";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "case_study_quote_text";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "case_study_quote_caption";
    ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "case_study_cta_label";
  `);
}
