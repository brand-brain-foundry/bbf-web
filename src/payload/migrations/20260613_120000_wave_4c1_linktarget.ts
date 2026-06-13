import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * FASE 4.C.1 L1 — linkTarget polimórfico (D-NAV-8 Opción C, firma Zavala 2026-06-13).
 *
 * Agrega el destino agnóstico { routeKey (enum) | page (FK→pages) } a:
 *   - site_navigation_header_links           (headerLinks[])
 *   - site_navigation                        (headerCta group → header_cta_*)
 *   - site_navigation_footer_groups_links    (footerGroups[].links[])
 *
 * IDEMPOTENTE (L-BBF-259): el dev push (L-BBF-254 phantom risk) ya pudo crear estos
 * objetos. CREATE TYPE / ADD CONSTRAINT no soportan IF NOT EXISTS → guardas DO/pg_catalog.
 * Aditivo: href se RETIENE (@deprecated, expand-contract) → zero data risk.
 * Nombres EXACTOS verificados contra information_schema/pg_catalog del DB live.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    -- 1) Enum types routeKey (idénticos: 8 rutas canónicas = pathnames SSOT)
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_site_navigation_header_links_link_target_route_key') THEN
        CREATE TYPE "public"."enum_site_navigation_header_links_link_target_route_key" AS ENUM('/', '/cerebro-marca', '/metodo', '/casos', '/como-construir', '/hub-and-spoke', '/marca-cognitiva', '/contacto');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_site_navigation_header_cta_link_target_route_key') THEN
        CREATE TYPE "public"."enum_site_navigation_header_cta_link_target_route_key" AS ENUM('/', '/cerebro-marca', '/metodo', '/casos', '/como-construir', '/hub-and-spoke', '/marca-cognitiva', '/contacto');
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_site_navigation_footer_groups_links_link_target_route_key') THEN
        CREATE TYPE "public"."enum_site_navigation_footer_groups_links_link_target_route_key" AS ENUM('/', '/cerebro-marca', '/metodo', '/casos', '/como-construir', '/hub-and-spoke', '/marca-cognitiva', '/contacto');
      END IF;
    END $$;

    -- 2) Columns (aditivas, idempotentes)
    ALTER TABLE "public"."site_navigation_header_links"
      ADD COLUMN IF NOT EXISTS "link_target_route_key" "public"."enum_site_navigation_header_links_link_target_route_key",
      ADD COLUMN IF NOT EXISTS "link_target_page_id" integer;

    ALTER TABLE "public"."site_navigation"
      ADD COLUMN IF NOT EXISTS "header_cta_link_target_route_key" "public"."enum_site_navigation_header_cta_link_target_route_key",
      ADD COLUMN IF NOT EXISTS "header_cta_link_target_page_id" integer;

    ALTER TABLE "public"."site_navigation_footer_groups_links"
      ADD COLUMN IF NOT EXISTS "link_target_route_key" "public"."enum_site_navigation_footer_groups_links_link_target_route_key",
      ADD COLUMN IF NOT EXISTS "link_target_page_id" integer;

    -- 3) FK constraints page_id → pages.id (ON DELETE set null; guardas pg_constraint)
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_navigation_header_links_link_target_page_id_pages_id_fk') THEN
        ALTER TABLE "public"."site_navigation_header_links"
          ADD CONSTRAINT "site_navigation_header_links_link_target_page_id_pages_id_fk"
          FOREIGN KEY ("link_target_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_navigation_header_cta_link_target_page_id_pages_id_fk') THEN
        ALTER TABLE "public"."site_navigation"
          ADD CONSTRAINT "site_navigation_header_cta_link_target_page_id_pages_id_fk"
          FOREIGN KEY ("header_cta_link_target_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
      END IF;
      -- nota: nombre truncado a 63 chars por postgres (…pages_i)
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_navigation_footer_groups_links_link_target_page_id_pages_i') THEN
        ALTER TABLE "public"."site_navigation_footer_groups_links"
          ADD CONSTRAINT "site_navigation_footer_groups_links_link_target_page_id_pages_i"
          FOREIGN KEY ("link_target_page_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;

    -- 4) Indexes en page_id (idempotentes; nombres truncados verificados)
    CREATE INDEX IF NOT EXISTS "site_navigation_header_links_link_target_link_target_pag_idx"
      ON "public"."site_navigation_header_links" USING btree ("link_target_page_id");
    CREATE INDEX IF NOT EXISTS "site_navigation_header_cta_link_target_header_cta_link_t_idx"
      ON "public"."site_navigation" USING btree ("header_cta_link_target_page_id");
    CREATE INDEX IF NOT EXISTS "site_navigation_footer_groups_links_link_target_link_tar_idx"
      ON "public"."site_navigation_footer_groups_links" USING btree ("link_target_page_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP INDEX IF EXISTS "public"."site_navigation_header_links_link_target_link_target_pag_idx";
    DROP INDEX IF EXISTS "public"."site_navigation_header_cta_link_target_header_cta_link_t_idx";
    DROP INDEX IF EXISTS "public"."site_navigation_footer_groups_links_link_target_link_tar_idx";

    ALTER TABLE "public"."site_navigation_header_links" DROP CONSTRAINT IF EXISTS "site_navigation_header_links_link_target_page_id_pages_id_fk";
    ALTER TABLE "public"."site_navigation" DROP CONSTRAINT IF EXISTS "site_navigation_header_cta_link_target_page_id_pages_id_fk";
    ALTER TABLE "public"."site_navigation_footer_groups_links" DROP CONSTRAINT IF EXISTS "site_navigation_footer_groups_links_link_target_page_id_pages_i";

    ALTER TABLE "public"."site_navigation_header_links"
      DROP COLUMN IF EXISTS "link_target_route_key",
      DROP COLUMN IF EXISTS "link_target_page_id";
    ALTER TABLE "public"."site_navigation"
      DROP COLUMN IF EXISTS "header_cta_link_target_route_key",
      DROP COLUMN IF EXISTS "header_cta_link_target_page_id";
    ALTER TABLE "public"."site_navigation_footer_groups_links"
      DROP COLUMN IF EXISTS "link_target_route_key",
      DROP COLUMN IF EXISTS "link_target_page_id";

    DROP TYPE IF EXISTS "public"."enum_site_navigation_header_links_link_target_route_key";
    DROP TYPE IF EXISTS "public"."enum_site_navigation_header_cta_link_target_route_key";
    DROP TYPE IF EXISTS "public"."enum_site_navigation_footer_groups_links_link_target_route_key";
  `);
}
