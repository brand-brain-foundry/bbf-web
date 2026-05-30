import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_homepage_method_services_deliverables" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "site_homepage_method_services" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_homepage_method_services_locales" (
  	"name" varchar NOT NULL,
  	"range" varchar NOT NULL,
  	"commit" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_homepage" ADD COLUMN "method_cta_href" varchar DEFAULT '/metodo';
  ALTER TABLE "site_homepage_locales" ADD COLUMN "method_eyebrow" varchar;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "method_h2_line1" varchar DEFAULT 'Tres servicios coordinados.' NOT NULL;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "method_h2_line2_soft" varchar DEFAULT 'Sin sorpresas.' NOT NULL;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "method_quote_main" varchar DEFAULT 'No hay urgencia.';
  ALTER TABLE "site_homepage_locales" ADD COLUMN "method_quote_soft" varchar DEFAULT 'Hay método.';
  ALTER TABLE "site_homepage_locales" ADD COLUMN "method_quote_caption" varchar DEFAULT 'Canon BBF · 01';
  ALTER TABLE "site_homepage_locales" ADD COLUMN "method_cta_text" varchar DEFAULT 'Conocer el método completo';
  ALTER TABLE "site_homepage_method_services_deliverables" ADD CONSTRAINT "site_homepage_method_services_deliverables_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_method_services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_homepage_method_services" ADD CONSTRAINT "site_homepage_method_services_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_homepage_method_services_locales" ADD CONSTRAINT "site_homepage_method_services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_method_services"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_homepage_method_services_deliverables_order_idx" ON "site_homepage_method_services_deliverables" USING btree ("_order");
  CREATE INDEX "site_homepage_method_services_deliverables_parent_id_idx" ON "site_homepage_method_services_deliverables" USING btree ("_parent_id");
  CREATE INDEX "site_homepage_method_services_deliverables_locale_idx" ON "site_homepage_method_services_deliverables" USING btree ("_locale");
  CREATE INDEX "site_homepage_method_services_order_idx" ON "site_homepage_method_services" USING btree ("_order");
  CREATE INDEX "site_homepage_method_services_parent_id_idx" ON "site_homepage_method_services" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_homepage_method_services_locales_locale_parent_id_uniqu" ON "site_homepage_method_services_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_homepage_method_services_deliverables" CASCADE;
  DROP TABLE "site_homepage_method_services" CASCADE;
  DROP TABLE "site_homepage_method_services_locales" CASCADE;
  ALTER TABLE "site_homepage" DROP COLUMN "method_cta_href";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "method_eyebrow";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "method_h2_line1";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "method_h2_line2_soft";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "method_quote_main";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "method_quote_soft";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "method_quote_caption";
  ALTER TABLE "site_homepage_locales" DROP COLUMN "method_cta_text";`)
}
