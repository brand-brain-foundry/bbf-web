import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // L-BBF-205: IF NOT EXISTS guards — dev-mode auto-push may have already applied schema.
  await db.execute(sql`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_site_homepage_capabilities_items_scene_chat_messages_who') THEN
        CREATE TYPE "public"."enum_site_homepage_capabilities_items_scene_chat_messages_who" AS ENUM('user', 'brain');
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_cap_items_pipe_steps_state') THEN
        CREATE TYPE "public"."enum_cap_items_pipe_steps_state" AS ENUM('done', 'live', 'queue');
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_site_homepage_capabilities_items_scene_workflow_nodes_kind') THEN
        CREATE TYPE "public"."enum_site_homepage_capabilities_items_scene_workflow_nodes_kind" AS ENUM('in', 'step', 'branch', 'auto', 'human');
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_site_homepage_capabilities_items_scene_kind') THEN
        CREATE TYPE "public"."enum_site_homepage_capabilities_items_scene_kind" AS ENUM('chat', 'pipeline', 'workflow', 'stack');
      END IF;
    END $$;

    CREATE TABLE IF NOT EXISTS "site_homepage_capabilities_items_bullets" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "text" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "site_homepage_capabilities_items_scene_chat_messages" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "who" "enum_site_homepage_capabilities_items_scene_chat_messages_who",
      "text" varchar
    );

    CREATE TABLE IF NOT EXISTS "cap_items_pipe_steps" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar,
      "detail" varchar,
      "state" "enum_cap_items_pipe_steps_state"
    );

    CREATE TABLE IF NOT EXISTS "site_homepage_capabilities_items_scene_workflow_nodes" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "x" numeric,
      "y" numeric,
      "kind" "enum_site_homepage_capabilities_items_scene_workflow_nodes_kind"
    );

    CREATE TABLE IF NOT EXISTS "site_homepage_capabilities_items_scene_workflow_nodes_locales" (
      "label" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "site_homepage_capabilities_items_scene_workflow_edges" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "from" numeric,
      "to" numeric
    );

    CREATE TABLE IF NOT EXISTS "site_homepage_capabilities_items_scene_stack_groups_items" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "name" varchar
    );

    CREATE TABLE IF NOT EXISTS "site_homepage_capabilities_items_scene_stack_groups" (
      "_order" integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "_locale" "_locales" NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "label" varchar
    );

    CREATE TABLE IF NOT EXISTS "site_homepage_capabilities_items" (
      "_order" integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id" varchar PRIMARY KEY NOT NULL,
      "slug" varchar NOT NULL,
      "scene_kind" "enum_site_homepage_capabilities_items_scene_kind" NOT NULL
    );

    CREATE TABLE IF NOT EXISTS "site_homepage_capabilities_items_locales" (
      "title" varchar NOT NULL,
      "lede" varchar NOT NULL,
      "body" varchar NOT NULL,
      "example" varchar NOT NULL,
      "scene_meta" varchar NOT NULL,
      "scene_chat_footer" varchar,
      "scene_pipeline_footer" varchar,
      "scene_workflow_footer" varchar,
      "scene_stack_footer" varchar,
      "id" serial PRIMARY KEY NOT NULL,
      "_locale" "_locales" NOT NULL,
      "_parent_id" varchar NOT NULL
    );

    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "capabilities_eyebrow" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "capabilities_h2_line1" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "capabilities_h2_line2_soft" varchar;
    ALTER TABLE "site_homepage_locales" ADD COLUMN IF NOT EXISTS "capabilities_lead" varchar;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_homepage_capabilities_items_bullets_parent_id_fk') THEN
        ALTER TABLE "site_homepage_capabilities_items_bullets" ADD CONSTRAINT "site_homepage_capabilities_items_bullets_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_homepage_capabilities_items_scene_chat_messages_parent_id_fk') THEN
        ALTER TABLE "site_homepage_capabilities_items_scene_chat_messages" ADD CONSTRAINT "site_homepage_capabilities_items_scene_chat_messages_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'cap_items_pipe_steps_parent_id_fk') THEN
        ALTER TABLE "cap_items_pipe_steps" ADD CONSTRAINT "cap_items_pipe_steps_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_homepage_capabilities_items_scene_workflow_nodes_parent_id_fk') THEN
        ALTER TABLE "site_homepage_capabilities_items_scene_workflow_nodes" ADD CONSTRAINT "site_homepage_capabilities_items_scene_workflow_nodes_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_homepage_capabilities_items_scene_workflow_nodes_loc_fk') THEN
        ALTER TABLE "site_homepage_capabilities_items_scene_workflow_nodes_locales" ADD CONSTRAINT "site_homepage_capabilities_items_scene_workflow_nodes_loc_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items_scene_workflow_nodes"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_homepage_capabilities_items_scene_workflow_edges_parent_id_fk') THEN
        ALTER TABLE "site_homepage_capabilities_items_scene_workflow_edges" ADD CONSTRAINT "site_homepage_capabilities_items_scene_workflow_edges_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_homepage_capabilities_items_scene_stack_groups_items_parent_id_fk') THEN
        ALTER TABLE "site_homepage_capabilities_items_scene_stack_groups_items" ADD CONSTRAINT "site_homepage_capabilities_items_scene_stack_groups_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items_scene_stack_groups"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_homepage_capabilities_items_scene_stack_groups_parent_id_fk') THEN
        ALTER TABLE "site_homepage_capabilities_items_scene_stack_groups" ADD CONSTRAINT "site_homepage_capabilities_items_scene_stack_groups_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_homepage_capabilities_items_parent_id_fk') THEN
        ALTER TABLE "site_homepage_capabilities_items" ADD CONSTRAINT "site_homepage_capabilities_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'site_homepage_capabilities_items_locales_parent_id_fk') THEN
        ALTER TABLE "site_homepage_capabilities_items_locales" ADD CONSTRAINT "site_homepage_capabilities_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_bullets_order_idx" ON "site_homepage_capabilities_items_bullets" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_bullets_parent_id_idx" ON "site_homepage_capabilities_items_bullets" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_bullets_locale_idx" ON "site_homepage_capabilities_items_bullets" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_chat_messages_order_idx" ON "site_homepage_capabilities_items_scene_chat_messages" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_chat_messages_parent_id_idx" ON "site_homepage_capabilities_items_scene_chat_messages" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_chat_messages_locale_idx" ON "site_homepage_capabilities_items_scene_chat_messages" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "cap_items_pipe_steps_order_idx" ON "cap_items_pipe_steps" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "cap_items_pipe_steps_parent_id_idx" ON "cap_items_pipe_steps" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "cap_items_pipe_steps_locale_idx" ON "cap_items_pipe_steps" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_workflow_nodes_order_idx" ON "site_homepage_capabilities_items_scene_workflow_nodes" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_workflow_nodes_parent_id_idx" ON "site_homepage_capabilities_items_scene_workflow_nodes" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_workflow_nodes_locale" ON "site_homepage_capabilities_items_scene_workflow_nodes_locales" USING btree ("_locale","_parent_id");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_workflow_edges_order_idx" ON "site_homepage_capabilities_items_scene_workflow_edges" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_workflow_edges_parent_id_idx" ON "site_homepage_capabilities_items_scene_workflow_edges" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_stack_groups_items_order_idx" ON "site_homepage_capabilities_items_scene_stack_groups_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_stack_groups_items_parent_id_idx" ON "site_homepage_capabilities_items_scene_stack_groups_items" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_stack_groups_items_locale_idx" ON "site_homepage_capabilities_items_scene_stack_groups_items" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_stack_groups_order_idx" ON "site_homepage_capabilities_items_scene_stack_groups" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_stack_groups_parent_id_idx" ON "site_homepage_capabilities_items_scene_stack_groups" USING btree ("_parent_id");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_scene_stack_groups_locale_idx" ON "site_homepage_capabilities_items_scene_stack_groups" USING btree ("_locale");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_order_idx" ON "site_homepage_capabilities_items" USING btree ("_order");
    CREATE INDEX IF NOT EXISTS "site_homepage_capabilities_items_parent_id_idx" ON "site_homepage_capabilities_items" USING btree ("_parent_id");
    CREATE UNIQUE INDEX IF NOT EXISTS "site_homepage_capabilities_items_locales_locale_parent_id_un" ON "site_homepage_capabilities_items_locales" USING btree ("_locale","_parent_id");
  `);
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE IF EXISTS "site_homepage_capabilities_items_bullets" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_capabilities_items_scene_chat_messages" CASCADE;
  DROP TABLE IF EXISTS "cap_items_pipe_steps" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_capabilities_items_scene_workflow_nodes" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_capabilities_items_scene_workflow_nodes_locales" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_capabilities_items_scene_workflow_edges" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_capabilities_items_scene_stack_groups_items" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_capabilities_items_scene_stack_groups" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_capabilities_items" CASCADE;
  DROP TABLE IF EXISTS "site_homepage_capabilities_items_locales" CASCADE;
  ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "capabilities_eyebrow";
  ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "capabilities_h2_line1";
  ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "capabilities_h2_line2_soft";
  ALTER TABLE "site_homepage_locales" DROP COLUMN IF EXISTS "capabilities_lead";
  DROP TYPE IF EXISTS "public"."enum_site_homepage_capabilities_items_scene_chat_messages_who";
  DROP TYPE IF EXISTS "public"."enum_cap_items_pipe_steps_state";
  DROP TYPE IF EXISTS "public"."enum_site_homepage_capabilities_items_scene_workflow_nodes_kind";
  DROP TYPE IF EXISTS "public"."enum_site_homepage_capabilities_items_scene_kind";`);
}
