import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Idempotent UP: dev-push applied all 21 objects during FASE 1 schema edit.
  // IF NOT EXISTS + DO/EXCEPTION guards make this a no-op when already applied.
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "cap_app_chps" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "label" varchar
   );

   CREATE TABLE IF NOT EXISTS "cap_app_meta" (
    "_order" integer NOT NULL,
    "_parent_id" varchar NOT NULL,
    "_locale" "_locales" NOT NULL,
    "id" varchar PRIMARY KEY NOT NULL,
    "key" varchar,
    "value" varchar
   );

   ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN IF NOT EXISTS "scene_app_screen_raw_image_id" integer;
   ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN IF NOT EXISTS "scene_app_screen_render_image_id" integer;
   ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN IF NOT EXISTS "scene_app_screen_brief_text" varchar;
   ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN IF NOT EXISTS "scene_app_screen_caption" varchar;
   ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN IF NOT EXISTS "scene_app_screen_hashtags" varchar;
   ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN IF NOT EXISTS "scene_app_screen_publish_meta" varchar;

   DO $b1$ BEGIN
     ALTER TABLE "cap_app_chps" ADD CONSTRAINT "cap_app_chps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null;
   END $b1$;

   DO $b2$ BEGIN
     ALTER TABLE "cap_app_meta" ADD CONSTRAINT "cap_app_meta_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null;
   END $b2$;

   CREATE INDEX IF NOT EXISTS "cap_app_chps_order_idx" ON "cap_app_chps" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "cap_app_chps_parent_id_idx" ON "cap_app_chps" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "cap_app_chps_locale_idx" ON "cap_app_chps" USING btree ("_locale");
   CREATE INDEX IF NOT EXISTS "cap_app_meta_order_idx" ON "cap_app_meta" USING btree ("_order");
   CREATE INDEX IF NOT EXISTS "cap_app_meta_parent_id_idx" ON "cap_app_meta" USING btree ("_parent_id");
   CREATE INDEX IF NOT EXISTS "cap_app_meta_locale_idx" ON "cap_app_meta" USING btree ("_locale");

   DO $b3$ BEGIN
     ALTER TABLE "site_homepage_capabilities_items" ADD CONSTRAINT "site_homepage_capabilities_items_scene_app_screen_raw_image_id_media_id_fk" FOREIGN KEY ("scene_app_screen_raw_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null;
   END $b3$;

   DO $b4$ BEGIN
     ALTER TABLE "site_homepage_capabilities_items" ADD CONSTRAINT "site_homepage_capabilities_items_scene_app_screen_render_image_id_media_id_fk" FOREIGN KEY ("scene_app_screen_render_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
   EXCEPTION WHEN duplicate_object THEN null;
   END $b4$;

   CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_app_screen_scene__idx" ON "site_homepage_capabilities_items" USING btree ("scene_app_screen_raw_image_id");
   CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_app_screen_scen_1_idx" ON "site_homepage_capabilities_items" USING btree ("scene_app_screen_render_image_id");
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cap_app_chps" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cap_app_meta" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cap_app_chps" CASCADE;
  DROP TABLE "cap_app_meta" CASCADE;
  ALTER TABLE "site_homepage_capabilities_items" DROP CONSTRAINT "site_homepage_capabilities_items_scene_app_screen_raw_image_id_media_id_fk";
  ALTER TABLE "site_homepage_capabilities_items" DROP CONSTRAINT "site_homepage_capabilities_items_scene_app_screen_render_image_id_media_id_fk";
  DROP INDEX "site_homepage_capabilities_items_scene_app_screen_scene__idx";
  DROP INDEX "site_homepage_capabilities_items_scene_app_screen_scen_1_idx";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_app_screen_raw_image_id";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_app_screen_render_image_id";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_app_screen_brief_text";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_app_screen_caption";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_app_screen_hashtags";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_app_screen_publish_meta";`);
}
