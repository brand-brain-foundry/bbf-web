import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_navigation_header_links_sub_links_icon" AS ENUM('arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'chevronRight', 'chevronLeft', 'chevronDown', 'chevronUp', 'menu', 'close', 'externalLink', 'home', 'search', 'plus', 'minus', 'edit', 'trash', 'download', 'upload', 'share', 'copy', 'check', 'refresh', 'filter', 'checkCircle', 'error', 'warning', 'alert', 'info', 'loading', 'eye', 'eyeOff', 'mail', 'phone', 'message', 'send', 'bell', 'file', 'image', 'video', 'play', 'pause', 'bookOpen', 'calendar', 'clock', 'star', 'bookmark', 'link', 'user', 'users', 'settings', 'logout', 'login', 'globe', 'sparkles', 'zap', 'building', 'briefcase', 'target', 'layers', 'award', 'trending', 'heart');
  ALTER TABLE "site_navigation_header_links_sub_links" ADD COLUMN "icon" "enum_site_navigation_header_links_sub_links_icon";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_navigation_header_links_sub_links" DROP COLUMN "icon";
  DROP TYPE "public"."enum_site_navigation_header_links_sub_links_icon";`)
}
