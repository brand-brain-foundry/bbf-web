import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres';

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // ─────────────────────────────────────────────────────────────────────────
  // 1. ENUM TYPES
  // ─────────────────────────────────────────────────────────────────────────

  // pageLayout on content_items (non-versioned and versioned are separate enums)
  await db.execute(sql`
    CREATE TYPE "public"."enum_content_items_page_layout"
      AS ENUM('standard', 'cornerstone', 'pillar', 'landing');

    CREATE TYPE "public"."enum__content_items_v_version_page_layout"
      AS ENUM('standard', 'cornerstone', 'pillar', 'landing');
  `);

  // HeroPageBlock — variant, surface, mediaPosition
  await db.execute(sql`
    CREATE TYPE "public"."enum_content_items_blocks_page_hero_variant"
      AS ENUM('centered', 'left-aligned', 'split');

    CREATE TYPE "public"."enum_content_items_blocks_page_hero_surface"
      AS ENUM('sand', 'dark', 'gradient');

    CREATE TYPE "public"."enum_content_items_blocks_page_hero_media_position"
      AS ENUM('right', 'left');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_hero_variant"
      AS ENUM('centered', 'left-aligned', 'split');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_hero_surface"
      AS ENUM('sand', 'dark', 'gradient');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_hero_media_position"
      AS ENUM('right', 'left');
  `);

  // TextVisualPageBlock — variant, surface, iconType (shared dbName), visualAspectRatio (shared dbName)
  await db.execute(sql`
    CREATE TYPE "public"."enum_content_items_blocks_page_text_visual_variant"
      AS ENUM('text-left', 'text-right', 'text-top');

    CREATE TYPE "public"."enum_content_items_blocks_page_text_visual_surface"
      AS ENUM('sand', 'dark', 'subtle');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_text_visual_variant"
      AS ENUM('text-left', 'text-right', 'text-top');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_text_visual_surface"
      AS ENUM('sand', 'dark', 'subtle');
  `);

  // Shared enums for TextVisual iconType and visualAspectRatio (dbName overrides — created once)
  await db.execute(sql`
    CREATE TYPE "public"."pg_txt_vis_aspect_ratio"
      AS ENUM('auto', '16:9', '4:3', '1:1');
  `);

  // FeatureGridPageBlock — variant, surface
  await db.execute(sql`
    CREATE TYPE "public"."enum_content_items_blocks_page_feature_grid_variant"
      AS ENUM('cards', 'clean', 'bordered');

    CREATE TYPE "public"."enum_content_items_blocks_page_feature_grid_surface"
      AS ENUM('sand', 'dark', 'subtle');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_feature_grid_variant"
      AS ENUM('cards', 'clean', 'bordered');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_feature_grid_surface"
      AS ENUM('sand', 'dark', 'subtle');
  `);

  // Shared enum for FeatureGrid features iconType (dbName override — created once)
  await db.execute(sql`
    CREATE TYPE "public"."pg_feat_grid_icon_type"
      AS ENUM('lucide', 'upload');
  `);

  // CTAPageBlock — variant, surface
  await db.execute(sql`
    CREATE TYPE "public"."enum_content_items_blocks_page_cta_variant"
      AS ENUM('centered', 'split', 'dark');

    CREATE TYPE "public"."enum_content_items_blocks_page_cta_surface"
      AS ENUM('sand', 'dark', 'gradient');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_cta_variant"
      AS ENUM('centered', 'split', 'dark');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_cta_surface"
      AS ENUM('sand', 'dark', 'gradient');
  `);

  // FAQPageBlock — variant, surface
  await db.execute(sql`
    CREATE TYPE "public"."enum_content_items_blocks_page_faq_variant"
      AS ENUM('bordered', 'cards', 'minimal');

    CREATE TYPE "public"."enum_content_items_blocks_page_faq_surface"
      AS ENUM('sand', 'subtle');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_faq_variant"
      AS ENUM('bordered', 'cards', 'minimal');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_faq_surface"
      AS ENUM('sand', 'subtle');
  `);

  // StatsPageBlock — variant, surface
  await db.execute(sql`
    CREATE TYPE "public"."enum_content_items_blocks_page_stats_variant"
      AS ENUM('grid', 'inline', 'bordered');

    CREATE TYPE "public"."enum_content_items_blocks_page_stats_surface"
      AS ENUM('sand', 'dark', 'subtle');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_stats_variant"
      AS ENUM('grid', 'inline', 'bordered');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_stats_surface"
      AS ENUM('sand', 'dark', 'subtle');
  `);

  // QuotePageBlock — variant, surface
  await db.execute(sql`
    CREATE TYPE "public"."enum_content_items_blocks_page_quote_variant"
      AS ENUM('centered', 'card', 'inline');

    CREATE TYPE "public"."enum_content_items_blocks_page_quote_surface"
      AS ENUM('sand', 'dark', 'subtle');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_quote_variant"
      AS ENUM('centered', 'card', 'inline');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_quote_surface"
      AS ENUM('sand', 'dark', 'subtle');
  `);

  // LogoCloudPageBlock — variant, surface
  await db.execute(sql`
    CREATE TYPE "public"."enum_content_items_blocks_page_logo_cloud_variant"
      AS ENUM('grid', 'marquee', 'bordered');

    CREATE TYPE "public"."enum_content_items_blocks_page_logo_cloud_surface"
      AS ENUM('sand', 'subtle');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_logo_cloud_variant"
      AS ENUM('grid', 'marquee', 'bordered');

    CREATE TYPE "public"."enum__content_items_v_blocks_page_logo_cloud_surface"
      AS ENUM('sand', 'subtle');
  `);

  // ─────────────────────────────────────────────────────────────────────────
  // 2. ALTER EXISTING TABLES — add columns
  // ─────────────────────────────────────────────────────────────────────────

  await db.execute(sql`
    ALTER TABLE "public"."content_items"
      ADD COLUMN IF NOT EXISTS "page_layout" "enum_content_items_page_layout" DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "og_image_id" integer,
      ADD COLUMN IF NOT EXISTS "noindex" boolean DEFAULT false;

    ALTER TABLE "public"."content_items_locales"
      ADD COLUMN IF NOT EXISTS "answer_capsule" varchar;

    ALTER TABLE "public"."_content_items_v"
      ADD COLUMN IF NOT EXISTS "version_page_layout" "enum__content_items_v_version_page_layout" DEFAULT 'standard',
      ADD COLUMN IF NOT EXISTS "version_og_image_id" integer,
      ADD COLUMN IF NOT EXISTS "version_noindex" boolean DEFAULT false;

    ALTER TABLE "public"."_content_items_v_locales"
      ADD COLUMN IF NOT EXISTS "version_answer_capsule" varchar;
  `);

  // ─────────────────────────────────────────────────────────────────────────
  // 3. CREATE NEW TABLES
  // ─────────────────────────────────────────────────────────────────────────

  // ── content_items_faq_entries (top-level array, localized fields embedded) ──
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."content_items_faq_entries" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_locale"   "_locales" NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "question"  varchar,
      "answer"    jsonb
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_version_faq_entries" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_locale"   "_locales" NOT NULL,
      "id"        serial PRIMARY KEY NOT NULL,
      "question"  varchar,
      "answer"    jsonb,
      "_uuid"     varchar
    );
  `);

  // ── HeroPageBlock ──────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_hero" (
      "_order"              integer NOT NULL,
      "_parent_id"          integer NOT NULL,
      "_path"               text NOT NULL,
      "_locale"             "_locales" NOT NULL,
      "id"                  varchar PRIMARY KEY NOT NULL,
      "variant"             "enum_content_items_blocks_page_hero_variant" DEFAULT 'centered',
      "surface"             "enum_content_items_blocks_page_hero_surface" DEFAULT 'sand',
      "eyebrow"             varchar,
      "title"               varchar,
      "subtitle"            varchar,
      "cta_primary_label"   varchar,
      "cta_primary_href"    varchar,
      "cta_secondary_label" varchar,
      "cta_secondary_href"  varchar,
      "media_id"            integer,
      "media_position"      "enum_content_items_blocks_page_hero_media_position" DEFAULT 'right',
      "block_name"          varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_hero" (
      "_order"              integer NOT NULL,
      "_parent_id"          integer NOT NULL,
      "_path"               text NOT NULL,
      "_locale"             "_locales" NOT NULL,
      "id"                  serial PRIMARY KEY NOT NULL,
      "variant"             "enum__content_items_v_blocks_page_hero_variant" DEFAULT 'centered',
      "surface"             "enum__content_items_v_blocks_page_hero_surface" DEFAULT 'sand',
      "eyebrow"             varchar,
      "title"               varchar,
      "subtitle"            varchar,
      "cta_primary_label"   varchar,
      "cta_primary_href"    varchar,
      "cta_secondary_label" varchar,
      "cta_secondary_href"  varchar,
      "media_id"            integer,
      "media_position"      "enum__content_items_v_blocks_page_hero_media_position" DEFAULT 'right',
      "_uuid"               varchar,
      "block_name"          varchar
    );
  `);

  // ── TextVisualPageBlock ────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_text_visual" (
      "_order"            integer NOT NULL,
      "_parent_id"        integer NOT NULL,
      "_path"             text NOT NULL,
      "_locale"           "_locales" NOT NULL,
      "id"                varchar PRIMARY KEY NOT NULL,
      "variant"           "enum_content_items_blocks_page_text_visual_variant",
      "surface"           "enum_content_items_blocks_page_text_visual_surface",
      "icon_type"         "pg_feat_grid_icon_type",
      "icon_lucide"       varchar,
      "icon_upload_id"    integer,
      "title"             varchar,
      "subtitle"          varchar,
      "body"              jsonb,
      "visual_asset_id"   integer,
      "visual_aspect_ratio" "pg_txt_vis_aspect_ratio",
      "block_name"        varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_text_visual" (
      "_order"            integer NOT NULL,
      "_parent_id"        integer NOT NULL,
      "_path"             text NOT NULL,
      "_locale"           "_locales" NOT NULL,
      "id"                serial PRIMARY KEY NOT NULL,
      "variant"           "enum__content_items_v_blocks_page_text_visual_variant",
      "surface"           "enum__content_items_v_blocks_page_text_visual_surface",
      "icon_type"         "pg_feat_grid_icon_type",
      "icon_lucide"       varchar,
      "icon_upload_id"    integer,
      "title"             varchar,
      "subtitle"          varchar,
      "body"              jsonb,
      "visual_asset_id"   integer,
      "visual_aspect_ratio" "pg_txt_vis_aspect_ratio",
      "_uuid"             varchar,
      "block_name"        varchar
    );
  `);

  // ── FeatureGridPageBlock + child features ──────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_feature_grid" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"     text NOT NULL,
      "_locale"   "_locales" NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "variant"   "enum_content_items_blocks_page_feature_grid_variant" DEFAULT 'cards',
      "surface"   "enum_content_items_blocks_page_feature_grid_surface" DEFAULT 'sand',
      "eyebrow"   varchar,
      "title"     varchar,
      "subtitle"  varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_feature_grid_features" (
      "_order"        integer NOT NULL,
      "_parent_id"    varchar NOT NULL,
      "id"            varchar PRIMARY KEY NOT NULL,
      "icon_type"     "pg_feat_grid_icon_type",
      "icon_lucide"   varchar,
      "icon_upload_id" integer,
      "title"         varchar,
      "description"   varchar,
      "link_label"    varchar,
      "link_href"     varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_feature_grid" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"     text NOT NULL,
      "_locale"   "_locales" NOT NULL,
      "id"        serial PRIMARY KEY NOT NULL,
      "variant"   "enum__content_items_v_blocks_page_feature_grid_variant" DEFAULT 'cards',
      "surface"   "enum__content_items_v_blocks_page_feature_grid_surface" DEFAULT 'sand',
      "eyebrow"   varchar,
      "title"     varchar,
      "subtitle"  varchar,
      "_uuid"     varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_feature_grid_features" (
      "_order"        integer NOT NULL,
      "_parent_id"    integer NOT NULL,
      "id"            serial PRIMARY KEY NOT NULL,
      "icon_type"     "pg_feat_grid_icon_type",
      "icon_lucide"   varchar,
      "icon_upload_id" integer,
      "title"         varchar,
      "description"   varchar,
      "link_label"    varchar,
      "link_href"     varchar,
      "_uuid"         varchar
    );
  `);

  // ── CTAPageBlock ──────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_cta" (
      "_order"              integer NOT NULL,
      "_parent_id"          integer NOT NULL,
      "_path"               text NOT NULL,
      "_locale"             "_locales" NOT NULL,
      "id"                  varchar PRIMARY KEY NOT NULL,
      "variant"             "enum_content_items_blocks_page_cta_variant" DEFAULT 'centered',
      "surface"             "enum_content_items_blocks_page_cta_surface" DEFAULT 'sand',
      "eyebrow"             varchar,
      "headline"            varchar,
      "subtext"             varchar,
      "cta_primary_label"   varchar,
      "cta_primary_href"    varchar,
      "cta_secondary_label" varchar,
      "cta_secondary_href"  varchar,
      "block_name"          varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_cta" (
      "_order"              integer NOT NULL,
      "_parent_id"          integer NOT NULL,
      "_path"               text NOT NULL,
      "_locale"             "_locales" NOT NULL,
      "id"                  serial PRIMARY KEY NOT NULL,
      "variant"             "enum__content_items_v_blocks_page_cta_variant" DEFAULT 'centered',
      "surface"             "enum__content_items_v_blocks_page_cta_surface" DEFAULT 'sand',
      "eyebrow"             varchar,
      "headline"            varchar,
      "subtext"             varchar,
      "cta_primary_label"   varchar,
      "cta_primary_href"    varchar,
      "cta_secondary_label" varchar,
      "cta_secondary_href"  varchar,
      "_uuid"               varchar,
      "block_name"          varchar
    );
  `);

  // ── FAQPageBlock + child faqs ─────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_faq" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"     text NOT NULL,
      "_locale"   "_locales" NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "variant"   "enum_content_items_blocks_page_faq_variant" DEFAULT 'bordered',
      "surface"   "enum_content_items_blocks_page_faq_surface" DEFAULT 'sand',
      "eyebrow"   varchar,
      "title"     varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_faq_faqs" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "question"   varchar,
      "answer"     jsonb
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_faq" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"     text NOT NULL,
      "_locale"   "_locales" NOT NULL,
      "id"        serial PRIMARY KEY NOT NULL,
      "variant"   "enum__content_items_v_blocks_page_faq_variant" DEFAULT 'bordered',
      "surface"   "enum__content_items_v_blocks_page_faq_surface" DEFAULT 'sand',
      "eyebrow"   varchar,
      "title"     varchar,
      "_uuid"     varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_faq_faqs" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         serial PRIMARY KEY NOT NULL,
      "question"   varchar,
      "answer"     jsonb,
      "_uuid"      varchar
    );
  `);

  // ── StatsPageBlock + child stats ──────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_stats" (
      "_order"          integer NOT NULL,
      "_parent_id"      integer NOT NULL,
      "_path"           text NOT NULL,
      "_locale"         "_locales" NOT NULL,
      "id"              varchar PRIMARY KEY NOT NULL,
      "variant"         "enum_content_items_blocks_page_stats_variant" DEFAULT 'grid',
      "surface"         "enum_content_items_blocks_page_stats_surface" DEFAULT 'sand',
      "eyebrow"         varchar,
      "title"           varchar,
      "source_citation" varchar,
      "block_name"      varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_stats_stats" (
      "_order"      integer NOT NULL,
      "_parent_id"  varchar NOT NULL,
      "id"          varchar PRIMARY KEY NOT NULL,
      "number"      varchar,
      "label"       varchar,
      "description" varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_stats" (
      "_order"          integer NOT NULL,
      "_parent_id"      integer NOT NULL,
      "_path"           text NOT NULL,
      "_locale"         "_locales" NOT NULL,
      "id"              serial PRIMARY KEY NOT NULL,
      "variant"         "enum__content_items_v_blocks_page_stats_variant" DEFAULT 'grid',
      "surface"         "enum__content_items_v_blocks_page_stats_surface" DEFAULT 'sand',
      "eyebrow"         varchar,
      "title"           varchar,
      "source_citation" varchar,
      "_uuid"           varchar,
      "block_name"      varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_stats_stats" (
      "_order"      integer NOT NULL,
      "_parent_id"  integer NOT NULL,
      "id"          serial PRIMARY KEY NOT NULL,
      "number"      varchar,
      "label"       varchar,
      "description" varchar,
      "_uuid"       varchar
    );
  `);

  // ── QuotePageBlock ────────────────────────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_quote" (
      "_order"          integer NOT NULL,
      "_parent_id"      integer NOT NULL,
      "_path"           text NOT NULL,
      "_locale"         "_locales" NOT NULL,
      "id"              varchar PRIMARY KEY NOT NULL,
      "variant"         "enum_content_items_blocks_page_quote_variant" DEFAULT 'centered',
      "surface"         "enum_content_items_blocks_page_quote_surface" DEFAULT 'sand',
      "quote"           varchar,
      "author_name"     varchar,
      "author_role"     varchar,
      "author_company"  varchar,
      "author_avatar_id" integer,
      "context"         varchar,
      "block_name"      varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_quote" (
      "_order"          integer NOT NULL,
      "_parent_id"      integer NOT NULL,
      "_path"           text NOT NULL,
      "_locale"         "_locales" NOT NULL,
      "id"              serial PRIMARY KEY NOT NULL,
      "variant"         "enum__content_items_v_blocks_page_quote_variant" DEFAULT 'centered',
      "surface"         "enum__content_items_v_blocks_page_quote_surface" DEFAULT 'sand',
      "quote"           varchar,
      "author_name"     varchar,
      "author_role"     varchar,
      "author_company"  varchar,
      "author_avatar_id" integer,
      "context"         varchar,
      "_uuid"           varchar,
      "block_name"      varchar
    );
  `);

  // ── LogoCloudPageBlock + child logos ──────────────────────────────────────
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_logo_cloud" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"     text NOT NULL,
      "_locale"   "_locales" NOT NULL,
      "id"        varchar PRIMARY KEY NOT NULL,
      "variant"   "enum_content_items_blocks_page_logo_cloud_variant" DEFAULT 'grid',
      "surface"   "enum_content_items_blocks_page_logo_cloud_surface" DEFAULT 'sand',
      "eyebrow"   varchar,
      "title"     varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."content_items_blocks_page_logo_cloud_logos" (
      "_order"     integer NOT NULL,
      "_parent_id" varchar NOT NULL,
      "id"         varchar PRIMARY KEY NOT NULL,
      "name"       varchar,
      "logo_id"    integer,
      "link"       varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_logo_cloud" (
      "_order"    integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "_path"     text NOT NULL,
      "_locale"   "_locales" NOT NULL,
      "id"        serial PRIMARY KEY NOT NULL,
      "variant"   "enum__content_items_v_blocks_page_logo_cloud_variant" DEFAULT 'grid',
      "surface"   "enum__content_items_v_blocks_page_logo_cloud_surface" DEFAULT 'sand',
      "eyebrow"   varchar,
      "title"     varchar,
      "_uuid"     varchar,
      "block_name" varchar
    );

    CREATE TABLE IF NOT EXISTS "public"."_content_items_v_blocks_page_logo_cloud_logos" (
      "_order"     integer NOT NULL,
      "_parent_id" integer NOT NULL,
      "id"         serial PRIMARY KEY NOT NULL,
      "name"       varchar,
      "logo_id"    integer,
      "link"       varchar,
      "_uuid"      varchar
    );
  `);

  // ─────────────────────────────────────────────────────────────────────────
  // 4. FOREIGN KEY CONSTRAINTS
  // ─────────────────────────────────────────────────────────────────────────

  // content_items new column FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items"
      ADD CONSTRAINT "content_items_og_image_id_media_id_fk"
      FOREIGN KEY ("og_image_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v"
      ADD CONSTRAINT "_content_items_v_version_og_image_id_media_id_fk"
      FOREIGN KEY ("version_og_image_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  `);

  // content_items_faq_entries FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items_faq_entries"
      ADD CONSTRAINT "content_items_faq_entries_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_version_faq_entries"
      ADD CONSTRAINT "_content_items_v_version_faq_entries_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v"("id")
      ON DELETE cascade ON UPDATE no action;
  `);

  // HeroPageBlock FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items_blocks_page_hero"
      ADD CONSTRAINT "content_items_blocks_page_hero_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_hero"
      ADD CONSTRAINT "content_items_blocks_page_hero_media_id_media_id_fk"
      FOREIGN KEY ("media_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_hero"
      ADD CONSTRAINT "_content_items_v_blocks_page_hero_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_hero"
      ADD CONSTRAINT "_content_items_v_blocks_page_hero_media_id_media_id_fk"
      FOREIGN KEY ("media_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  `);

  // TextVisualPageBlock FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items_blocks_page_text_visual"
      ADD CONSTRAINT "content_items_blocks_page_text_visual_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_text_visual"
      ADD CONSTRAINT "content_items_blocks_page_text_visual_icon_upload_id_media_id_fk"
      FOREIGN KEY ("icon_upload_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_text_visual"
      ADD CONSTRAINT "content_items_blocks_page_text_visual_visual_asset_id_media_id_fk"
      FOREIGN KEY ("visual_asset_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_text_visual"
      ADD CONSTRAINT "_content_items_v_blocks_page_text_visual_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_text_visual"
      ADD CONSTRAINT "_content_items_v_blocks_page_text_visual_icon_upload_id_media_id_fk"
      FOREIGN KEY ("icon_upload_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_text_visual"
      ADD CONSTRAINT "_content_items_v_blocks_page_text_visual_visual_asset_id_media_id_fk"
      FOREIGN KEY ("visual_asset_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  `);

  // FeatureGridPageBlock FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items_blocks_page_feature_grid"
      ADD CONSTRAINT "content_items_blocks_page_feature_grid_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_feature_grid_features"
      ADD CONSTRAINT "content_items_blocks_page_feature_grid_features_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items_blocks_page_feature_grid"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_feature_grid_features"
      ADD CONSTRAINT "content_items_blocks_page_feature_grid_features_icon_upload_id_media_id_fk"
      FOREIGN KEY ("icon_upload_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_feature_grid"
      ADD CONSTRAINT "_content_items_v_blocks_page_feature_grid_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_feature_grid_features"
      ADD CONSTRAINT "_content_items_v_blocks_page_feature_grid_features_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v_blocks_page_feature_grid"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_feature_grid_features"
      ADD CONSTRAINT "_content_items_v_blocks_page_feature_grid_features_icon_upload_id_media_id_fk"
      FOREIGN KEY ("icon_upload_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  `);

  // CTAPageBlock FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items_blocks_page_cta"
      ADD CONSTRAINT "content_items_blocks_page_cta_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_cta"
      ADD CONSTRAINT "_content_items_v_blocks_page_cta_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v"("id")
      ON DELETE cascade ON UPDATE no action;
  `);

  // FAQPageBlock FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items_blocks_page_faq"
      ADD CONSTRAINT "content_items_blocks_page_faq_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_faq_faqs"
      ADD CONSTRAINT "content_items_blocks_page_faq_faqs_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items_blocks_page_faq"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_faq"
      ADD CONSTRAINT "_content_items_v_blocks_page_faq_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_faq_faqs"
      ADD CONSTRAINT "_content_items_v_blocks_page_faq_faqs_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v_blocks_page_faq"("id")
      ON DELETE cascade ON UPDATE no action;
  `);

  // StatsPageBlock FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items_blocks_page_stats"
      ADD CONSTRAINT "content_items_blocks_page_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_stats_stats"
      ADD CONSTRAINT "content_items_blocks_page_stats_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items_blocks_page_stats"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_stats"
      ADD CONSTRAINT "_content_items_v_blocks_page_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_stats_stats"
      ADD CONSTRAINT "_content_items_v_blocks_page_stats_stats_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v_blocks_page_stats"("id")
      ON DELETE cascade ON UPDATE no action;
  `);

  // QuotePageBlock FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items_blocks_page_quote"
      ADD CONSTRAINT "content_items_blocks_page_quote_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_quote"
      ADD CONSTRAINT "content_items_blocks_page_quote_author_avatar_id_media_id_fk"
      FOREIGN KEY ("author_avatar_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_quote"
      ADD CONSTRAINT "_content_items_v_blocks_page_quote_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_quote"
      ADD CONSTRAINT "_content_items_v_blocks_page_quote_author_avatar_id_media_id_fk"
      FOREIGN KEY ("author_avatar_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  `);

  // LogoCloudPageBlock FKs
  await db.execute(sql`
    ALTER TABLE "public"."content_items_blocks_page_logo_cloud"
      ADD CONSTRAINT "content_items_blocks_page_logo_cloud_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_logo_cloud_logos"
      ADD CONSTRAINT "content_items_blocks_page_logo_cloud_logos_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."content_items_blocks_page_logo_cloud"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."content_items_blocks_page_logo_cloud_logos"
      ADD CONSTRAINT "content_items_blocks_page_logo_cloud_logos_logo_id_media_id_fk"
      FOREIGN KEY ("logo_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_logo_cloud"
      ADD CONSTRAINT "_content_items_v_blocks_page_logo_cloud_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_logo_cloud_logos"
      ADD CONSTRAINT "_content_items_v_blocks_page_logo_cloud_logos_parent_id_fk"
      FOREIGN KEY ("_parent_id")
      REFERENCES "public"."_content_items_v_blocks_page_logo_cloud"("id")
      ON DELETE cascade ON UPDATE no action;

    ALTER TABLE "public"."_content_items_v_blocks_page_logo_cloud_logos"
      ADD CONSTRAINT "_content_items_v_blocks_page_logo_cloud_logos_logo_id_media_id_fk"
      FOREIGN KEY ("logo_id")
      REFERENCES "public"."media"("id")
      ON DELETE set null ON UPDATE no action;
  `);

  // ─────────────────────────────────────────────────────────────────────────
  // 5. INDEXES
  // ─────────────────────────────────────────────────────────────────────────

  // content_items_faq_entries
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_items_faq_entries_order_idx"
      ON "public"."content_items_faq_entries" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_faq_entries_parent_id_idx"
      ON "public"."content_items_faq_entries" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "content_items_faq_entries_locale_idx"
      ON "public"."content_items_faq_entries" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "_content_items_v_version_faq_entries_order_idx"
      ON "public"."_content_items_v_version_faq_entries" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_version_faq_entries_parent_id_idx"
      ON "public"."_content_items_v_version_faq_entries" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_version_faq_entries_locale_idx"
      ON "public"."_content_items_v_version_faq_entries" USING btree ("_locale");
  `);

  // HeroPageBlock indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_hero_order_idx"
      ON "public"."content_items_blocks_page_hero" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_hero_parent_id_idx"
      ON "public"."content_items_blocks_page_hero" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_hero_path_idx"
      ON "public"."content_items_blocks_page_hero" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_hero_locale_idx"
      ON "public"."content_items_blocks_page_hero" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_hero_order_idx"
      ON "public"."_content_items_v_blocks_page_hero" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_hero_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_hero" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_hero_path_idx"
      ON "public"."_content_items_v_blocks_page_hero" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_hero_locale_idx"
      ON "public"."_content_items_v_blocks_page_hero" USING btree ("_locale");
  `);

  // TextVisualPageBlock indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_text_visual_order_idx"
      ON "public"."content_items_blocks_page_text_visual" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_text_visual_parent_id_idx"
      ON "public"."content_items_blocks_page_text_visual" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_text_visual_path_idx"
      ON "public"."content_items_blocks_page_text_visual" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_text_visual_locale_idx"
      ON "public"."content_items_blocks_page_text_visual" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_text_visual_order_idx"
      ON "public"."_content_items_v_blocks_page_text_visual" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_text_visual_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_text_visual" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_text_visual_path_idx"
      ON "public"."_content_items_v_blocks_page_text_visual" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_text_visual_locale_idx"
      ON "public"."_content_items_v_blocks_page_text_visual" USING btree ("_locale");
  `);

  // FeatureGridPageBlock indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_feature_grid_order_idx"
      ON "public"."content_items_blocks_page_feature_grid" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_feature_grid_parent_id_idx"
      ON "public"."content_items_blocks_page_feature_grid" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_feature_grid_path_idx"
      ON "public"."content_items_blocks_page_feature_grid" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_feature_grid_locale_idx"
      ON "public"."content_items_blocks_page_feature_grid" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_feature_grid_features_order_idx"
      ON "public"."content_items_blocks_page_feature_grid_features" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_feature_grid_features_parent_id_idx"
      ON "public"."content_items_blocks_page_feature_grid_features" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_feature_grid_order_idx"
      ON "public"."_content_items_v_blocks_page_feature_grid" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_feature_grid_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_feature_grid" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_feature_grid_path_idx"
      ON "public"."_content_items_v_blocks_page_feature_grid" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_feature_grid_locale_idx"
      ON "public"."_content_items_v_blocks_page_feature_grid" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_feature_grid_features_order_idx"
      ON "public"."_content_items_v_blocks_page_feature_grid_features" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_feature_grid_features_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_feature_grid_features" USING btree ("_parent_id");
  `);

  // CTAPageBlock indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_cta_order_idx"
      ON "public"."content_items_blocks_page_cta" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_cta_parent_id_idx"
      ON "public"."content_items_blocks_page_cta" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_cta_path_idx"
      ON "public"."content_items_blocks_page_cta" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_cta_locale_idx"
      ON "public"."content_items_blocks_page_cta" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_cta_order_idx"
      ON "public"."_content_items_v_blocks_page_cta" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_cta_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_cta" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_cta_path_idx"
      ON "public"."_content_items_v_blocks_page_cta" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_cta_locale_idx"
      ON "public"."_content_items_v_blocks_page_cta" USING btree ("_locale");
  `);

  // FAQPageBlock indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_faq_order_idx"
      ON "public"."content_items_blocks_page_faq" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_faq_parent_id_idx"
      ON "public"."content_items_blocks_page_faq" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_faq_path_idx"
      ON "public"."content_items_blocks_page_faq" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_faq_locale_idx"
      ON "public"."content_items_blocks_page_faq" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_faq_faqs_order_idx"
      ON "public"."content_items_blocks_page_faq_faqs" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_faq_faqs_parent_id_idx"
      ON "public"."content_items_blocks_page_faq_faqs" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_faq_order_idx"
      ON "public"."_content_items_v_blocks_page_faq" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_faq_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_faq" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_faq_path_idx"
      ON "public"."_content_items_v_blocks_page_faq" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_faq_locale_idx"
      ON "public"."_content_items_v_blocks_page_faq" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_faq_faqs_order_idx"
      ON "public"."_content_items_v_blocks_page_faq_faqs" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_faq_faqs_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_faq_faqs" USING btree ("_parent_id");
  `);

  // StatsPageBlock indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_stats_order_idx"
      ON "public"."content_items_blocks_page_stats" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_stats_parent_id_idx"
      ON "public"."content_items_blocks_page_stats" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_stats_path_idx"
      ON "public"."content_items_blocks_page_stats" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_stats_locale_idx"
      ON "public"."content_items_blocks_page_stats" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_stats_stats_order_idx"
      ON "public"."content_items_blocks_page_stats_stats" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_stats_stats_parent_id_idx"
      ON "public"."content_items_blocks_page_stats_stats" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_stats_order_idx"
      ON "public"."_content_items_v_blocks_page_stats" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_stats_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_stats" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_stats_path_idx"
      ON "public"."_content_items_v_blocks_page_stats" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_stats_locale_idx"
      ON "public"."_content_items_v_blocks_page_stats" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_stats_stats_order_idx"
      ON "public"."_content_items_v_blocks_page_stats_stats" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_stats_stats_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_stats_stats" USING btree ("_parent_id");
  `);

  // QuotePageBlock indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_quote_order_idx"
      ON "public"."content_items_blocks_page_quote" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_quote_parent_id_idx"
      ON "public"."content_items_blocks_page_quote" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_quote_path_idx"
      ON "public"."content_items_blocks_page_quote" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_quote_locale_idx"
      ON "public"."content_items_blocks_page_quote" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_quote_order_idx"
      ON "public"."_content_items_v_blocks_page_quote" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_quote_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_quote" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_quote_path_idx"
      ON "public"."_content_items_v_blocks_page_quote" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_quote_locale_idx"
      ON "public"."_content_items_v_blocks_page_quote" USING btree ("_locale");
  `);

  // LogoCloudPageBlock indexes
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_logo_cloud_order_idx"
      ON "public"."content_items_blocks_page_logo_cloud" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_logo_cloud_parent_id_idx"
      ON "public"."content_items_blocks_page_logo_cloud" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_logo_cloud_path_idx"
      ON "public"."content_items_blocks_page_logo_cloud" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_logo_cloud_locale_idx"
      ON "public"."content_items_blocks_page_logo_cloud" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_logo_cloud_logos_order_idx"
      ON "public"."content_items_blocks_page_logo_cloud_logos" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "content_items_blocks_page_logo_cloud_logos_parent_id_idx"
      ON "public"."content_items_blocks_page_logo_cloud_logos" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_logo_cloud_order_idx"
      ON "public"."_content_items_v_blocks_page_logo_cloud" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_logo_cloud_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_logo_cloud" USING btree ("_parent_id");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_logo_cloud_path_idx"
      ON "public"."_content_items_v_blocks_page_logo_cloud" USING btree ("_path");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_logo_cloud_locale_idx"
      ON "public"."_content_items_v_blocks_page_logo_cloud" USING btree ("_locale");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_logo_cloud_logos_order_idx"
      ON "public"."_content_items_v_blocks_page_logo_cloud_logos" USING btree ("_order");

    CREATE INDEX IF NOT EXISTS "_content_items_v_blocks_page_logo_cloud_logos_parent_id_idx"
      ON "public"."_content_items_v_blocks_page_logo_cloud_logos" USING btree ("_parent_id");
  `);
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  // Drop child tables first (leaf nodes), then parent block tables, then alter columns, then enums.

  // ── Drop versioned child tables ───────────────────────────────────────────
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_logo_cloud_logos" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_stats_stats" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_faq_faqs" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_feature_grid_features" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_version_faq_entries" CASCADE;
  `);

  // ── Drop versioned block tables ───────────────────────────────────────────
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_logo_cloud" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_quote" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_stats" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_faq" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_cta" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_feature_grid" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_text_visual" CASCADE;
    DROP TABLE IF EXISTS "public"."_content_items_v_blocks_page_hero" CASCADE;
  `);

  // ── Drop non-versioned child tables ───────────────────────────────────────
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_logo_cloud_logos" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_stats_stats" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_faq_faqs" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_feature_grid_features" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_faq_entries" CASCADE;
  `);

  // ── Drop non-versioned block tables ───────────────────────────────────────
  await db.execute(sql`
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_logo_cloud" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_quote" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_stats" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_faq" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_cta" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_feature_grid" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_text_visual" CASCADE;
    DROP TABLE IF EXISTS "public"."content_items_blocks_page_hero" CASCADE;
  `);

  // ── Remove added columns ──────────────────────────────────────────────────
  await db.execute(sql`
    ALTER TABLE "public"."content_items"
      DROP COLUMN IF EXISTS "page_layout",
      DROP COLUMN IF EXISTS "og_image_id",
      DROP COLUMN IF EXISTS "noindex";

    ALTER TABLE "public"."content_items_locales"
      DROP COLUMN IF EXISTS "answer_capsule";

    ALTER TABLE "public"."_content_items_v"
      DROP COLUMN IF EXISTS "version_page_layout",
      DROP COLUMN IF EXISTS "version_og_image_id",
      DROP COLUMN IF EXISTS "version_noindex";

    ALTER TABLE "public"."_content_items_v_locales"
      DROP COLUMN IF EXISTS "version_answer_capsule";
  `);

  // ── Drop enum types ───────────────────────────────────────────────────────
  await db.execute(sql`
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_logo_cloud_surface";
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_logo_cloud_variant";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_logo_cloud_surface";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_logo_cloud_variant";

    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_quote_surface";
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_quote_variant";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_quote_surface";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_quote_variant";

    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_stats_surface";
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_stats_variant";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_stats_surface";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_stats_variant";

    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_faq_surface";
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_faq_variant";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_faq_surface";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_faq_variant";

    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_cta_surface";
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_cta_variant";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_cta_surface";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_cta_variant";

    DROP TYPE IF EXISTS "public"."pg_feat_grid_icon_type";

    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_feature_grid_surface";
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_feature_grid_variant";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_feature_grid_surface";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_feature_grid_variant";

    DROP TYPE IF EXISTS "public"."pg_txt_vis_aspect_ratio";

    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_text_visual_surface";
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_text_visual_variant";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_text_visual_surface";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_text_visual_variant";

    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_hero_media_position";
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_hero_surface";
    DROP TYPE IF EXISTS "public"."enum__content_items_v_blocks_page_hero_variant";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_hero_media_position";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_hero_surface";
    DROP TYPE IF EXISTS "public"."enum_content_items_blocks_page_hero_variant";

    DROP TYPE IF EXISTS "public"."enum__content_items_v_version_page_layout";
    DROP TYPE IF EXISTS "public"."enum_content_items_page_layout";
  `);
}
