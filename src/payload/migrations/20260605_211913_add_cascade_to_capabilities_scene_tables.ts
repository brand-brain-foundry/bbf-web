import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * Root cause: scene sub-array tables for capabilities.items lacked FK constraints
 * with ON DELETE CASCADE. When Payload deletes capabilities_items rows during save,
 * those orphaned scene rows remain, causing a PostgreSQL 23505 (unique violation)
 * on re-insert → Payload's handleUpsertError converts to "field invalid: id" → 400.
 *
 * Fix: add missing FK constraints with CASCADE, then delete existing orphaned rows.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ── Step 1: Add missing FK constraints with ON DELETE CASCADE ────────────
  await db.execute(sql`
    DO $$ BEGIN
      ALTER TABLE "site_homepage_capabilities_items_scene_chat_messages"
        ADD CONSTRAINT "scene_chat_messages_parent_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage_capabilities_items_scene_stack_groups"
        ADD CONSTRAINT "scene_stack_groups_parent_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage_capabilities_items_scene_stack_groups_items"
        ADD CONSTRAINT "scene_stack_groups_items_parent_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "site_homepage_capabilities_items_scene_stack_groups"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;

    DO $$ BEGIN
      ALTER TABLE "site_homepage_capabilities_items_scene_workflow_nodes"
        ADD CONSTRAINT "scene_workflow_nodes_parent_fk"
        FOREIGN KEY ("_parent_id")
        REFERENCES "site_homepage_capabilities_items"("id") ON DELETE cascade ON UPDATE no action;
    EXCEPTION WHEN duplicate_object THEN NULL; END $$;
  `);

  // ── Step 2: Delete existing orphaned rows (pre-migration state) ──────────
  // These rows have _parent_id referencing capability items that were
  // previously deleted without cascade — they are stale and must be removed
  // before the FK constraints can enforce referential integrity going forward.
  await db.execute(sql`
    DELETE FROM "site_homepage_capabilities_items_scene_chat_messages"
    WHERE "_parent_id" NOT IN (SELECT id FROM "site_homepage_capabilities_items");

    DELETE FROM "site_homepage_capabilities_items_scene_stack_groups"
    WHERE "_parent_id" NOT IN (SELECT id FROM "site_homepage_capabilities_items");

    DELETE FROM "site_homepage_capabilities_items_scene_stack_groups_items"
    WHERE "_parent_id" NOT IN (SELECT id FROM "site_homepage_capabilities_items_scene_stack_groups");

    DELETE FROM "site_homepage_capabilities_items_scene_workflow_nodes"
    WHERE "_parent_id" NOT IN (SELECT id FROM "site_homepage_capabilities_items");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "site_homepage_capabilities_items_scene_chat_messages"
      DROP CONSTRAINT IF EXISTS "scene_chat_messages_parent_fk";
    ALTER TABLE "site_homepage_capabilities_items_scene_stack_groups"
      DROP CONSTRAINT IF EXISTS "scene_stack_groups_parent_fk";
    ALTER TABLE "site_homepage_capabilities_items_scene_stack_groups_items"
      DROP CONSTRAINT IF EXISTS "scene_stack_groups_items_parent_fk";
    ALTER TABLE "site_homepage_capabilities_items_scene_workflow_nodes"
      DROP CONSTRAINT IF EXISTS "scene_workflow_nodes_parent_fk";
  `);
}
