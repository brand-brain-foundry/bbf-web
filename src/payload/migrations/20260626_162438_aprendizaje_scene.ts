import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" ADD VALUE 'aprendizaje';
  CREATE TABLE "cap_apr_rpts" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cap_apr_rpts_locales" (
  	"key" varchar,
  	"value" varchar,
  	"data" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN "scene_aprendizaje_post_image_id" integer;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_aprendizaje_insights_title" varchar DEFAULT 'Análisis del post';
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_aprendizaje_post_caption" varchar;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_aprendizaje_platform_label" varchar DEFAULT 'Instagram · Historia';
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_aprendizaje_time_label" varchar DEFAULT 'Publicado hace 3 días';
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_aprendizaje_projection" varchar;
  ALTER TABLE "cap_apr_rpts" ADD CONSTRAINT "cap_apr_rpts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cap_apr_rpts_locales" ADD CONSTRAINT "cap_apr_rpts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cap_apr_rpts"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cap_apr_rpts_order_idx" ON "cap_apr_rpts" USING btree ("_order");
  CREATE INDEX "cap_apr_rpts_parent_id_idx" ON "cap_apr_rpts" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cap_apr_rpts_locales_locale_parent_id_unique" ON "cap_apr_rpts_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "site_homepage_capabilities_items" ADD CONSTRAINT "site_homepage_capabilities_items_scene_aprendizaje_post_image_id_media_id_fk" FOREIGN KEY ("scene_aprendizaje_post_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_homepage_capabilities_items_scene_aprendizaje_scene_idx" ON "site_homepage_capabilities_items" USING btree ("scene_aprendizaje_post_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cap_apr_rpts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "cap_apr_rpts_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cap_apr_rpts" CASCADE;
  DROP TABLE "cap_apr_rpts_locales" CASCADE;
  ALTER TABLE "site_homepage_capabilities_items" DROP CONSTRAINT "site_homepage_capabilities_items_scene_aprendizaje_post_image_id_media_id_fk";
  
  ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_homepage_capabilities_items_scene_kind";
  CREATE TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" AS ENUM('chat', 'wa-chat', 'pipeline', 'workflow', 'stack', 'media', 'app-screen', 'wa-agenda', 'integraciones');
  ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_kind" SET DATA TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" USING "scene_kind"::"public"."enum_site_homepage_capabilities_items_scene_kind";
  DROP INDEX "site_homepage_capabilities_items_scene_aprendizaje_scene_idx";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_aprendizaje_post_image_id";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_aprendizaje_insights_title";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_aprendizaje_post_caption";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_aprendizaje_platform_label";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_aprendizaje_time_label";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_aprendizaje_projection";`)
}
