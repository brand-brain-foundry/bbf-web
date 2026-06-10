import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Migration: schemaKnowsAbout array-text → relationship hasMany Topics (D-ALIGN-40).
 *
 * FASE 4.B.1.A.1 — eliminates duplication between SiteIdentity text array
 * and Topics collection. Single source of truth: Topics.
 *
 * UP:
 *   1. Drop site_identity_schema_knows_about (legacy text array table)
 *   2. Create site_identity_rels (Payload v3 relationship join table for globals)
 *
 * DOWN:
 *   1. Drop site_identity_rels
 *   2. Recreate site_identity_schema_knows_about (empty — data re-seeded from Topics)
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Step 1: Drop legacy text-array table ──────────────────────────────────
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_identity_schema_knows_about" CASCADE;
  `);

  // ── Step 2: Create relationship join table ─────────────────────────────────
  // Mirrors entities_rels pattern (Payload v3 Drizzle adapter for hasMany globals).
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_identity_rels" (
      "id"        serial PRIMARY KEY NOT NULL,
      "order"     integer,
      "parent_id" integer NOT NULL,
      "path"      varchar NOT NULL,
      "topics_id" integer
    );
  `);

  // ── Step 3: FKs + indexes ──────────────────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "site_identity_rels"
      ADD CONSTRAINT "site_identity_rels_parent_fk"
      FOREIGN KEY ("parent_id") REFERENCES "public"."site_identity"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "site_identity_rels"
      ADD CONSTRAINT "site_identity_rels_topics_fk"
      FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id")
      ON DELETE cascade ON UPDATE no action;

    CREATE INDEX IF NOT EXISTS "site_identity_rels_order_idx"
      ON "site_identity_rels" USING btree ("order");
    CREATE INDEX IF NOT EXISTS "site_identity_rels_parent_idx"
      ON "site_identity_rels" USING btree ("parent_id");
    CREATE INDEX IF NOT EXISTS "site_identity_rels_path_idx"
      ON "site_identity_rels" USING btree ("path");
    CREATE INDEX IF NOT EXISTS "site_identity_rels_topics_id_idx"
      ON "site_identity_rels" USING btree ("topics_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore legacy text-array table (empty — data lives in Topics)
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_identity_rels" CASCADE;
  `);

  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_identity_schema_knows_about" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"          varchar PRIMARY KEY NOT NULL,
      "topic"       varchar
    );

    ALTER TABLE "site_identity_schema_knows_about"
      ADD CONSTRAINT "site_identity_schema_knows_about_parent_id_fk"
      FOREIGN KEY ("_parent_id") REFERENCES "public"."site_identity"("id")
      ON DELETE cascade ON UPDATE no action;
  `);
}
