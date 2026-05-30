import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE IF NOT EXISTS "cap_hub_spokes" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "cap_hub_spokes_locales" (
  	"name" varchar NOT NULL,
  	"meta" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  ALTER TABLE "cap_hub_spokes" ADD CONSTRAINT "cap_hub_spokes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "cap_hub_spokes_locales" ADD CONSTRAINT "cap_hub_spokes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."cap_hub_spokes"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "cap_hub_spokes_order_idx" ON "cap_hub_spokes" USING btree ("_order");
  CREATE INDEX "cap_hub_spokes_parent_id_idx" ON "cap_hub_spokes" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "cap_hub_spokes_locales_locale_parent_id_unique" ON "cap_hub_spokes_locales" USING btree ("_locale","_parent_id");`);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "cap_hub_spokes" CASCADE;
  DROP TABLE "cap_hub_spokes_locales" CASCADE;`);
}
