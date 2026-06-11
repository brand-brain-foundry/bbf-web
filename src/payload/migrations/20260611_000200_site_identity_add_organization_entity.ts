import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Migration: add organization_entity_id to site_identity (D-ALIGN-42 / C2 corrective).
 *
 * FASE 4.B.1.B.1 — adds FK from SiteIdentity global to Entities collection so the
 * admin has a single, explicit pointer to the canonical organization entity.
 *
 * UP:  ALTER TABLE site_identity ADD COLUMN organization_entity_id + FK + index
 * DOWN: DROP index + DROP FK + DROP COLUMN
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_identity"
      ADD COLUMN IF NOT EXISTS "organization_entity_id" integer;
  `);

  await db.execute(sql`
    ALTER TABLE "site_identity"
      ADD CONSTRAINT "site_identity_organization_entity_id_fk"
      FOREIGN KEY ("organization_entity_id")
      REFERENCES "public"."entities"("id")
      ON DELETE set null ON UPDATE no action;
  `);

  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "site_identity_organization_entity_id_idx"
      ON "site_identity" USING btree ("organization_entity_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "site_identity_organization_entity_id_idx";
  `);

  await db.execute(sql`
    ALTER TABLE "site_identity"
      DROP CONSTRAINT IF EXISTS "site_identity_organization_entity_id_fk";
  `);

  await db.execute(sql`
    ALTER TABLE "site_identity"
      DROP COLUMN IF EXISTS "organization_entity_id";
  `);
}
