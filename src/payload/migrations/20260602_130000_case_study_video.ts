import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // 1. videoPoster — upload FK en site_homepage
  await db.execute(sql`
    ALTER TABLE "site_homepage" ADD COLUMN IF NOT EXISTS "case_study_video_poster_id" integer;
  `);

  // 2. videoSources — array table
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "site_homepage_case_study_video_sources" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "src" varchar NOT NULL,
      "type" varchar NOT NULL
    );
  `);

  // 3. Foreign keys — DO block (L-BBF-205: idempotente)
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "site_homepage"
        ADD CONSTRAINT "site_homepage_case_study_video_poster_id_media_id_fk"
        FOREIGN KEY ("case_study_video_poster_id") REFERENCES "public"."media"("id")
        ON DELETE set null ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage_case_study_video_sources"
        ADD CONSTRAINT "site_homepage_case_study_video_sources_parent_id_fk"
        FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id")
        ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN null;
    END $$;
  `);

  // 4. Indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_video_sources_order_idx"
      ON "site_homepage_case_study_video_sources" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_case_study_video_sources_parent_id_idx"
      ON "site_homepage_case_study_video_sources" USING btree ("_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DROP TABLE IF EXISTS "site_homepage_case_study_video_sources" CASCADE;
    ALTER TABLE "site_homepage" DROP CONSTRAINT IF EXISTS "site_homepage_case_study_video_poster_id_media_id_fk";
    ALTER TABLE "site_homepage" DROP COLUMN IF EXISTS "case_study_video_poster_id";
  `);
}
