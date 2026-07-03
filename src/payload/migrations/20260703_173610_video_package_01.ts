import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_video_packages_in_language" AS ENUM('es', 'en');
  CREATE TABLE "video_packages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"primary_id" integer NOT NULL,
  	"fallback_id" integer NOT NULL,
  	"mobile_id" integer,
  	"poster_id" integer,
  	"duration" numeric,
  	"in_language" "enum_video_packages_in_language",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "video_packages_locales" (
  	"seo_name" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_homepage_hero_media_video_sources" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_homepage_case_study_video_sources" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "site_homepage_hero_media_video_sources" CASCADE;
  DROP TABLE "site_homepage_case_study_video_sources" CASCADE;
  ALTER TABLE "site_homepage" DROP CONSTRAINT "site_homepage_hero_media_video_poster_id_media_id_fk";
  
  ALTER TABLE "site_homepage" DROP CONSTRAINT "site_homepage_case_study_video_poster_id_media_id_fk";
  
  DROP INDEX "site_homepage_hero_media_hero_media_video_poster_idx";
  DROP INDEX "site_homepage_case_study_case_study_video_poster_idx";
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "video_packages_id" integer;
  ALTER TABLE "site_homepage" ADD COLUMN "hero_media_video_package_id" integer;
  ALTER TABLE "site_homepage" ADD COLUMN "case_study_video_package_id" integer;
  ALTER TABLE "video_packages" ADD CONSTRAINT "video_packages_primary_id_media_id_fk" FOREIGN KEY ("primary_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "video_packages" ADD CONSTRAINT "video_packages_fallback_id_media_id_fk" FOREIGN KEY ("fallback_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "video_packages" ADD CONSTRAINT "video_packages_mobile_id_media_id_fk" FOREIGN KEY ("mobile_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "video_packages" ADD CONSTRAINT "video_packages_poster_id_media_id_fk" FOREIGN KEY ("poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "video_packages_locales" ADD CONSTRAINT "video_packages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."video_packages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "video_packages_primary_idx" ON "video_packages" USING btree ("primary_id");
  CREATE INDEX "video_packages_fallback_idx" ON "video_packages" USING btree ("fallback_id");
  CREATE INDEX "video_packages_mobile_idx" ON "video_packages" USING btree ("mobile_id");
  CREATE INDEX "video_packages_poster_idx" ON "video_packages" USING btree ("poster_id");
  CREATE INDEX "video_packages_updated_at_idx" ON "video_packages" USING btree ("updated_at");
  CREATE INDEX "video_packages_created_at_idx" ON "video_packages" USING btree ("created_at");
  CREATE UNIQUE INDEX "video_packages_locales_locale_parent_id_unique" ON "video_packages_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_video_packages_fk" FOREIGN KEY ("video_packages_id") REFERENCES "public"."video_packages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_homepage" ADD CONSTRAINT "site_homepage_hero_media_video_package_id_video_packages_id_fk" FOREIGN KEY ("hero_media_video_package_id") REFERENCES "public"."video_packages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_homepage" ADD CONSTRAINT "site_homepage_case_study_video_package_id_video_packages_id_fk" FOREIGN KEY ("case_study_video_package_id") REFERENCES "public"."video_packages"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_video_packages_id_idx" ON "payload_locked_documents_rels" USING btree ("video_packages_id");
  CREATE INDEX "site_homepage_hero_media_hero_media_video_package_idx" ON "site_homepage" USING btree ("hero_media_video_package_id");
  CREATE INDEX "site_homepage_case_study_case_study_video_package_idx" ON "site_homepage" USING btree ("case_study_video_package_id");
  ALTER TABLE "site_homepage" DROP COLUMN "hero_media_video_poster_id";
  ALTER TABLE "site_homepage" DROP COLUMN "case_study_video_poster_id";
  DROP TYPE "public"."enum_site_homepage_hero_media_video_sources_type";
  DROP TYPE "public"."enum_site_homepage_case_study_video_sources_type";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_homepage_hero_media_video_sources_type" AS ENUM('webm-av1', 'webm-vp9', 'mp4-h264', 'mp4-h265', 'mp4-av1', 'mov');
  CREATE TYPE "public"."enum_site_homepage_case_study_video_sources_type" AS ENUM('webm-av1', 'webm-vp9', 'mp4-h264', 'mp4-h265', 'mp4-av1', 'mov');
  CREATE TABLE "site_homepage_hero_media_video_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src" varchar NOT NULL,
  	"type" "enum_site_homepage_hero_media_video_sources_type" NOT NULL
  );
  
  CREATE TABLE "site_homepage_case_study_video_sources" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"src" varchar NOT NULL,
  	"type" "enum_site_homepage_case_study_video_sources_type" NOT NULL
  );
  
  ALTER TABLE "video_packages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "video_packages_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "video_packages" CASCADE;
  DROP TABLE "video_packages_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_video_packages_fk";
  
  ALTER TABLE "site_homepage" DROP CONSTRAINT "site_homepage_hero_media_video_package_id_video_packages_id_fk";
  
  ALTER TABLE "site_homepage" DROP CONSTRAINT "site_homepage_case_study_video_package_id_video_packages_id_fk";
  
  DROP INDEX "payload_locked_documents_rels_video_packages_id_idx";
  DROP INDEX "site_homepage_hero_media_hero_media_video_package_idx";
  DROP INDEX "site_homepage_case_study_case_study_video_package_idx";
  ALTER TABLE "site_homepage" ADD COLUMN "hero_media_video_poster_id" integer;
  ALTER TABLE "site_homepage" ADD COLUMN "case_study_video_poster_id" integer;
  ALTER TABLE "site_homepage_hero_media_video_sources" ADD CONSTRAINT "site_homepage_hero_media_video_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_homepage_case_study_video_sources" ADD CONSTRAINT "site_homepage_case_study_video_sources_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_homepage_hero_media_video_sources_order_idx" ON "site_homepage_hero_media_video_sources" USING btree ("_order");
  CREATE INDEX "site_homepage_hero_media_video_sources_parent_id_idx" ON "site_homepage_hero_media_video_sources" USING btree ("_parent_id");
  CREATE INDEX "site_homepage_case_study_video_sources_order_idx" ON "site_homepage_case_study_video_sources" USING btree ("_order");
  CREATE INDEX "site_homepage_case_study_video_sources_parent_id_idx" ON "site_homepage_case_study_video_sources" USING btree ("_parent_id");
  ALTER TABLE "site_homepage" ADD CONSTRAINT "site_homepage_hero_media_video_poster_id_media_id_fk" FOREIGN KEY ("hero_media_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_homepage" ADD CONSTRAINT "site_homepage_case_study_video_poster_id_media_id_fk" FOREIGN KEY ("case_study_video_poster_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "site_homepage_hero_media_hero_media_video_poster_idx" ON "site_homepage" USING btree ("hero_media_video_poster_id");
  CREATE INDEX "site_homepage_case_study_case_study_video_poster_idx" ON "site_homepage" USING btree ("case_study_video_poster_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "video_packages_id";
  ALTER TABLE "site_homepage" DROP COLUMN "hero_media_video_package_id";
  ALTER TABLE "site_homepage" DROP COLUMN "case_study_video_package_id";
  DROP TYPE "public"."enum_video_packages_in_language";`)
}
