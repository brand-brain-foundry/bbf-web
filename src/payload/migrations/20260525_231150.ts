import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_published_locale" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_site_navigation_header_links_sub_links_media_type" AS ENUM('none', 'image', 'video');
  CREATE TYPE "public"."enum_site_navigation_footer_groups_links_flag_variant" AS ENUM('default', 'accent', 'success', 'beta');
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "pages_locales" (
  	"title" varchar,
  	"slug" varchar,
  	"path" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__pages_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_pages_v_locales" (
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_path" varchar,
  	"version_meta_title" varchar,
  	"version_meta_description" varchar,
  	"version_meta_image_id" integer,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_navigation_header_links_sub_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar,
  	"media_type" "enum_site_navigation_header_links_sub_links_media_type" DEFAULT 'none',
  	"media_id" integer
  );
  
  CREATE TABLE "site_navigation_header_links_sub_links_locales" (
  	"label" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_navigation_footer_groups_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL,
  	"flag_variant" "enum_site_navigation_footer_groups_links_flag_variant" DEFAULT 'default'
  );
  
  CREATE TABLE "site_navigation_footer_groups_links_locales" (
  	"label" varchar NOT NULL,
  	"flag" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "site_navigation_footer_groups" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_navigation_footer_groups_locales" (
  	"group_title" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE IF EXISTS "navigation_main_children" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "navigation_main" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "navigation_footer_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "navigation_footer" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "navigation" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "site_navigation_footer_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE IF EXISTS "site_navigation_footer_links_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE IF EXISTS "navigation_main_children" CASCADE;
  DROP TABLE IF EXISTS "navigation_main" CASCADE;
  DROP TABLE IF EXISTS "navigation_footer_links" CASCADE;
  DROP TABLE IF EXISTS "navigation_footer" CASCADE;
  DROP TABLE IF EXISTS "navigation" CASCADE;
  DROP TABLE IF EXISTS "site_navigation_footer_links" CASCADE;
  DROP TABLE IF EXISTS "site_navigation_footer_links_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "pages_id" integer;
  ALTER TABLE "site_navigation_header_links" ADD COLUMN "has_sub_menu" boolean DEFAULT false;
  ALTER TABLE "pages" ADD CONSTRAINT "pages_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_locales" ADD CONSTRAINT "pages_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_version_parent_id_pages_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_locales" ADD CONSTRAINT "_pages_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation_header_links_sub_links" ADD CONSTRAINT "site_navigation_header_links_sub_links_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_navigation_header_links_sub_links" ADD CONSTRAINT "site_navigation_header_links_sub_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation_header_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation_header_links_sub_links_locales" ADD CONSTRAINT "site_navigation_header_links_sub_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation_header_links_sub_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation_footer_groups_links" ADD CONSTRAINT "site_navigation_footer_groups_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation_footer_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation_footer_groups_links_locales" ADD CONSTRAINT "site_navigation_footer_groups_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation_footer_groups_links"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation_footer_groups" ADD CONSTRAINT "site_navigation_footer_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_navigation_footer_groups_locales" ADD CONSTRAINT "site_navigation_footer_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation_footer_groups"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_parent_idx" ON "pages" USING btree ("parent_id");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "pages_slug_idx" ON "pages_locales" USING btree ("slug","_locale");
  CREATE INDEX "pages_path_idx" ON "pages_locales" USING btree ("path","_locale");
  CREATE INDEX "pages_meta_meta_image_idx" ON "pages_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "pages_locales_locale_parent_id_unique" ON "pages_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_parent_idx" ON "_pages_v" USING btree ("version_parent_id");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_snapshot_idx" ON "_pages_v" USING btree ("snapshot");
  CREATE INDEX "_pages_v_published_locale_idx" ON "_pages_v" USING btree ("published_locale");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "_pages_v_autosave_idx" ON "_pages_v" USING btree ("autosave");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v_locales" USING btree ("version_slug","_locale");
  CREATE INDEX "_pages_v_version_version_path_idx" ON "_pages_v_locales" USING btree ("version_path","_locale");
  CREATE INDEX "_pages_v_version_meta_version_meta_image_idx" ON "_pages_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_pages_v_locales_locale_parent_id_unique" ON "_pages_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_navigation_header_links_sub_links_order_idx" ON "site_navigation_header_links_sub_links" USING btree ("_order");
  CREATE INDEX "site_navigation_header_links_sub_links_parent_id_idx" ON "site_navigation_header_links_sub_links" USING btree ("_parent_id");
  CREATE INDEX "site_navigation_header_links_sub_links_media_idx" ON "site_navigation_header_links_sub_links" USING btree ("media_id");
  CREATE UNIQUE INDEX "site_navigation_header_links_sub_links_locales_locale_parent" ON "site_navigation_header_links_sub_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_navigation_footer_groups_links_order_idx" ON "site_navigation_footer_groups_links" USING btree ("_order");
  CREATE INDEX "site_navigation_footer_groups_links_parent_id_idx" ON "site_navigation_footer_groups_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_navigation_footer_groups_links_locales_locale_parent_id" ON "site_navigation_footer_groups_links_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_navigation_footer_groups_order_idx" ON "site_navigation_footer_groups" USING btree ("_order");
  CREATE INDEX "site_navigation_footer_groups_parent_id_idx" ON "site_navigation_footer_groups" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_navigation_footer_groups_locales_locale_parent_id_uniqu" ON "site_navigation_footer_groups_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "navigation_main_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_main" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_title" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"href" varchar NOT NULL
  );
  
  CREATE TABLE "site_navigation_footer_links_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "pages" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_navigation_header_links_sub_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_navigation_header_links_sub_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_navigation_footer_groups_links" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_navigation_footer_groups_links_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_navigation_footer_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_navigation_footer_groups_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "pages_locales" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "_pages_v_locales" CASCADE;
  DROP TABLE "site_navigation_header_links_sub_links" CASCADE;
  DROP TABLE "site_navigation_header_links_sub_links_locales" CASCADE;
  DROP TABLE "site_navigation_footer_groups_links" CASCADE;
  DROP TABLE "site_navigation_footer_groups_links_locales" CASCADE;
  DROP TABLE "site_navigation_footer_groups" CASCADE;
  DROP TABLE "site_navigation_footer_groups_locales" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_pages_fk";
  
  DROP INDEX "payload_locked_documents_rels_pages_id_idx";
  ALTER TABLE IF EXISTS "navigation_main_children" ADD CONSTRAINT "navigation_main_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE IF EXISTS "navigation_main" ADD CONSTRAINT "navigation_main_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE IF EXISTS "navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE IF EXISTS "navigation_footer" ADD CONSTRAINT "navigation_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE IF EXISTS "site_navigation_footer_links" ADD CONSTRAINT "site_navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE IF EXISTS "site_navigation_footer_links_locales" ADD CONSTRAINT "site_navigation_footer_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation_footer_links"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "navigation_main_children_order_idx" ON "navigation_main_children" USING btree ("_order");
  CREATE INDEX "navigation_main_children_parent_id_idx" ON "navigation_main_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_children_locale_idx" ON "navigation_main_children" USING btree ("_locale");
  CREATE INDEX "navigation_main_order_idx" ON "navigation_main" USING btree ("_order");
  CREATE INDEX "navigation_main_parent_id_idx" ON "navigation_main" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_locale_idx" ON "navigation_main" USING btree ("_locale");
  CREATE INDEX "navigation_footer_links_order_idx" ON "navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "navigation_footer_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_links_locale_idx" ON "navigation_footer_links" USING btree ("_locale");
  CREATE INDEX "navigation_footer_order_idx" ON "navigation_footer" USING btree ("_order");
  CREATE INDEX "navigation_footer_parent_id_idx" ON "navigation_footer" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_locale_idx" ON "navigation_footer" USING btree ("_locale");
  CREATE INDEX "site_navigation_footer_links_order_idx" ON "site_navigation_footer_links" USING btree ("_order");
  CREATE INDEX "site_navigation_footer_links_parent_id_idx" ON "site_navigation_footer_links" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_navigation_footer_links_locales_locale_parent_id_unique" ON "site_navigation_footer_links_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "pages_id";
  ALTER TABLE "site_navigation_header_links" DROP COLUMN "has_sub_menu";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum__pages_v_published_locale";
  DROP TYPE "public"."enum_site_navigation_header_links_sub_links_media_type";
  DROP TYPE "public"."enum_site_navigation_footer_groups_links_flag_variant";`)
}
