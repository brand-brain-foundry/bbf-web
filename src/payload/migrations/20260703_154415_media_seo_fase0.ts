import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_media_in_language" AS ENUM('es', 'en');
  ALTER TABLE "media" ADD COLUMN "duration" numeric;
  ALTER TABLE "media" ADD COLUMN "in_language" "enum_media_in_language";
  ALTER TABLE "media_locales" ADD COLUMN "seo_name" varchar;
  ALTER TABLE "media_locales" ADD COLUMN "seo_description" varchar;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "media" DROP COLUMN "duration";
  ALTER TABLE "media" DROP COLUMN "in_language";
  ALTER TABLE "media_locales" DROP COLUMN "seo_name";
  ALTER TABLE "media_locales" DROP COLUMN "seo_description";
  DROP TYPE "public"."enum_media_in_language";`)
}
