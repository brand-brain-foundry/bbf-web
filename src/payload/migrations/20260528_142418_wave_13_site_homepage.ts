import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_identity_status_banner_dot_color" AS ENUM('active', 'red', 'warning');
  CREATE TYPE "public"."enum_site_homepage_hero_media_video_sources_type" AS ENUM('webm-av1', 'webm-vp9', 'mp4-h264', 'mp4-h265', 'mp4-av1', 'mov');
  CREATE TABLE "site_homepage_hero_media_video_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src" varchar NOT NULL,
  	"type" "enum_site_homepage_hero_media_video_sources_type" NOT NULL
  );
  
  CREATE TABLE "site_homepage_hero_ticker" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"item" varchar NOT NULL
  );
  
  CREATE TABLE "site_homepage" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_cta_primary_href" varchar DEFAULT '#proceso' NOT NULL,
  	"hero_cta_secondary_href" varchar DEFAULT '#metodo' NOT NULL,
  	"hero_media_chrome_label" varchar DEFAULT '// brand-brain.foundry · live feed',
  	"hero_media_video_poster_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_homepage_locales" (
  	"hero_h1_line1" varchar DEFAULT 'Tú diriges.' NOT NULL,
  	"hero_h1_line2_soft" varchar DEFAULT 'Tu marca ejecuta.' NOT NULL,
  	"hero_lede_body" varchar NOT NULL,
  	"hero_lede_emphasis" varchar NOT NULL,
  	"hero_cta_primary_label" varchar NOT NULL,
  	"hero_cta_secondary_label" varchar NOT NULL,
  	"hero_media_demo_label" varchar DEFAULT 'Demostración' NOT NULL,
  	"hero_media_foot_caption" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_identity" ADD COLUMN "status_banner_enabled" boolean DEFAULT true;
  ALTER TABLE "site_identity" ADD COLUMN "status_banner_href" varchar;
  ALTER TABLE "site_identity" ADD COLUMN "status_banner_dot_color" "enum_site_identity_status_banner_dot_color" DEFAULT 'active';
  ALTER TABLE "site_identity_locales" ADD COLUMN "status_banner_label" varchar DEFAULT 'Cerebro activo · Sivar Brains';
  ALTER TABLE "site_homepage_hero_media_video_sources" ADD CONSTRAINT "site_homepage_hero_media_video_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_homepage_hero_ticker" ADD CONSTRAINT "site_homepage_hero_ticker_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_homepage" ADD CONSTRAINT "site_homepage_hero_media_video_poster_id_media_id_fk" FOREIGN KEY ("hero_media_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_homepage_locales" ADD CONSTRAINT "site_homepage_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_homepage_hero_media_video_sources_order_idx" ON "site_homepage_hero_media_video_sources" USING btree ("_order");
  CREATE INDEX "site_homepage_hero_media_video_sources_parent_id_idx" ON "site_homepage_hero_media_video_sources" USING btree ("_parent_id");
  CREATE INDEX "site_homepage_hero_ticker_order_idx" ON "site_homepage_hero_ticker" USING btree ("_order");
  CREATE INDEX "site_homepage_hero_ticker_parent_id_idx" ON "site_homepage_hero_ticker" USING btree ("_parent_id");
  CREATE INDEX "site_homepage_hero_ticker_locale_idx" ON "site_homepage_hero_ticker" USING btree ("_locale");
  CREATE INDEX "site_homepage_hero_media_hero_media_video_poster_idx" ON "site_homepage" USING btree ("hero_media_video_poster_id");
  CREATE UNIQUE INDEX "site_homepage_locales_locale_parent_id_unique" ON "site_homepage_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_homepage_hero_media_video_sources" CASCADE;
  DROP TABLE "site_homepage_hero_ticker" CASCADE;
  DROP TABLE "site_homepage" CASCADE;
  DROP TABLE "site_homepage_locales" CASCADE;
  ALTER TABLE "site_identity" DROP COLUMN "status_banner_enabled";
  ALTER TABLE "site_identity" DROP COLUMN "status_banner_href";
  ALTER TABLE "site_identity" DROP COLUMN "status_banner_dot_color";
  ALTER TABLE "site_identity_locales" DROP COLUMN "status_banner_label";
  DROP TYPE "public"."enum_site_identity_status_banner_dot_color";
  DROP TYPE "public"."enum_site_homepage_hero_media_video_sources_type";`)
}
