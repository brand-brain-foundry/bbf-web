import type { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres';
import { sql } from '@payloadcms/db-postgres';

// D-ALIGN-44 + D-ALIGN-45: drop dead tables that backed schemaKnowsAbout and schemaSameAs.
// schemaKnowsAbout is now read from Entity.organization.knowsAbout (D-ALIGN-45).
// sameAs was already migrated to Entity in D-ALIGN-41.
// Verified pre-migration: site_identity_rels has 5 rows ALL path='schemaKnowsAbout' → exclusive.
// site_identity_schema_same_as has 3 rows → all dead data post D-ALIGN-41.

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`DROP TABLE IF EXISTS site_identity_rels CASCADE`);
  await db.execute(sql`DROP TABLE IF EXISTS site_identity_schema_same_as CASCADE`);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Recreate site_identity_rels (backed schemaKnowsAbout hasMany relationship)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS site_identity_rels (
      id serial PRIMARY KEY,
      "order" integer,
      parent_id integer NOT NULL,
      path text NOT NULL,
      topics_id integer
    )
  `);
  // Recreate site_identity_schema_same_as (backed schemaSameAs array)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS site_identity_schema_same_as (
      id serial PRIMARY KEY,
      "order" integer,
      parent_id integer NOT NULL,
      url text
    )
  `);
}
