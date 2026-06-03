import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // L-BBF-232: IF NOT EXISTS — dev mode may have already applied these columns
  await db.execute(sql`
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "closing_brand_line" varchar DEFAULT 'Brand Brain Foundry';
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "closing_brand_year" varchar;
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "closing_cta_href" varchar DEFAULT '/contacto';
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "closing_eyebrow" varchar DEFAULT '§6 · CIERRE';
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "closing_statement_line1" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "closing_statement_line2_soft" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "closing_cta_label" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "closing_cta_note" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "closing_signature_tagline" varchar;
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_homepage" DROP COLUMN "closing_brand_line";
  ALTER TABLE "site_homepage" DROP COLUMN "closing_brand_year";
  ALTER TABLE "site_homepage" DROP COLUMN "closing_cta_href";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "closing_eyebrow";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "closing_statement_line1";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "closing_statement_line2_soft";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "closing_cta_label";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "closing_cta_note";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "closing_signature_tagline";`);
}
