import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_homepage_locales" DROP COLUMN "method_quote_text";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "method_quote_text_soft";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "method_quote_attribution";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_homepage_locales" ADD COLUMN "method_quote_text" varchar;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "method_quote_text_soft" varchar;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "method_quote_attribution" varchar;`)
}
