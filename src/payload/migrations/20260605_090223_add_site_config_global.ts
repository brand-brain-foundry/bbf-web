import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_config_seo_default_locale" AS ENUM('es_SV', 'es', 'en_US');
  CREATE TABLE "site_config_schema_knows_about" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic" varchar
  );
  
  CREATE TABLE "site_config_schema_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "site_config" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"site_domain" varchar DEFAULT 'https://sivarbrains.com' NOT NULL,
  	"founder_name" varchar DEFAULT 'Christian Zavala',
  	"founder_url" varchar DEFAULT 'https://brandbrainfoundry.com',
  	"founder_linkedin" varchar DEFAULT '',
  	"producer_name" varchar DEFAULT 'Brand Brain Foundry',
  	"producer_url" varchar DEFAULT 'https://brandbrainfoundry.com',
  	"seo_default_locale" "enum_site_config_seo_default_locale" DEFAULT 'es_SV',
  	"seo_twitter_handle" varchar DEFAULT '',
  	"seo_og_image_path" varchar DEFAULT '/og-image.png',
  	"seo_theme_color" varchar DEFAULT '#0a0a0a',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_config_locales" (
  	"site_name" varchar DEFAULT 'Sivar Brains' NOT NULL,
  	"site_short_name" varchar DEFAULT 'Sivar Brains' NOT NULL,
  	"site_tagline" varchar DEFAULT 'Cerebros de marca operacionales' NOT NULL,
  	"site_description" varchar DEFAULT 'Sivar Brains construye cerebros de marca para empresas: contenido, conversación, soporte e integraciones operando como sistema. No hay urgencia. Hay método.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_config_schema_knows_about" ADD CONSTRAINT "site_config_schema_knows_about_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_schema_same_as" ADD CONSTRAINT "site_config_schema_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_config_locales" ADD CONSTRAINT "site_config_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_config"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_config_schema_knows_about_order_idx" ON "site_config_schema_knows_about" USING btree ("_order");
  CREATE INDEX "site_config_schema_knows_about_parent_id_idx" ON "site_config_schema_knows_about" USING btree ("_parent_id");
  CREATE INDEX "site_config_schema_same_as_order_idx" ON "site_config_schema_same_as" USING btree ("_order");
  CREATE INDEX "site_config_schema_same_as_parent_id_idx" ON "site_config_schema_same_as" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_config_locales_locale_parent_id_unique" ON "site_config_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_config_schema_knows_about" CASCADE;
  DROP TABLE "site_config_schema_same_as" CASCADE;
  DROP TABLE "site_config" CASCADE;
  DROP TABLE "site_config_locales" CASCADE;
  DROP TYPE "public"."enum_site_config_seo_default_locale";`)
}
