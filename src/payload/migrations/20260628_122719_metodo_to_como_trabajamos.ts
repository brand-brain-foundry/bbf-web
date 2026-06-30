import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * D-SLUG-CANON-01 — Paso 1/2: ADD VALUE '/como-trabajamos' a los enum tipos de routeKey.
 * Postgres no permite usar un enum recién añadido en la misma transacción.
 * El UPDATE de records va en la migración siguiente (paso 2/2).
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TYPE "public"."enum_site_navigation_header_links_link_target_route_key"
    ADD VALUE IF NOT EXISTS '/como-trabajamos';
  `);
  await db.execute(sql`
    ALTER TYPE "public"."enum_site_navigation_header_cta_link_target_route_key"
    ADD VALUE IF NOT EXISTS '/como-trabajamos';
  `);
  await db.execute(sql`
    ALTER TYPE "public"."enum_site_navigation_footer_groups_links_link_target_route_key"
    ADD VALUE IF NOT EXISTS '/como-trabajamos';
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Postgres no soporta DROP VALUE de enum — no-op intencional.
  // El rollback real se hace en el paso 2/2 que revierte los registros.
}
