import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * D-SLUG-CANON-01 — Paso 2/2: UPDATE nav records /metodo → /como-trabajamos.
 * Corre en transacción separada (después de que ADD VALUE se haya committeado).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    UPDATE site_navigation_header_links
    SET link_target_route_key = '/como-trabajamos'
    WHERE link_target_route_key = '/metodo';
  `);
  await db.execute(sql`
    UPDATE site_navigation_footer_groups_links
    SET link_target_route_key = '/como-trabajamos'
    WHERE link_target_route_key = '/metodo';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    UPDATE site_navigation_header_links
    SET link_target_route_key = '/metodo'
    WHERE link_target_route_key = '/como-trabajamos';
  `);
  await db.execute(sql`
    UPDATE site_navigation_footer_groups_links
    SET link_target_route_key = '/metodo'
    WHERE link_target_route_key = '/como-trabajamos';
  `);
}
