import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."cap_wa_who" AS ENUM('user', 'brain');
  CREATE TABLE "cap_wa_msgs" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"who" "cap_wa_who",
  	"text" varchar,
  	"time" varchar DEFAULT '23:04'
  );
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_chat_contact_name" varchar DEFAULT 'Brain';
  ALTER TABLE "site_homepage_capabilities_items_locales" ADD COLUMN "scene_wa_chat_footer" varchar;
  ALTER TABLE "cap_wa_msgs" ADD CONSTRAINT "cap_wa_msgs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cap_wa_msgs_order_idx" ON "cap_wa_msgs" USING btree ("_order");
  CREATE INDEX "cap_wa_msgs_parent_id_idx" ON "cap_wa_msgs" USING btree ("_parent_id");
  CREATE INDEX "cap_wa_msgs_locale_idx" ON "cap_wa_msgs" USING btree ("_locale");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "cap_wa_msgs" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "cap_wa_msgs" CASCADE;
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_chat_contact_name";
  ALTER TABLE "site_homepage_capabilities_items_locales" DROP COLUMN "scene_wa_chat_footer";
  DROP TYPE "public"."cap_wa_who";`);
}
