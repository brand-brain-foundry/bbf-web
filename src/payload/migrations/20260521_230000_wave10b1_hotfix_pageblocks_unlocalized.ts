import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // D-BBF-KB-132: pageBlocks localized:false
  // Drop _locale from root page-* block tables (non-versioned).
  // Payload no longer expects _locale on these tables.
  await db.execute(sql`
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_hero"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_text_visual"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_feature_grid"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_cta"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_faq"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_stats"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_quote"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_logo_cloud"
      DROP COLUMN IF EXISTS "_locale";
  `);

  // D-BBF-KB-132: Drop _locale from versioned page-* block tables.
  await db.execute(sql`
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_hero"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_text_visual"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_feature_grid"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_cta"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_faq"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_stats"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_quote"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_logo_cloud"
      DROP COLUMN IF EXISTS "_locale";
  `);

  // D-BBF-KB-133: Drop _locale from nested child array tables (IF EXISTS safety).
  // These tables were created without _locale in Wave 10b1 migration,
  // but the localized:true query was trying to join on _locale.
  await db.execute(sql`
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_feature_grid_features"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_faq_faqs"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_stats_stats"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_logo_cloud_logos"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_feature_grid_features"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_faq_faqs"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_stats_stats"
      DROP COLUMN IF EXISTS "_locale";
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_logo_cloud_logos"
      DROP COLUMN IF EXISTS "_locale";
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Restore _locale on root block tables (revert to localized:true state).
  await db.execute(sql`
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_hero"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_text_visual"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_feature_grid"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_cta"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_faq"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_stats"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_quote"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."content_items_blocks_page_logo_cloud"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_hero"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_text_visual"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_feature_grid"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_cta"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_faq"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_stats"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_quote"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
    ALTER TABLE IF EXISTS "public"."_content_items_v_blocks_page_logo_cloud"
      ADD COLUMN IF NOT EXISTS "_locale" "_locales" NOT NULL DEFAULT 'es';
  `);
}
