import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // D-S456-02: reemplazar group cierre.cta {label, href} por campo ctaKey que
  // referencia SiteCtaLibrary — mismo patrón que hero.ctas[].ctaKey (L-BBF-254).
  // Guards idempotentes: ADD COLUMN IF NOT EXISTS + DROP COLUMN IF EXISTS.

  // 1 — nueva columna ctaKey en site_homepage
  await db.execute(
    sql`ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "closing_cta_key" varchar;`,
  );

  // 2 — drops legacy del group cta (IF EXISTS para idempotencia)
  await db.execute(sql`ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "closing_cta_href";`);
  await db.execute(
    sql`ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "closing_cta_label";`,
  );
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(
    sql`ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "closing_cta_href" varchar DEFAULT '/contacto';`,
  );
  await db.execute(
    sql`ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "closing_cta_label" varchar;`,
  );
  await db.execute(sql`ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "closing_cta_key";`);
}
