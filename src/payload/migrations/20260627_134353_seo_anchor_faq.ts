import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "hp_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "hp_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_homepage_locales" ADD COLUMN "seo_anchor_phrase" varchar;
  ALTER TABLE "hp_faq" ADD CONSTRAINT "hp_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "hp_faq_locales" ADD CONSTRAINT "hp_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."hp_faq"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "hp_faq_order_idx" ON "hp_faq" USING btree ("_order");
  CREATE INDEX "hp_faq_parent_id_idx" ON "hp_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "hp_faq_locales_locale_parent_id_unique" ON "hp_faq_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "hp_faq" CASCADE;
  DROP TABLE "hp_faq_locales" CASCADE;
  ALTER TABLE "site_homepage_locales" DROP COLUMN "seo_anchor_phrase";`)
}
