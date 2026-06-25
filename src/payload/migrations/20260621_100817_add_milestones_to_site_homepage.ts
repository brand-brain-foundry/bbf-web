import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_homepage_case_study_milestones_icon" AS ENUM('arrowRight', 'arrowLeft', 'arrowUp', 'arrowDown', 'chevronRight', 'chevronLeft', 'chevronDown', 'chevronUp', 'menu', 'close', 'externalLink', 'home', 'search', 'plus', 'minus', 'edit', 'trash', 'download', 'upload', 'share', 'copy', 'check', 'refresh', 'filter', 'checkCircle', 'error', 'warning', 'alert', 'info', 'loading', 'eye', 'eyeOff', 'mail', 'phone', 'message', 'send', 'bell', 'file', 'image', 'video', 'play', 'pause', 'bookOpen', 'calendar', 'clock', 'star', 'bookmark', 'link', 'user', 'users', 'settings', 'logout', 'login', 'globe', 'sparkles', 'zap', 'building', 'briefcase', 'target', 'layers', 'award', 'trending', 'heart');
  CREATE TYPE "public"."enum_site_homepage_case_study_milestones_status" AS ENUM('active', 'demo', 'next');
  CREATE TABLE "site_homepage_case_study_milestones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_site_homepage_case_study_milestones_icon",
  	"status" "enum_site_homepage_case_study_milestones_status" DEFAULT 'next' NOT NULL
  );
  
  CREATE TABLE "site_homepage_case_study_milestones_locales" (
  	"title" varchar NOT NULL,
  	"note" varchar NOT NULL,
  	"status_label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_homepage_locales" ADD COLUMN "case_study_timeline_attribution" varchar;
  ALTER TABLE "site_homepage_case_study_milestones" ADD CONSTRAINT "site_homepage_case_study_milestones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_homepage_case_study_milestones_locales" ADD CONSTRAINT "site_homepage_case_study_milestones_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_case_study_milestones"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_homepage_case_study_milestones_order_idx" ON "site_homepage_case_study_milestones" USING btree ("_order");
  CREATE INDEX "site_homepage_case_study_milestones_parent_id_idx" ON "site_homepage_case_study_milestones" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_homepage_case_study_milestones_locales_locale_parent_id" ON "site_homepage_case_study_milestones_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_homepage_case_study_milestones" CASCADE;
  DROP TABLE "site_homepage_case_study_milestones_locales" CASCADE;
  ALTER TABLE "site_homepage_locales" DROP COLUMN "case_study_timeline_attribution";
  DROP TYPE "public"."enum_site_homepage_case_study_milestones_icon";
  DROP TYPE "public"."enum_site_homepage_case_study_milestones_status";`)
}
