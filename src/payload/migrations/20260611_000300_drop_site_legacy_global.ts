import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Migration: DROP site legacy global tables (D-ALIGN-43).
 *
 * FASE 4.B.1.B.1 — removes the `site` legacy global that duplicated
 * SiteIdentity (name, baseUrl, organizationEntity). Confirmed 0 code
 * consumers; SiteIdentity is the sole source of truth going forward.
 *
 * UP:  DROP site_locales + site (cascades FKs)
 * DOWN: recreate site + site_locales with original schema (empty — data
 *       was migrated to SiteIdentity in prior phases)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_locales" CASCADE;
  `);

  await db.execute(sql`
    DROP TABLE IF EXISTS "site" CASCADE;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site" (
      "id"                     serial PRIMARY KEY NOT NULL,
      "base_url"               varchar DEFAULT 'https://sivarbrains.com',
      "organization_entity_id" integer,
      "updated_at"             timestamp(3) with time zone DEFAULT now() NOT NULL,
      "created_at"             timestamp(3) with time zone DEFAULT now() NOT NULL
    );
  `);

  await db.execute(sql`
    ALTER TABLE "site"
      ADD CONSTRAINT "site_organization_entity_id_fk"
      FOREIGN KEY ("organization_entity_id")
      REFERENCES "public"."entities"("id")
      ON DELETE set null ON UPDATE no action;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_locales" (
      "name"        varchar,
      "description" varchar,
      "_locale"     "_locales" NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          serial PRIMARY KEY NOT NULL,
      CONSTRAINT "site_locales_locale_parent_id_unique" UNIQUE ("_locale", "_parent_id")
    );
  `);

  await db.execute(sql`
    ALTER TABLE "site_locales"
      ADD CONSTRAINT "site_locales_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."site"("id")
      ON DELETE cascade ON UPDATE no action;
  `);
}
