import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" ADD VALUE 'integraciones';
  CREATE TABLE "cap_int_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon_id" integer
  );
  
  CREATE TABLE "cap_int_items_locales" (
  	"name" varchar,
  	"category" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_integraciones_summary_title" varchar DEFAULT 'Conectando tu cerebro a todas tus fuentes';
  ALTER TABLE "cap_int_items" ADD CONSTRAINT "cap_int_items_icon_id_media_id_fk" FOREIGN KEY ("icon_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "cap_int_items" ADD CONSTRAINT "cap_int_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cap_int_items_locales" ADD CONSTRAINT "cap_int_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cap_int_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cap_int_items_order_idx" ON "cap_int_items" USING btree ("_order");
  CREATE INDEX "cap_int_items_parent_id_idx" ON "cap_int_items" USING btree ("_parent_id");
  CREATE INDEX "cap_int_items_icon_idx" ON "cap_int_items" USING btree ("icon_id");
  CREATE UNIQUE INDEX "cap_int_items_locales_locale_parent_id_unique" ON "cap_int_items_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cap_int_items" CASCADE;
  DROP TABLE "cap_int_items_locales" CASCADE;
  ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_homepage_capabilities_items_scene_kind";
  CREATE TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" AS ENUM('chat', 'wa-chat', 'pipeline', 'workflow', 'stack', 'media', 'app-screen', 'wa-agenda');
  ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_kind" SET DATA TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" USING "scene_kind"::"public"."enum_site_homepage_capabilities_items_scene_kind";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_integraciones_summary_title";`)
}
