import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // IF EXISTS guards: dev-mode may have already applied these changes
  await db.execute(sql`
  DROP TABLE IF EXISTS "site_homepage_how_it_works_steps_side" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_how_it_works_steps" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_how_it_works_steps_locales" CASCADE;
  ALTER TABLE "site_homepage" ALTER COLUMN "closing_cta_href" DROP NOT NULL;
  ALTER TABLE "site_homepage_locales" ALTER COLUMN "closing_statement_line1" DROP NOT NULL;
  ALTER TABLE "site_homepage_locales" ALTER COLUMN "closing_cta_label" DROP NOT NULL;
  ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "how_it_works_eyebrow";
  ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "how_it_works_h2_line1";
  ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "how_it_works_h2_line2_soft";`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_homepage_how_it_works_steps_side" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE "site_homepage_how_it_works_steps" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "site_homepage_how_it_works_steps_locales" (
  	"label" varchar NOT NULL,
  	"meta" varchar,
  	"title" varchar NOT NULL,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "site_homepage" ALTER COLUMN "closing_cta_href" SET NOT NULL;
  ALTER TABLE "site_homepage_locales" ALTER COLUMN "closing_statement_line1" SET NOT NULL;
  ALTER TABLE "site_homepage_locales" ALTER COLUMN "closing_cta_label" SET NOT NULL;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "how_it_works_eyebrow" varchar;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "how_it_works_h2_line1" varchar NOT NULL;
  ALTER TABLE "site_homepage_locales" ADD COLUMN "how_it_works_h2_line2_soft" varchar NOT NULL;
  ALTER TABLE "site_homepage_how_it_works_steps_side" ADD CONSTRAINT "site_homepage_how_it_works_steps_side_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_how_it_works_steps"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_homepage_how_it_works_steps" ADD CONSTRAINT "site_homepage_how_it_works_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_homepage_how_it_works_steps_locales" ADD CONSTRAINT "site_homepage_how_it_works_steps_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_how_it_works_steps"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "site_homepage_how_it_works_steps_side_order_idx" ON "site_homepage_how_it_works_steps_side" USING btree ("_order");
  CREATE INDEX "site_homepage_how_it_works_steps_side_parent_id_idx" ON "site_homepage_how_it_works_steps_side" USING btree ("_parent_id");
  CREATE INDEX "site_homepage_how_it_works_steps_side_locale_idx" ON "site_homepage_how_it_works_steps_side" USING btree ("_locale");
  CREATE INDEX "site_homepage_how_it_works_steps_order_idx" ON "site_homepage_how_it_works_steps" USING btree ("_order");
  CREATE INDEX "site_homepage_how_it_works_steps_parent_id_idx" ON "site_homepage_how_it_works_steps" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_homepage_how_it_works_steps_locales_locale_parent_id_un" ON "site_homepage_how_it_works_steps_locales" USING btree ("_locale","_parent_id");`);
}
