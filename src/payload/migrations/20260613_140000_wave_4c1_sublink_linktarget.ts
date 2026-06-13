import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * FASE 4.C.1 L3 — subLink linkTarget polimórfico (D-NAV-9) + drop href legacy.
 *
 * Tabla site_navigation_header_links_sub_links:
 *   + link_target_page_id  (FK→pages, set null)  → página HIJA (D-NAV-9)
 *   + link_target_external (varchar)             → URL externa cruda (escape hatch)
 *   - href                                        → eliminado (expand-contract; 0 subLinks en DB)
 *
 * Anchors de sección DIFERIDOS a 4.C.3 (Pages sin modelo de secciones hoy).
 * IDEMPOTENTE. Nombres EXACTOS (truncados a 63 chars) verificados contra pg_catalog del DB live.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "public"."site_navigation_header_links_sub_links"
      ADD COLUMN IF NOT EXISTS "link_target_page_id" integer,
      ADD COLUMN IF NOT EXISTS "link_target_external" varchar;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_navigation_header_links_sub_links_link_target_page_id_page') THEN
        ALTER TABLE "public"."site_navigation_header_links_sub_links"
          ADD CONSTRAINT "site_navigation_header_links_sub_links_link_target_page_id_page"
          FOREIGN KEY ("link_target_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_navigation_header_links_sub_links_link_target_link__idx"
      ON "public"."site_navigation_header_links_sub_links" USING btree ("link_target_page_id");

    ALTER TABLE "public"."site_navigation_header_links_sub_links" DROP COLUMN IF EXISTS "href";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "public"."site_navigation_header_links_sub_links" ADD COLUMN IF NOT EXISTS "href" varchar;

    DROP INDEX IF EXISTS "public"."site_navigation_header_links_sub_links_link_target_link__idx";
    ALTER TABLE "public"."site_navigation_header_links_sub_links"
      DROP CONSTRAINT IF EXISTS "site_navigation_header_links_sub_links_link_target_page_id_page";
    ALTER TABLE "public"."site_navigation_header_links_sub_links"
      DROP COLUMN IF EXISTS "link_target_page_id",
      DROP COLUMN IF EXISTS "link_target_external";
  `);
}
