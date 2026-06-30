import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // icon enum — dev-push may have already created it; guard with DO block
  await db.execute(sql`
    DO $$ BEGIN
      CREATE TYPE "public"."enum_mth_services_icon" AS ENUM('arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'chevronRight', 'chevronLeft', 'chevronDown', 'chevronUp', 'menu', 'close', 'externalLink', 'home', 'search', 'plus', 'minus', 'edit', 'trash', 'download', 'upload', 'share', 'copy', 'check', 'refresh', 'filter', 'checkCircle', 'error', 'warning', 'alert', 'info', 'loading', 'eye', 'eyeOff', 'mail', 'phone', 'message', 'send', 'bell', 'file', 'image', 'video', 'play', 'pause', 'bookOpen', 'calendar', 'clock', 'star', 'bookmark', 'link', 'user', 'users', 'settings', 'logout', 'login', 'globe', 'sparkles', 'zap', 'building', 'briefcase', 'target', 'layers', 'award', 'trending', 'heart');
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  // navigation header links route_key enum — DROP IF EXISTS for idempotency
  await db.execute(sql`
    ALTER TABLE "site_navigation_header_links" ALTER COLUMN "link_target_route_key" SET DATA TYPE text;
    DROP TYPE IF EXISTS "public"."enum_site_navigation_header_links_link_target_route_key";
    CREATE TYPE "public"."enum_site_navigation_header_links_link_target_route_key" AS ENUM('/', '/cerebro-marca', '/como-trabajamos', '/casos', '/contacto', '/quienes-somos', '/blog');
    ALTER TABLE "site_navigation_header_links" ALTER COLUMN "link_target_route_key" SET DATA TYPE "public"."enum_site_navigation_header_links_link_target_route_key" USING "link_target_route_key"::"public"."enum_site_navigation_header_links_link_target_route_key";
  `);

  // navigation footer groups links route_key enum
  await db.execute(sql`
    ALTER TABLE "site_navigation_footer_groups_links" ALTER COLUMN "link_target_route_key" SET DATA TYPE text;
    DROP TYPE IF EXISTS "public"."enum_site_navigation_footer_groups_links_link_target_route_key";
    CREATE TYPE "public"."enum_site_navigation_footer_groups_links_link_target_route_key" AS ENUM('/', '/cerebro-marca', '/como-trabajamos', '/casos', '/contacto', '/quienes-somos', '/blog');
    ALTER TABLE "site_navigation_footer_groups_links" ALTER COLUMN "link_target_route_key" SET DATA TYPE "public"."enum_site_navigation_footer_groups_links_link_target_route_key" USING "link_target_route_key"::"public"."enum_site_navigation_footer_groups_links_link_target_route_key";
  `);

  // navigation header cta route_key enum
  await db.execute(sql`
    ALTER TABLE "site_navigation" ALTER COLUMN "header_cta_link_target_route_key" SET DATA TYPE text;
    DROP TYPE IF EXISTS "public"."enum_site_navigation_header_cta_link_target_route_key";
    CREATE TYPE "public"."enum_site_navigation_header_cta_link_target_route_key" AS ENUM('/', '/cerebro-marca', '/como-trabajamos', '/casos', '/contacto', '/quienes-somos', '/blog');
    ALTER TABLE "site_navigation" ALTER COLUMN "header_cta_link_target_route_key" SET DATA TYPE "public"."enum_site_navigation_header_cta_link_target_route_key" USING "header_cta_link_target_route_key"::"public"."enum_site_navigation_header_cta_link_target_route_key";
  `);

  // method_cta_href default
  await db.execute(sql`
    ALTER TABLE "site_homepage" ALTER COLUMN "method_cta_href" SET DEFAULT '/como-trabajamos';
  `);

  // icon column — IF NOT EXISTS guard (dev-push may have already added it)
  await db.execute(sql`
    ALTER TABLE "mth_services" ADD COLUMN IF NOT EXISTS "icon" "enum_mth_services_icon";
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_navigation_header_links" ALTER COLUMN "link_target_route_key" SET DATA TYPE text;
    DROP TYPE IF EXISTS "public"."enum_site_navigation_header_links_link_target_route_key";
    CREATE TYPE "public"."enum_site_navigation_header_links_link_target_route_key" AS ENUM('/', '/cerebro-marca', '/metodo', '/casos', '/contacto', '/quienes-somos', '/blog');
    ALTER TABLE "site_navigation_header_links" ALTER COLUMN "link_target_route_key" SET DATA TYPE "public"."enum_site_navigation_header_links_link_target_route_key" USING "link_target_route_key"::"public"."enum_site_navigation_header_links_link_target_route_key";
    ALTER TABLE "site_navigation_footer_groups_links" ALTER COLUMN "link_target_route_key" SET DATA TYPE text;
    DROP TYPE IF EXISTS "public"."enum_site_navigation_footer_groups_links_link_target_route_key";
    CREATE TYPE "public"."enum_site_navigation_footer_groups_links_link_target_route_key" AS ENUM('/', '/cerebro-marca', '/metodo', '/casos', '/contacto', '/quienes-somos', '/blog');
    ALTER TABLE "site_navigation_footer_groups_links" ALTER COLUMN "link_target_route_key" SET DATA TYPE "public"."enum_site_navigation_footer_groups_links_link_target_route_key" USING "link_target_route_key"::"public"."enum_site_navigation_footer_groups_links_link_target_route_key";
    ALTER TABLE "site_navigation" ALTER COLUMN "header_cta_link_target_route_key" SET DATA TYPE text;
    DROP TYPE IF EXISTS "public"."enum_site_navigation_header_cta_link_target_route_key";
    CREATE TYPE "public"."enum_site_navigation_header_cta_link_target_route_key" AS ENUM('/', '/cerebro-marca', '/metodo', '/casos', '/contacto', '/quienes-somos', '/blog');
    ALTER TABLE "site_navigation" ALTER COLUMN "header_cta_link_target_route_key" SET DATA TYPE "public"."enum_site_navigation_header_cta_link_target_route_key" USING "header_cta_link_target_route_key"::"public"."enum_site_navigation_header_cta_link_target_route_key";
    ALTER TABLE "site_homepage" ALTER COLUMN "method_cta_href" SET DEFAULT '/metodo';
    ALTER TABLE "mth_services" DROP COLUMN IF EXISTS "icon";
    DROP TYPE IF EXISTS "public"."enum_mth_services_icon";
  `);
}
