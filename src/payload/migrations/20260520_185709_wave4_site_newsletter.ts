import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "site_newsletter" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_newsletter_locales" (
  	"title" varchar DEFAULT 'Cerebros de marca, cada quince días.' NOT NULL,
  	"description" varchar DEFAULT 'Pensamiento aplicado sobre construcción de marca, sistemas e inteligencia. Sin ruido. Sin spam.' NOT NULL,
  	"email_placeholder" varchar DEFAULT 'tu@email.com',
  	"submit_label" varchar DEFAULT 'Suscribirme' NOT NULL,
  	"submitting_label" varchar DEFAULT 'Enviando…',
  	"success_title" varchar DEFAULT 'Revisá tu email',
  	"success_message" varchar DEFAULT 'Te enviamos un link para confirmar tu suscripción. Si no lo ves, revisá spam.',
  	"privacy_note" varchar DEFAULT 'No compartimos tu email. Podés darte de baja cuando quieras.',
  	"confirmation_email_subject" varchar DEFAULT 'Confirmá tu suscripción a BBF Newsletter' NOT NULL,
  	"confirmation_email_body" varchar DEFAULT 'Hacé click en el link de abajo para confirmar tu suscripción. Sin esto, no te enviamos nada. Esa es nuestra promesa.' NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "site_newsletter_locales" ADD CONSTRAINT "site_newsletter_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_newsletter"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "site_newsletter_locales_locale_parent_id_unique" ON "site_newsletter_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "site_newsletter" CASCADE;
  DROP TABLE "site_newsletter_locales" CASCADE;`)
}
