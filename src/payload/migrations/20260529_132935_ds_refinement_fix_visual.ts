import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."lis_var_sec" AS ENUM('trefoil-2d', 'pretzel-2d', 'wave-2d', 'ring-2d', 'dense-2d', 'figure8-2d');
  CREATE TYPE "public"."lis_anim_sec" AS ENUM('static', 'point-center');
  ALTER TABLE "site_homepage" ADD COLUMN "capabilities_lissajous_variant" "lis_var_sec" DEFAULT 'trefoil-2d';
  ALTER TABLE "site_homepage" ADD COLUMN "capabilities_lissajous_animation" "lis_anim_sec" DEFAULT 'point-center';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_homepage" DROP COLUMN "capabilities_lissajous_variant";
  ALTER TABLE "site_homepage" DROP COLUMN "capabilities_lissajous_animation";
  DROP TYPE "public"."lis_var_sec";
  DROP TYPE "public"."lis_anim_sec";`)
}
