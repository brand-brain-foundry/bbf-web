import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    CREATE TYPE "public"."enum_site_navigation_header_cta_intent" AS ENUM('primary', 'secondary', 'outline');

    CREATE TABLE "site_identity" (
      "id" serial PRIMARY KEY NOT NULL,
      "site_name" varchar DEFAULT 'Brand Brain Foundry' NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE "site_identity_locales" (
      "tagline" varchar DEFAULT 'Piensa, y que trabaje tu marca.' NOT NULL,
      "short_description" varchar DEFAULT 'Foundry de cerebros de marca. Construimos sistemas de inteligencia de marca propios, propietarios y portables.' NOT NULL,
      "long_description" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE "site_navigation_header_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "href" varchar NOT NULL
    );

    CREATE TABLE "site_navigation_header_links_locales" (
      "label" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE "site_navigation_footer_links" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "href" varchar NOT NULL
    );

    CREATE TABLE "site_navigation_footer_links_locales" (
      "label" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE "site_navigation" (
      "id" serial PRIMARY KEY NOT NULL,
      "header_cta_href" varchar DEFAULT '/contacto' NOT NULL,
      "header_cta_intent" "enum_site_navigation_header_cta_intent" DEFAULT 'primary' NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    CREATE TABLE "site_navigation_locales" (
      "header_cta_label" varchar NOT NULL,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" integer NOT NULL
    );

    CREATE TABLE "site_contact" (
      "id" serial PRIMARY KEY NOT NULL,
      "primary_email" varchar DEFAULT 'contacto@brandbrainfoundry.com' NOT NULL,
      "fallback_email" varchar DEFAULT 'hola@brandbrainfoundry.com',
      "from_email" varchar DEFAULT 'web@brandbrainfoundry.com' NOT NULL,
      "updated_at" timestamp(3) with time zone,
      "created_at" timestamp(3) with time zone
    );

    ALTER TABLE "site_identity_locales" ADD CONSTRAINT "site_identity_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_identity"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_navigation_header_links" ADD CONSTRAINT "site_navigation_header_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_navigation_header_links_locales" ADD CONSTRAINT "site_navigation_header_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation_header_links"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_navigation_footer_links" ADD CONSTRAINT "site_navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_navigation_footer_links_locales" ADD CONSTRAINT "site_navigation_footer_links_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation_footer_links"("id") ON DELETE cascade ON UPDATE no action;
    ALTER TABLE "site_navigation_locales" ADD CONSTRAINT "site_navigation_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_navigation"("id") ON DELETE cascade ON UPDATE no action;

    CREATE UNIQUE INDEX "site_identity_locales_locale_parent_id_unique" ON "site_identity_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX "site_navigation_header_links_order_idx" ON "site_navigation_header_links" USING btree ("_order");
    CREATE INDEX "site_navigation_header_links_parent_id_idx" ON "site_navigation_header_links" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "site_navigation_header_links_locales_locale_parent_id_unique" ON "site_navigation_header_links_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX "site_navigation_footer_links_order_idx" ON "site_navigation_footer_links" USING btree ("_order");
    CREATE INDEX "site_navigation_footer_links_parent_id_idx" ON "site_navigation_footer_links" USING btree ("_parent_id");
    CREATE UNIQUE INDEX "site_navigation_footer_links_locales_locale_parent_id_unique" ON "site_navigation_footer_links_locales" USING btree ("_locale","_parent_id");
    CREATE UNIQUE INDEX "site_navigation_locales_locale_parent_id_unique" ON "site_navigation_locales" USING btree ("_locale","_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_identity_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "site_navigation_header_links" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "site_navigation_header_links_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "site_navigation_footer_links" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "site_navigation_footer_links_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "site_navigation" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "site_navigation_locales" DISABLE ROW LEVEL SECURITY;
    ALTER TABLE "site_contact" DISABLE ROW LEVEL SECURITY;
    DROP TABLE "site_identity" CASCADE;
    DROP TABLE "site_identity_locales" CASCADE;
    DROP TABLE "site_navigation_header_links" CASCADE;
    DROP TABLE "site_navigation_header_links_locales" CASCADE;
    DROP TABLE "site_navigation_footer_links" CASCADE;
    DROP TABLE "site_navigation_footer_links_locales" CASCADE;
    DROP TABLE "site_navigation" CASCADE;
    DROP TABLE "site_navigation_locales" CASCADE;
    DROP TABLE "site_contact" CASCADE;
    DROP TYPE "public"."enum_site_navigation_header_cta_intent";
  `);
}
