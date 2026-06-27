import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" ADD VALUE 'wa-agenda';
  CREATE TABLE "cap_wag_inv" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"email" varchar
  );
  
  CREATE TABLE "cap_wag_qr" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cap_wag_qr_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN "scene_wa_agenda_meet_card_time" varchar;
  ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN "scene_wa_agenda_meet_card_timezone" varchar DEFAULT 'GMT-6';
  ALTER TABLE "site_homepage_capabilities_items" ADD COLUMN "scene_wa_agenda_meet_card_link" varchar;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_agenda_contact_name" varchar DEFAULT 'Brain';
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_agenda_brief_text" varchar;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_agenda_confirm_text" varchar;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_agenda_invite_sent_text" varchar;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_agenda_ask_text" varchar;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_agenda_closing_text" varchar;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_agenda_meet_card_title" varchar;
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_agenda_meet_card_day" varchar;
  ALTER TABLE "cap_wag_inv" ADD CONSTRAINT "cap_wag_inv_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cap_wag_qr" ADD CONSTRAINT "cap_wag_qr_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cap_wag_qr_locales" ADD CONSTRAINT "cap_wag_qr_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cap_wag_qr"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cap_wag_inv_order_idx" ON "cap_wag_inv" USING btree ("_order");
  CREATE INDEX "cap_wag_inv_parent_id_idx" ON "cap_wag_inv" USING btree ("_parent_id");
  CREATE INDEX "cap_wag_qr_order_idx" ON "cap_wag_qr" USING btree ("_order");
  CREATE INDEX "cap_wag_qr_parent_id_idx" ON "cap_wag_qr" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cap_wag_qr_locales_locale_parent_id_unique" ON "cap_wag_qr_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cap_wag_inv" CASCADE;
  DROP TABLE "cap_wag_qr" CASCADE;
  DROP TABLE "cap_wag_qr_locales" CASCADE;
  ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_kind" SET DATA TYPE text;
  DROP TYPE "public"."enum_site_homepage_capabilities_items_scene_kind";
  CREATE TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" AS ENUM('chat', 'wa-chat', 'pipeline', 'workflow', 'stack', 'media', 'app-screen');
  ALTER TABLE "site_homepage_capabilities_items" ALTER COLUMN "scene_kind" SET DATA TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" USING "scene_kind"::"public"."enum_site_homepage_capabilities_items_scene_kind";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_wa_agenda_meet_card_time";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_wa_agenda_meet_card_timezone";
  ALTER TABLE "site_homepage_capabilities_items" DROP COLUMN "scene_wa_agenda_meet_card_link";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_agenda_contact_name";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_agenda_brief_text";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_agenda_confirm_text";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_agenda_invite_sent_text";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_agenda_ask_text";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_agenda_closing_text";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_agenda_meet_card_title";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_agenda_meet_card_day";`)
}
