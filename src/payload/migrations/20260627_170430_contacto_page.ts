import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_contact_page_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_contact_page_steps_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cp_stage" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "cp_stage_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cp_role" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "cp_role_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "cp_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "cp_faq_locales" (
  	"question" varchar,
  	"answer" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_contact_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_contact_page_locales" (
  	"hero_heading" varchar,
  	"hero_subtitle" varchar,
  	"hero_lede" varchar,
  	"hero_anchor_phrase" varchar,
  	"steps_eyebrow" varchar,
  	"form_config_title" varchar,
  	"form_config_stage_label" varchar,
  	"form_config_role_label" varchar,
  	"form_config_message_placeholder" varchar,
  	"form_config_required_hint" varchar,
  	"form_config_submit_label" varchar,
  	"microcopy_success_title" varchar,
  	"microcopy_success_body" varchar,
  	"microcopy_other_channels_label" varchar,
  	"microcopy_other_channels_note" varchar,
  	"faq_heading" varchar,
  	"seo_meta_title" varchar,
  	"seo_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_contact_page_steps" ADD CONSTRAINT "site_contact_page_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_contact_page_steps_locales" ADD CONSTRAINT "site_contact_page_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_contact_page_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cp_stage" ADD CONSTRAINT "cp_stage_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cp_stage_locales" ADD CONSTRAINT "cp_stage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cp_stage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cp_role" ADD CONSTRAINT "cp_role_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cp_role_locales" ADD CONSTRAINT "cp_role_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cp_role"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cp_faq" ADD CONSTRAINT "cp_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_contact_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cp_faq_locales" ADD CONSTRAINT "cp_faq_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cp_faq"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_contact_page_locales" ADD CONSTRAINT "site_contact_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_contact_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_contact_page_steps_order_idx" ON "site_contact_page_steps" USING btree ("_order");
  CREATE INDEX "site_contact_page_steps_parent_id_idx" ON "site_contact_page_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_contact_page_steps_locales_locale_parent_id_unique" ON "site_contact_page_steps_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cp_stage_order_idx" ON "cp_stage" USING btree ("_order");
  CREATE INDEX "cp_stage_parent_id_idx" ON "cp_stage" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cp_stage_locales_locale_parent_id_unique" ON "cp_stage_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cp_role_order_idx" ON "cp_role" USING btree ("_order");
  CREATE INDEX "cp_role_parent_id_idx" ON "cp_role" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cp_role_locales_locale_parent_id_unique" ON "cp_role_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "cp_faq_order_idx" ON "cp_faq" USING btree ("_order");
  CREATE INDEX "cp_faq_parent_id_idx" ON "cp_faq" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cp_faq_locales_locale_parent_id_unique" ON "cp_faq_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "site_contact_page_locales_locale_parent_id_unique" ON "site_contact_page_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_contact_page_steps" CASCADE;
  DROP TABLE "site_contact_page_steps_locales" CASCADE;
  DROP TABLE "cp_stage" CASCADE;
  DROP TABLE "cp_stage_locales" CASCADE;
  DROP TABLE "cp_role" CASCADE;
  DROP TABLE "cp_role_locales" CASCADE;
  DROP TABLE "cp_faq" CASCADE;
  DROP TABLE "cp_faq_locales" CASCADE;
  DROP TABLE "site_contact_page" CASCADE;
  DROP TABLE "site_contact_page_locales" CASCADE;`)
}
