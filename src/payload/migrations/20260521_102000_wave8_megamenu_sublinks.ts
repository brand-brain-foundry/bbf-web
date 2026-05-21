import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_site_navigation_header_links_sub_links_media_type"
      AS ENUM('none', 'image', 'video');

    ALTER TABLE "public"."site_navigation_header_links"
      ADD COLUMN IF NOT EXISTS "has_sub_menu" boolean DEFAULT false;

    CREATE TABLE IF NOT EXISTS "public"."site_navigation_header_links_sub_links" (
      "_order"    integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "href"      varchar NOT NULL,
      "media_type" "enum_site_navigation_header_links_sub_links_media_type" DEFAULT 'none' NOT NULL,
      "media_id"  integer
    );

    CREATE TABLE IF NOT EXISTS "public"."site_navigation_header_links_sub_links_locales" (
      "label"       varchar NOT NULL,
      "description" varchar,
      "id"          serial PRIMARY KEY NOT NULL,
      "_locale"     "_locales" NOT NULL,
      "_parent_id"  varchar NOT NULL
    );

    ALTER TABLE "public"."site_navigation_header_links_sub_links"
      ADD CONSTRAINT "site_navigation_header_links_sub_links_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."site_navigation_header_links"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."site_navigation_header_links_sub_links"
      ADD CONSTRAINT "site_navigation_header_links_sub_links_media_id_media_id_fk"
      FOREIGN KEY ("media_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "public"."site_navigation_header_links_sub_links_locales"
      ADD CONSTRAINT "site_navigation_header_links_sub_links_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."site_navigation_header_links_sub_links"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "site_navigation_header_links_sub_links_order_idx"
      ON "public"."site_navigation_header_links_sub_links" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "site_navigation_header_links_sub_links_parent_id_idx"
      ON "public"."site_navigation_header_links_sub_links" USING btree ("_parent_id");

    CREATE UNIQUE INDEX IF NOT EXISTS "site_navigation_header_links_sub_links_locales_locale_parent_id_unique"
      ON "public"."site_navigation_header_links_sub_links_locales"
      USING btree ("_locale", "_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."site_navigation_header_links_sub_links_locales";
    DROP TABLE IF EXISTS "public"."site_navigation_header_links_sub_links";
    DROP TYPE IF EXISTS "public"."enum_site_navigation_header_links_sub_links_media_type";
    ALTER TABLE "public"."site_navigation_header_links"
      DROP COLUMN IF EXISTS "has_sub_menu";
  `);
}
