import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DO $$ BEGIN
    CREATE TYPE "public"."m_type" AS ENUM('image', 'video');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  DO $$ BEGIN
    CREATE TYPE "public"."lis_var" AS ENUM('trefoil-2d', 'pretzel-2d', 'wave-2d', 'ring-2d', 'dense-2d', 'figure8-2d');
  EXCEPTION
    WHEN duplicate_object THEN null;
  END $$;
  ALTER TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" ADD VALUE IF NOT EXISTS 'media';
  ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN "scene_media_media_type" "m_type" DEFAULT 'image';
  ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN "scene_media_asset_id" integer;
  ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN "scene_media_poster_fallback_id" integer;
  ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN "scene_media_lissajous_variant" "lis_var" DEFAULT 'trefoil-2d';
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_media_caption" varchar;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_media_footer" varchar;
  ALTER TABLE "site_homepage_capabilities_items" ADD CONSTRAINT "site_homepage_capabilities_items_scene_media_asset_id_media_id_fk" FOREIGN KEY ("scene_media_asset_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_homepage_capabilities_items" ADD CONSTRAINT "site_homepage_capabilities_items_scene_media_poster_fallback_id_media_id_fk" FOREIGN KEY ("scene_media_poster_fallback_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_homepage_capabilities_items_scene_media_scene_media_idx" ON "site_homepage_capabilities_items" USING btree ("scene_media_asset_id");
  CREATE INDEX "site_homepage_capabilities_items_scene_media_scene_med_1_idx" ON "site_homepage_capabilities_items" USING btree ("scene_media_poster_fallback_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_homepage_capabilities_items" DROP CONSTRAINT "site_homepage_capabilities_items_scene_media_asset_id_media_id_fk";
  
  ALTER TABLE "site_homepage_capabilities_items" DROP CONSTRAINT "site_homepage_capabilities_items_scene_media_poster_fallback_id_media_id_fk";
  
  ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_homepage_capabilities_items_scene_kind";
  CREATE TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" AS ENUM('chat', 'pipeline', 'workflow', 'stack');
  ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_kind" SET DATA TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" USING "scene_kind"::"public"."enum_site_homepage_capabilities_items_scene_kind";
  DROP INDEX "site_homepage_capabilities_items_scene_media_scene_media_idx";
  DROP INDEX "site_homepage_capabilities_items_scene_media_scene_med_1_idx";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_media_media_type";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_media_asset_id";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_media_poster_fallback_id";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_media_lissajous_variant";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_media_caption";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_media_footer";
  DROP TYPE "public"."m_type";
  DROP TYPE "public"."lis_var";`);
}
