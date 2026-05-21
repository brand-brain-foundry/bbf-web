import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop old footerLinks tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."site_navigation_footer_links_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."site_navigation_footer_links" CASCADE;
  `);

  // Enum for flagVariant
  await db.execute(sql`
    CREATE TYPE "public"."enum_site_navigation_footer_groups_links_flag_variant"
      AS ENUM('default', 'accent', 'success', 'beta');
  `);

  // footerGroups parent table (parent: site_navigation.id = integer)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."site_navigation_footer_groups" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL
    );
  `);

  // footerGroups locales (groupTitle)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."site_navigation_footer_groups_locales" (
      "group_title" varchar NOT NULL,
      "id"          serial PRIMARY KEY NOT NULL,
      "_locale"     "_locales" NOT NULL,
      "_parent_id"  varchar NOT NULL
    );
  `);

  // footerGroups links (nested, parent: footer_groups.id = varchar)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."site_navigation_footer_groups_links" (
      "_order"       integer NOT NULL,
      "_parent_id"   varchar NOT NULL,
      "id"           varchar PRIMARY KEY NOT NULL,
      "href"         varchar NOT NULL,
      "flag_variant" "enum_site_navigation_footer_groups_links_flag_variant" DEFAULT 'default' NOT NULL
    );
  `);

  // footerGroups links locales (label + flag)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."site_navigation_footer_groups_links_locales" (
      "label"      varchar NOT NULL,
      "flag"       varchar,
      "id"         serial PRIMARY KEY NOT NULL,
      "_locale"    "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );
  `);

  // Foreign keys
  await db.execute(sql`
    ALTER TABLE "public"."site_navigation_footer_groups"
      ADD CONSTRAINT "site_navigation_footer_groups_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."site_navigation"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."site_navigation_footer_groups_locales"
      ADD CONSTRAINT "site_navigation_footer_groups_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."site_navigation_footer_groups"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."site_navigation_footer_groups_links"
      ADD CONSTRAINT "site_navigation_footer_groups_links_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."site_navigation_footer_groups"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."site_navigation_footer_groups_links_locales"
      ADD CONSTRAINT "site_navigation_footer_groups_links_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."site_navigation_footer_groups_links"("id")
      ON DELETE cascade ON UPDATE no action;
  `);

  // Indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "site_navigation_footer_groups_order_idx"
      ON "public"."site_navigation_footer_groups" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "site_navigation_footer_groups_parent_id_idx"
      ON "public"."site_navigation_footer_groups" USING btree ("_parent_id");

    CREATE UNIQUE INDEX IF NOT EXISTS "site_navigation_footer_groups_locales_locale_parent_id_unique"
      ON "public"."site_navigation_footer_groups_locales" USING btree ("_locale", "_parent_id");

    CREATE INDEX IF NOT EXISTS "site_navigation_footer_groups_links_order_idx"
      ON "public"."site_navigation_footer_groups_links" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "site_navigation_footer_groups_links_parent_id_idx"
      ON "public"."site_navigation_footer_groups_links" USING btree ("_parent_id");

    CREATE UNIQUE INDEX IF NOT EXISTS "site_navigation_footer_groups_links_locales_locale_parent_id_unique"
      ON "public"."site_navigation_footer_groups_links_locales" USING btree ("_locale", "_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."site_navigation_footer_groups_links_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."site_navigation_footer_groups_links" CASCADE;
    DROP TABLE IF EXISTS "public"."site_navigation_footer_groups_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."site_navigation_footer_groups" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_site_navigation_footer_groups_links_flag_variant";
  `);
}
