import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * FASE 4.C.1 L2 — drop del href legacy (contract de expand-contract, D-NAV-8).
 *
 * Una vez que los consumers resuelven el href vía linkTarget+getPathname (L2),
 * el href texto libre queda sin uso → se elimina en las 3 tablas top-level:
 *   - site_navigation_header_links.href
 *   - site_navigation.header_cta_href
 *   - site_navigation_footer_groups_links.href
 *
 * NO toca site_navigation_header_links_sub_links.href (subLinks = L3, D-NAV-9).
 * IDEMPOTENTE (DROP/ADD COLUMN IF [NOT] EXISTS). Data eliminada = solo el junk
 * '/memory' (link a remover en L6); linkTarget es la fuente desde L1.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "public"."site_navigation_header_links" DROP COLUMN IF EXISTS "href";
    ALTER TABLE "public"."site_navigation" DROP COLUMN IF EXISTS "header_cta_href";
    ALTER TABLE "public"."site_navigation_footer_groups_links" DROP COLUMN IF EXISTS "href";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "public"."site_navigation_header_links" ADD COLUMN IF NOT EXISTS "href" varchar;
    ALTER TABLE "public"."site_navigation" ADD COLUMN IF NOT EXISTS "header_cta_href" varchar;
    ALTER TABLE "public"."site_navigation_footer_groups_links" ADD COLUMN IF NOT EXISTS "href" varchar;
  `);
}
