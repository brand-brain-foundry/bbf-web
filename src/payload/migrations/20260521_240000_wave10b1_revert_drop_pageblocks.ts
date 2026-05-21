import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

/**
 * D-BBF-KB-134: Wave 10b1 REVERT — drop all page-* block tables and columns.
 * Restores DB to post-Wave 10a state.
 */
export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Drop non-versioned page-* block tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_hero" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_text_visual" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_feature_grid" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_feature_grid_features" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_cta" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_faq" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_faq_faqs" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_stats" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_stats_stats" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_quote" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_logo_cloud" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_logo_cloud_logos" CASCADE;
  `);

  // Drop _locales counterparts (IF EXISTS safety)
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_hero_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_text_visual_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_feature_grid_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_feature_grid_features_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_cta_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_faq_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_faq_faqs_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_stats_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_stats_stats_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_quote_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_logo_cloud_locales" CASCADE;
  `);

  // Drop versioned page-* block tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_hero" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_text_visual" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_feature_grid" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_feature_grid_features" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_cta" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_faq" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_faq_faqs" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_stats" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_stats_stats" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_quote" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_logo_cloud" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_logo_cloud_logos" CASCADE;
  `);

  // Drop versioned _locales counterparts
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_hero_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_text_visual_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_feature_grid_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_feature_grid_features_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_cta_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_faq_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_faq_faqs_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_stats_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_stats_stats_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_quote_locales" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_logo_cloud_locales" CASCADE;
  `);

  // Drop columns added to content_items by Wave 10b1
  await db.execute(sql`
    ALTER TABLE IF EXISTS "public"."content_items"
      DROP COLUMN IF EXISTS "page_layout" CASCADE,
      DROP COLUMN IF EXISTS "og_image_id" CASCADE,
      DROP COLUMN IF EXISTS "noindex" CASCADE;

    ALTER TABLE IF EXISTS "public"."_content_items_v"
      DROP COLUMN IF EXISTS "version_page_layout" CASCADE,
      DROP COLUMN IF EXISTS "version_og_image_id" CASCADE,
      DROP COLUMN IF EXISTS "version_noindex" CASCADE;
  `);

  // Drop answerCapsule from locales tables
  await db.execute(sql`
    ALTER TABLE IF EXISTS "public"."content_items_locales"
      DROP COLUMN IF EXISTS "answer_capsule" CASCADE;

    ALTER TABLE IF EXISTS "public"."_content_items_v_locales"
      DROP COLUMN IF EXISTS "version_answer_capsule" CASCADE;
  `);

  // Drop faqEntries tables
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."content_items_faq_entries" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_version_faq_entries" CASCADE;
  `);

  // Drop Wave 10b1 enum types
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum_content_items_page_layout" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_version_page_layout" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_hero_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_hero_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_hero_media_position" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_hero_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_hero_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_hero_media_position" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_text_visual_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_text_visual_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_text_visual_icon_type" CASCADE;
    DROP TYPE IF EXISTS "public"."pg_txt_vis_aspect_ratio" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_text_visual_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_text_visual_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_text_visual_icon_type" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_feature_grid_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_feature_grid_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."pg_feat_grid_icon_type" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_feature_grid_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_feature_grid_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_cta_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_cta_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_cta_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_cta_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_faq_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_faq_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_faq_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_faq_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_stats_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_stats_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_stats_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_stats_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_quote_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_quote_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_quote_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_quote_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_logo_cloud_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_logo_cloud_surface" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_logo_cloud_variant" CASCADE;
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_logo_cloud_surface" CASCADE;
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Revert is permanent — re-apply requires new Wave 10b2 design.
  console.log('Wave 10b1 revert is permanent. Re-apply via Wave 10b2 new strategy.');
}
