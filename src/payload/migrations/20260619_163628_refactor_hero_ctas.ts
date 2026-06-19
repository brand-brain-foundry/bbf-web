import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // dev-push aplicó "href" en site_cta_library_items antes de esta migration (L-BBF-287).
  // Guards idempotentes (L-BBF-205): IF NOT EXISTS + EXCEPTION WHEN.

  // 1 — Tabla ctas[] del hero (no creada por dev-push)
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_homepage_hero_ctas" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "cta_key" varchar NOT NULL
    );
  `);

  // 2 — href en library (ya existe por dev-push — guard para no fallar de nuevo)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "site_cta_library_items" ADD COLUMN "href" varchar;
    EXCEPTION WHEN duplicate_column THEN null;
    END $$;
  `);

  // 3 — FK + indexes (solo si la tabla acaba de crearse o ya existía limpia)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "site_homepage_hero_ctas"
        ADD CONSTRAINT "site_homepage_hero_ctas_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS "site_homepage_hero_ctas_order_idx" ON "site_homepage_hero_ctas" USING btree ("_order");`,
  );
  await db.execute(
    sql`CREATE INDEX IF NOT EXISTS "site_homepage_hero_ctas_parent_id_idx" ON "site_homepage_hero_ctas" USING btree ("_parent_id");`,
  );

  // 4 — Drops de columnas legacy del Hero (IF EXISTS para idempotencia)
  await db.execute(sql`ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "hero_cta_primary_href";`);
  await db.execute(
    sql`ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "hero_cta_secondary_href";`,
  );
  await db.execute(sql`ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "hero_cta_primary_key";`);
  await db.execute(
    sql`ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "hero_cta_secondary_key";`,
  );
  await db.execute(
    sql`ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "hero_cta_primary_label";`,
  );
  await db.execute(
    sql`ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "hero_cta_secondary_label";`,
  );
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_homepage_hero_ctas" CASCADE;
  ALTER TABLE "site_homepage" ADD COLUMN "hero_cta_primary_href" varchar DEFAULT '#proceso' NOT NULL;
  ALTER TABLE "site_homepage" ADD COLUMN "hero_cta_secondary_href" varchar DEFAULT '#metodo' NOT NULL;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "hero_cta_primary_label" varchar NOT NULL;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "hero_cta_secondary_label" varchar NOT NULL;
  ALTER TABLE "site_cta_library_items" DROP COLUMN "href";`);
}
