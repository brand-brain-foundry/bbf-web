import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

// up() es no-op: el dev-mode auto-push ya creó enum+tablas+FK+indexes de capsules
// antes de que esta migration corriera. Este SELECT 1 registra la migration sin
// re-crear objetos existentes. down() sí dropea (revertibilidad). Ver L-BBF-287.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`SELECT 1`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "site_homepage_seo_answer_capsules_locales";
  DROP TABLE IF EXISTS "site_homepage_seo_answer_capsules";
  DROP TYPE IF EXISTS "public"."enum_site_homepage_seo_answer_capsules_section_id";`);
}
