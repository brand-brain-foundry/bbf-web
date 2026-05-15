import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'ai-agent');
  CREATE TYPE "public"."enum_entities_kind" AS ENUM('organization', 'person', 'concept', 'tool');
  CREATE TYPE "public"."enum_entities_status" AS ENUM('active', 'deprecated');
  CREATE TYPE "public"."enum_topics_kind" AS ENUM('concept', 'tool', 'sector', 'method');
  CREATE TYPE "public"."enum_topics_status" AS ENUM('active', 'deprecated');
  CREATE TYPE "public"."enum_clusters_tier" AS ENUM('cornerstone', 'pillar', 'cluster');
  CREATE TYPE "public"."enum_clusters_status" AS ENUM('active', 'deprecated');
  CREATE TYPE "public"."enum_content_items_cluster_refs_role" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum_content_items_citations_type" AS ENUM('academic', 'industry', 'primary-source');
  CREATE TYPE "public"."enum_content_items_kind" AS ENUM('cornerstone-page', 'pillar-page', 'cluster-article', 'case', 'episode', 'page', 'post');
  CREATE TYPE "public"."enum_content_items_format" AS ENUM('F-1', 'F-2', 'F-3', 'F-4', 'F-5', 'F-6');
  CREATE TYPE "public"."enum_content_items_layer" AS ENUM('B', 'Z-cross');
  CREATE TYPE "public"."enum_content_items_editorial_state" AS ENUM('A', 'B', 'C', 'D');
  CREATE TYPE "public"."enum_content_items_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__content_items_v_version_cluster_refs_role" AS ENUM('primary', 'secondary');
  CREATE TYPE "public"."enum__content_items_v_version_citations_type" AS ENUM('academic', 'industry', 'primary-source');
  CREATE TYPE "public"."enum__content_items_v_version_kind" AS ENUM('cornerstone-page', 'pillar-page', 'cluster-article', 'case', 'episode', 'page', 'post');
  CREATE TYPE "public"."enum__content_items_v_version_format" AS ENUM('F-1', 'F-2', 'F-3', 'F-4', 'F-5', 'F-6');
  CREATE TYPE "public"."enum__content_items_v_version_layer" AS ENUM('B', 'Z-cross');
  CREATE TYPE "public"."enum__content_items_v_version_editorial_state" AS ENUM('A', 'B', 'C', 'D');
  CREATE TYPE "public"."enum__content_items_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__content_items_v_published_locale" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_surfaces_kind" AS ENUM('web-html', 'json-ld', 'llms-txt', 'llms-full-txt', 'rss', 'open-graph', 'twitter-card', 'sitemap-entry', 'social-atom', 'newsletter-snippet', 'podcast-rss');
  CREATE TYPE "public"."enum_surfaces_locale" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_surfaces_status" AS ENUM('published', 'draft', 'invalid');
  CREATE TYPE "public"."enum_signals_kind" AS ENUM('page-view', 'scroll-depth', 'cta-click', 'newsletter-signup', 'contact-submission', 'ai-citation', 'backlink', 'social-share', 'newsletter-open', 'podcast-listen');
  CREATE TYPE "public"."enum_signals_captured_from" AS ENUM('ga4', 'gsc', 'posthog', 'promptmonitor', 'manual', 'ahrefs');
  CREATE TYPE "public"."enum_redirects_type" AS ENUM('301', '302');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"enable_a_p_i_key" boolean,
  	"api_key" varchar,
  	"api_key_index" varchar,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "entities_alternate_names" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar NOT NULL
  );
  
  CREATE TABLE "entities_same_as" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "entities_person_knows_language" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"iso" varchar
  );
  
  CREATE TABLE "entities_organization_area_served" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"region" varchar
  );
  
  CREATE TABLE "entities_organization_contact_point" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"email" varchar,
  	"telephone" varchar,
  	"type" varchar
  );
  
  CREATE TABLE "entities" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"kind" "enum_entities_kind" NOT NULL,
  	"name" varchar NOT NULL,
  	"external_ids_wikidata" varchar,
  	"external_ids_schema_org" varchar,
  	"external_ids_linkedin" varchar,
  	"external_ids_twitter" varchar,
  	"external_ids_github" varchar,
  	"external_ids_crunchbase" varchar,
  	"person_works_for_id" integer,
  	"person_home_location" varchar,
  	"person_nationality" varchar,
  	"organization_founding_date" timestamp(3) with time zone,
  	"organization_founding_location" varchar,
  	"concept_field" varchar,
  	"tool_category" varchar,
  	"tool_vendor_id" integer,
  	"tool_homepage" varchar,
  	"primary_image_id" integer,
  	"status" "enum_entities_status" DEFAULT 'active' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "entities_locales" (
  	"description" varchar,
  	"long_description" jsonb,
  	"person_job_title" varchar,
  	"concept_definition" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "entities_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"entities_id" integer,
  	"topics_id" integer
  );
  
  CREATE TABLE "topics_search_keywords" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"keyword" varchar NOT NULL
  );
  
  CREATE TABLE "topics" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"kind" "enum_topics_kind" DEFAULT 'concept' NOT NULL,
  	"parent_topic_id" integer,
  	"represented_by_id" integer,
  	"wikidata_q_i_d" varchar,
  	"status" "enum_topics_status" DEFAULT 'active' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "topics_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "clusters_topic_refs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic_id" integer NOT NULL,
  	"weight" numeric DEFAULT 1
  );
  
  CREATE TABLE "clusters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"code" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"tier" "enum_clusters_tier" NOT NULL,
  	"parent_cluster_id" integer,
  	"authority_threshold" numeric DEFAULT 20,
  	"status" "enum_clusters_status" DEFAULT 'active' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "clusters_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"canonical_slug" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "content_items_cluster_refs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"cluster_id" integer,
  	"role" "enum_content_items_cluster_refs_role" DEFAULT 'primary'
  );
  
  CREATE TABLE "content_items_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "content_items_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"block_name" varchar
  );
  
  CREATE TABLE "content_items_blocks_definition" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"definition" varchar,
  	"related_entity_ref_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "content_items_entity_mentions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"same_as" varchar,
  	"weight" numeric DEFAULT 1
  );
  
  CREATE TABLE "content_items_topic_refs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"topic_id" integer,
  	"weight" numeric DEFAULT 1
  );
  
  CREATE TABLE "content_items_citations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"author" varchar,
  	"year" numeric,
  	"url" varchar,
  	"type" "enum_content_items_citations_type"
  );
  
  CREATE TABLE "content_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_content_items_kind",
  	"format" "enum_content_items_format",
  	"layer" "enum_content_items_layer" DEFAULT 'B',
  	"editorial_state" "enum_content_items_editorial_state" DEFAULT 'A',
  	"audits_aud01_informationgain_passed" boolean DEFAULT false,
  	"audits_aud01_informationgain_score" numeric,
  	"audits_aud01_informationgain_note" varchar,
  	"audits_aud02_eeat_passed" boolean DEFAULT false,
  	"audits_aud02_eeat_score" numeric,
  	"audits_aud02_eeat_note" varchar,
  	"audits_aud03_geochecklist_passed" boolean DEFAULT false,
  	"audits_aud03_geochecklist_score" numeric,
  	"audits_aud03_geochecklist_note" varchar,
  	"audits_aud04_voicebbf_passed" boolean DEFAULT false,
  	"audits_aud04_voicebbf_score" numeric,
  	"audits_aud04_voicebbf_note" varchar,
  	"audits_aud05_schema_passed" boolean DEFAULT false,
  	"audits_aud05_schema_score" numeric,
  	"audits_aud05_schema_note" varchar,
  	"audits_aud06_antipatterns_passed" boolean DEFAULT false,
  	"audits_aud06_antipatterns_score" numeric,
  	"audits_aud06_antipatterns_note" varchar,
  	"audits_aud07_copyedit_passed" boolean DEFAULT false,
  	"audits_aud07_copyedit_score" numeric,
  	"audits_aud07_copyedit_note" varchar,
  	"published_at" timestamp(3) with time zone,
  	"scheduled_at" timestamp(3) with time zone,
  	"ai_generated" boolean DEFAULT false,
  	"ai_model" varchar,
  	"ai_prompt" varchar,
  	"featured_image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_content_items_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "content_items_locales" (
  	"slug" varchar,
  	"title" varchar,
  	"subtitle" varchar,
  	"excerpt" varchar,
  	"canonical_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "content_items_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"entities_id" integer
  );
  
  CREATE TABLE "_content_items_v_version_cluster_refs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"cluster_id" integer,
  	"role" "enum__content_items_v_version_cluster_refs_role" DEFAULT 'primary',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_content_items_v_blocks_rich_text" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"body" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_content_items_v_blocks_faq" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"question" varchar,
  	"answer" jsonb,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_content_items_v_blocks_definition" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"term" varchar,
  	"definition" varchar,
  	"related_entity_ref_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_content_items_v_version_entity_mentions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"entity_id" integer,
  	"same_as" varchar,
  	"weight" numeric DEFAULT 1,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_content_items_v_version_topic_refs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"topic_id" integer,
  	"weight" numeric DEFAULT 1,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_content_items_v_version_citations" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"author" varchar,
  	"year" numeric,
  	"url" varchar,
  	"type" "enum__content_items_v_version_citations_type",
  	"_uuid" varchar
  );
  
  CREATE TABLE "_content_items_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_kind" "enum__content_items_v_version_kind",
  	"version_format" "enum__content_items_v_version_format",
  	"version_layer" "enum__content_items_v_version_layer" DEFAULT 'B',
  	"version_editorial_state" "enum__content_items_v_version_editorial_state" DEFAULT 'A',
  	"version_audits_aud01_informationgain_passed" boolean DEFAULT false,
  	"version_audits_aud01_informationgain_score" numeric,
  	"version_audits_aud01_informationgain_note" varchar,
  	"version_audits_aud02_eeat_passed" boolean DEFAULT false,
  	"version_audits_aud02_eeat_score" numeric,
  	"version_audits_aud02_eeat_note" varchar,
  	"version_audits_aud03_geochecklist_passed" boolean DEFAULT false,
  	"version_audits_aud03_geochecklist_score" numeric,
  	"version_audits_aud03_geochecklist_note" varchar,
  	"version_audits_aud04_voicebbf_passed" boolean DEFAULT false,
  	"version_audits_aud04_voicebbf_score" numeric,
  	"version_audits_aud04_voicebbf_note" varchar,
  	"version_audits_aud05_schema_passed" boolean DEFAULT false,
  	"version_audits_aud05_schema_score" numeric,
  	"version_audits_aud05_schema_note" varchar,
  	"version_audits_aud06_antipatterns_passed" boolean DEFAULT false,
  	"version_audits_aud06_antipatterns_score" numeric,
  	"version_audits_aud06_antipatterns_note" varchar,
  	"version_audits_aud07_copyedit_passed" boolean DEFAULT false,
  	"version_audits_aud07_copyedit_score" numeric,
  	"version_audits_aud07_copyedit_note" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_scheduled_at" timestamp(3) with time zone,
  	"version_ai_generated" boolean DEFAULT false,
  	"version_ai_model" varchar,
  	"version_ai_prompt" varchar,
  	"version_featured_image_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__content_items_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__content_items_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_content_items_v_locales" (
  	"version_slug" varchar,
  	"version_title" varchar,
  	"version_subtitle" varchar,
  	"version_excerpt" varchar,
  	"version_canonical_url" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_content_items_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"entities_id" integer
  );
  
  CREATE TABLE "surfaces" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"kind" "enum_surfaces_kind" NOT NULL,
  	"content_item_ref_id" integer NOT NULL,
  	"locale" "enum_surfaces_locale" NOT NULL,
  	"output" jsonb,
  	"generated_at" timestamp(3) with time zone,
  	"generator_version" varchar,
  	"status" "enum_surfaces_status" DEFAULT 'published',
  	"validations_schema_org_valid" boolean,
  	"validations_core_web_vitals_ok" boolean,
  	"validations_length_ok" boolean,
  	"validations_content_parity" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "signals" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_signals_kind" NOT NULL,
  	"content_item_ref_id" integer,
  	"entity_ref_id" integer,
  	"data" jsonb,
  	"occurred_at" timestamp(3) with time zone NOT NULL,
  	"captured_from" "enum_signals_captured_from" NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "redirects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"from" varchar NOT NULL,
  	"to" varchar NOT NULL,
  	"type" "enum_redirects_type" DEFAULT '301' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"entities_id" integer,
  	"topics_id" integer,
  	"clusters_id" integer,
  	"content_items_id" integer,
  	"surfaces_id" integer,
  	"signals_id" integer,
  	"redirects_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"base_url" varchar DEFAULT 'https://brandbrainfoundry.com' NOT NULL,
  	"organization_entity_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_locales" (
  	"name" varchar NOT NULL,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "navigation_main_children" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_main" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "navigation_footer" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"section_title" varchar
  );
  
  CREATE TABLE "navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "social_links" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"linkedin" varchar,
  	"twitter" varchar,
  	"github" varchar,
  	"youtube" varchar,
  	"instagram" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_defaults" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title_template" varchar DEFAULT '%s — BBF',
  	"default_og_image_id" integer,
  	"twitter_handle" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "seo_defaults_locales" (
  	"default_title" varchar,
  	"default_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "brand_system" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"colors_primary" varchar DEFAULT '#000000',
  	"colors_background" varchar DEFAULT '#FFFFFF',
  	"colors_accent" varchar,
  	"typography_display_family" varchar DEFAULT 'Outfit',
  	"typography_body_family" varchar DEFAULT 'Mulish',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_alternate_names" ADD CONSTRAINT "entities_alternate_names_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_same_as" ADD CONSTRAINT "entities_same_as_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_person_knows_language" ADD CONSTRAINT "entities_person_knows_language_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_organization_area_served" ADD CONSTRAINT "entities_organization_area_served_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_organization_contact_point" ADD CONSTRAINT "entities_organization_contact_point_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities" ADD CONSTRAINT "entities_person_works_for_id_entities_id_fk" FOREIGN KEY ("person_works_for_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "entities" ADD CONSTRAINT "entities_tool_vendor_id_entities_id_fk" FOREIGN KEY ("tool_vendor_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "entities" ADD CONSTRAINT "entities_primary_image_id_media_id_fk" FOREIGN KEY ("primary_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "entities_locales" ADD CONSTRAINT "entities_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_rels" ADD CONSTRAINT "entities_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_rels" ADD CONSTRAINT "entities_rels_entities_fk" FOREIGN KEY ("entities_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "entities_rels" ADD CONSTRAINT "entities_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "topics_search_keywords" ADD CONSTRAINT "topics_search_keywords_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "topics" ADD CONSTRAINT "topics_parent_topic_id_topics_id_fk" FOREIGN KEY ("parent_topic_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "topics" ADD CONSTRAINT "topics_represented_by_id_entities_id_fk" FOREIGN KEY ("represented_by_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "topics_locales" ADD CONSTRAINT "topics_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clusters_topic_refs" ADD CONSTRAINT "clusters_topic_refs_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clusters_topic_refs" ADD CONSTRAINT "clusters_topic_refs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clusters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "clusters" ADD CONSTRAINT "clusters_parent_cluster_id_clusters_id_fk" FOREIGN KEY ("parent_cluster_id") REFERENCES "public"."clusters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "clusters_locales" ADD CONSTRAINT "clusters_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."clusters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items_cluster_refs" ADD CONSTRAINT "content_items_cluster_refs_cluster_id_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."clusters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_items_cluster_refs" ADD CONSTRAINT "content_items_cluster_refs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items_blocks_rich_text" ADD CONSTRAINT "content_items_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items_blocks_faq" ADD CONSTRAINT "content_items_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items_blocks_definition" ADD CONSTRAINT "content_items_blocks_definition_related_entity_ref_id_entities_id_fk" FOREIGN KEY ("related_entity_ref_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_items_blocks_definition" ADD CONSTRAINT "content_items_blocks_definition_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items_entity_mentions" ADD CONSTRAINT "content_items_entity_mentions_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_items_entity_mentions" ADD CONSTRAINT "content_items_entity_mentions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items_topic_refs" ADD CONSTRAINT "content_items_topic_refs_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_items_topic_refs" ADD CONSTRAINT "content_items_topic_refs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items_citations" ADD CONSTRAINT "content_items_citations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items" ADD CONSTRAINT "content_items_featured_image_id_media_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "content_items_locales" ADD CONSTRAINT "content_items_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items_rels" ADD CONSTRAINT "content_items_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "content_items_rels" ADD CONSTRAINT "content_items_rels_entities_fk" FOREIGN KEY ("entities_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v_version_cluster_refs" ADD CONSTRAINT "_content_items_v_version_cluster_refs_cluster_id_clusters_id_fk" FOREIGN KEY ("cluster_id") REFERENCES "public"."clusters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_items_v_version_cluster_refs" ADD CONSTRAINT "_content_items_v_version_cluster_refs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v_blocks_rich_text" ADD CONSTRAINT "_content_items_v_blocks_rich_text_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v_blocks_faq" ADD CONSTRAINT "_content_items_v_blocks_faq_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v_blocks_definition" ADD CONSTRAINT "_content_items_v_blocks_definition_related_entity_ref_id_entities_id_fk" FOREIGN KEY ("related_entity_ref_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_items_v_blocks_definition" ADD CONSTRAINT "_content_items_v_blocks_definition_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v_version_entity_mentions" ADD CONSTRAINT "_content_items_v_version_entity_mentions_entity_id_entities_id_fk" FOREIGN KEY ("entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_items_v_version_entity_mentions" ADD CONSTRAINT "_content_items_v_version_entity_mentions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v_version_topic_refs" ADD CONSTRAINT "_content_items_v_version_topic_refs_topic_id_topics_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topics"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_items_v_version_topic_refs" ADD CONSTRAINT "_content_items_v_version_topic_refs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v_version_citations" ADD CONSTRAINT "_content_items_v_version_citations_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v" ADD CONSTRAINT "_content_items_v_parent_id_content_items_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."content_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_items_v" ADD CONSTRAINT "_content_items_v_version_featured_image_id_media_id_fk" FOREIGN KEY ("version_featured_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_content_items_v_locales" ADD CONSTRAINT "_content_items_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_content_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v_rels" ADD CONSTRAINT "_content_items_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_content_items_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_content_items_v_rels" ADD CONSTRAINT "_content_items_v_rels_entities_fk" FOREIGN KEY ("entities_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "surfaces" ADD CONSTRAINT "surfaces_content_item_ref_id_content_items_id_fk" FOREIGN KEY ("content_item_ref_id") REFERENCES "public"."content_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "signals" ADD CONSTRAINT "signals_content_item_ref_id_content_items_id_fk" FOREIGN KEY ("content_item_ref_id") REFERENCES "public"."content_items"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "signals" ADD CONSTRAINT "signals_entity_ref_id_entities_id_fk" FOREIGN KEY ("entity_ref_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_entities_fk" FOREIGN KEY ("entities_id") REFERENCES "public"."entities"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_topics_fk" FOREIGN KEY ("topics_id") REFERENCES "public"."topics"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_clusters_fk" FOREIGN KEY ("clusters_id") REFERENCES "public"."clusters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_content_items_fk" FOREIGN KEY ("content_items_id") REFERENCES "public"."content_items"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_surfaces_fk" FOREIGN KEY ("surfaces_id") REFERENCES "public"."surfaces"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_signals_fk" FOREIGN KEY ("signals_id") REFERENCES "public"."signals"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_redirects_fk" FOREIGN KEY ("redirects_id") REFERENCES "public"."redirects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site" ADD CONSTRAINT "site_organization_entity_id_entities_id_fk" FOREIGN KEY ("organization_entity_id") REFERENCES "public"."entities"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_locales" ADD CONSTRAINT "site_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main_children" ADD CONSTRAINT "navigation_main_children_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_main"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_main" ADD CONSTRAINT "navigation_main_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer_links" ADD CONSTRAINT "navigation_footer_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation_footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "navigation_footer" ADD CONSTRAINT "navigation_footer_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."navigation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "seo_defaults" ADD CONSTRAINT "seo_defaults_default_og_image_id_media_id_fk" FOREIGN KEY ("default_og_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "seo_defaults_locales" ADD CONSTRAINT "seo_defaults_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."seo_defaults"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "entities_alternate_names_order_idx" ON "entities_alternate_names" USING btree ("_order");
  CREATE INDEX "entities_alternate_names_parent_id_idx" ON "entities_alternate_names" USING btree ("_parent_id");
  CREATE INDEX "entities_alternate_names_locale_idx" ON "entities_alternate_names" USING btree ("_locale");
  CREATE INDEX "entities_same_as_order_idx" ON "entities_same_as" USING btree ("_order");
  CREATE INDEX "entities_same_as_parent_id_idx" ON "entities_same_as" USING btree ("_parent_id");
  CREATE INDEX "entities_person_knows_language_order_idx" ON "entities_person_knows_language" USING btree ("_order");
  CREATE INDEX "entities_person_knows_language_parent_id_idx" ON "entities_person_knows_language" USING btree ("_parent_id");
  CREATE INDEX "entities_organization_area_served_order_idx" ON "entities_organization_area_served" USING btree ("_order");
  CREATE INDEX "entities_organization_area_served_parent_id_idx" ON "entities_organization_area_served" USING btree ("_parent_id");
  CREATE INDEX "entities_organization_contact_point_order_idx" ON "entities_organization_contact_point" USING btree ("_order");
  CREATE INDEX "entities_organization_contact_point_parent_id_idx" ON "entities_organization_contact_point" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "entities_slug_idx" ON "entities" USING btree ("slug");
  CREATE INDEX "entities_kind_idx" ON "entities" USING btree ("kind");
  CREATE INDEX "entities_person_person_works_for_idx" ON "entities" USING btree ("person_works_for_id");
  CREATE INDEX "entities_tool_tool_vendor_idx" ON "entities" USING btree ("tool_vendor_id");
  CREATE INDEX "entities_primary_image_idx" ON "entities" USING btree ("primary_image_id");
  CREATE INDEX "entities_updated_at_idx" ON "entities" USING btree ("updated_at");
  CREATE INDEX "entities_created_at_idx" ON "entities" USING btree ("created_at");
  CREATE UNIQUE INDEX "entities_locales_locale_parent_id_unique" ON "entities_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "entities_rels_order_idx" ON "entities_rels" USING btree ("order");
  CREATE INDEX "entities_rels_parent_idx" ON "entities_rels" USING btree ("parent_id");
  CREATE INDEX "entities_rels_path_idx" ON "entities_rels" USING btree ("path");
  CREATE INDEX "entities_rels_entities_id_idx" ON "entities_rels" USING btree ("entities_id");
  CREATE INDEX "entities_rels_topics_id_idx" ON "entities_rels" USING btree ("topics_id");
  CREATE INDEX "topics_search_keywords_order_idx" ON "topics_search_keywords" USING btree ("_order");
  CREATE INDEX "topics_search_keywords_parent_id_idx" ON "topics_search_keywords" USING btree ("_parent_id");
  CREATE INDEX "topics_search_keywords_locale_idx" ON "topics_search_keywords" USING btree ("_locale");
  CREATE UNIQUE INDEX "topics_slug_idx" ON "topics" USING btree ("slug");
  CREATE INDEX "topics_parent_topic_idx" ON "topics" USING btree ("parent_topic_id");
  CREATE INDEX "topics_represented_by_idx" ON "topics" USING btree ("represented_by_id");
  CREATE INDEX "topics_updated_at_idx" ON "topics" USING btree ("updated_at");
  CREATE INDEX "topics_created_at_idx" ON "topics" USING btree ("created_at");
  CREATE UNIQUE INDEX "topics_locales_locale_parent_id_unique" ON "topics_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "clusters_topic_refs_order_idx" ON "clusters_topic_refs" USING btree ("_order");
  CREATE INDEX "clusters_topic_refs_parent_id_idx" ON "clusters_topic_refs" USING btree ("_parent_id");
  CREATE INDEX "clusters_topic_refs_topic_idx" ON "clusters_topic_refs" USING btree ("topic_id");
  CREATE UNIQUE INDEX "clusters_code_idx" ON "clusters" USING btree ("code");
  CREATE UNIQUE INDEX "clusters_slug_idx" ON "clusters" USING btree ("slug");
  CREATE INDEX "clusters_parent_cluster_idx" ON "clusters" USING btree ("parent_cluster_id");
  CREATE INDEX "clusters_updated_at_idx" ON "clusters" USING btree ("updated_at");
  CREATE INDEX "clusters_created_at_idx" ON "clusters" USING btree ("created_at");
  CREATE UNIQUE INDEX "clusters_locales_locale_parent_id_unique" ON "clusters_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "content_items_cluster_refs_order_idx" ON "content_items_cluster_refs" USING btree ("_order");
  CREATE INDEX "content_items_cluster_refs_parent_id_idx" ON "content_items_cluster_refs" USING btree ("_parent_id");
  CREATE INDEX "content_items_cluster_refs_cluster_idx" ON "content_items_cluster_refs" USING btree ("cluster_id");
  CREATE INDEX "content_items_blocks_rich_text_order_idx" ON "content_items_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "content_items_blocks_rich_text_parent_id_idx" ON "content_items_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "content_items_blocks_rich_text_path_idx" ON "content_items_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "content_items_blocks_rich_text_locale_idx" ON "content_items_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "content_items_blocks_faq_order_idx" ON "content_items_blocks_faq" USING btree ("_order");
  CREATE INDEX "content_items_blocks_faq_parent_id_idx" ON "content_items_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "content_items_blocks_faq_path_idx" ON "content_items_blocks_faq" USING btree ("_path");
  CREATE INDEX "content_items_blocks_faq_locale_idx" ON "content_items_blocks_faq" USING btree ("_locale");
  CREATE INDEX "content_items_blocks_definition_order_idx" ON "content_items_blocks_definition" USING btree ("_order");
  CREATE INDEX "content_items_blocks_definition_parent_id_idx" ON "content_items_blocks_definition" USING btree ("_parent_id");
  CREATE INDEX "content_items_blocks_definition_path_idx" ON "content_items_blocks_definition" USING btree ("_path");
  CREATE INDEX "content_items_blocks_definition_locale_idx" ON "content_items_blocks_definition" USING btree ("_locale");
  CREATE INDEX "content_items_blocks_definition_related_entity_ref_idx" ON "content_items_blocks_definition" USING btree ("related_entity_ref_id");
  CREATE INDEX "content_items_entity_mentions_order_idx" ON "content_items_entity_mentions" USING btree ("_order");
  CREATE INDEX "content_items_entity_mentions_parent_id_idx" ON "content_items_entity_mentions" USING btree ("_parent_id");
  CREATE INDEX "content_items_entity_mentions_entity_idx" ON "content_items_entity_mentions" USING btree ("entity_id");
  CREATE INDEX "content_items_topic_refs_order_idx" ON "content_items_topic_refs" USING btree ("_order");
  CREATE INDEX "content_items_topic_refs_parent_id_idx" ON "content_items_topic_refs" USING btree ("_parent_id");
  CREATE INDEX "content_items_topic_refs_topic_idx" ON "content_items_topic_refs" USING btree ("topic_id");
  CREATE INDEX "content_items_citations_order_idx" ON "content_items_citations" USING btree ("_order");
  CREATE INDEX "content_items_citations_parent_id_idx" ON "content_items_citations" USING btree ("_parent_id");
  CREATE INDEX "content_items_kind_idx" ON "content_items" USING btree ("kind");
  CREATE INDEX "content_items_featured_image_idx" ON "content_items" USING btree ("featured_image_id");
  CREATE INDEX "content_items_updated_at_idx" ON "content_items" USING btree ("updated_at");
  CREATE INDEX "content_items_created_at_idx" ON "content_items" USING btree ("created_at");
  CREATE INDEX "content_items__status_idx" ON "content_items" USING btree ("_status");
  CREATE INDEX "content_items_slug_idx" ON "content_items_locales" USING btree ("slug","_locale");
  CREATE UNIQUE INDEX "content_items_locales_locale_parent_id_unique" ON "content_items_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "content_items_rels_order_idx" ON "content_items_rels" USING btree ("order");
  CREATE INDEX "content_items_rels_parent_idx" ON "content_items_rels" USING btree ("parent_id");
  CREATE INDEX "content_items_rels_path_idx" ON "content_items_rels" USING btree ("path");
  CREATE INDEX "content_items_rels_entities_id_idx" ON "content_items_rels" USING btree ("entities_id");
  CREATE INDEX "_content_items_v_version_cluster_refs_order_idx" ON "_content_items_v_version_cluster_refs" USING btree ("_order");
  CREATE INDEX "_content_items_v_version_cluster_refs_parent_id_idx" ON "_content_items_v_version_cluster_refs" USING btree ("_parent_id");
  CREATE INDEX "_content_items_v_version_cluster_refs_cluster_idx" ON "_content_items_v_version_cluster_refs" USING btree ("cluster_id");
  CREATE INDEX "_content_items_v_blocks_rich_text_order_idx" ON "_content_items_v_blocks_rich_text" USING btree ("_order");
  CREATE INDEX "_content_items_v_blocks_rich_text_parent_id_idx" ON "_content_items_v_blocks_rich_text" USING btree ("_parent_id");
  CREATE INDEX "_content_items_v_blocks_rich_text_path_idx" ON "_content_items_v_blocks_rich_text" USING btree ("_path");
  CREATE INDEX "_content_items_v_blocks_rich_text_locale_idx" ON "_content_items_v_blocks_rich_text" USING btree ("_locale");
  CREATE INDEX "_content_items_v_blocks_faq_order_idx" ON "_content_items_v_blocks_faq" USING btree ("_order");
  CREATE INDEX "_content_items_v_blocks_faq_parent_id_idx" ON "_content_items_v_blocks_faq" USING btree ("_parent_id");
  CREATE INDEX "_content_items_v_blocks_faq_path_idx" ON "_content_items_v_blocks_faq" USING btree ("_path");
  CREATE INDEX "_content_items_v_blocks_faq_locale_idx" ON "_content_items_v_blocks_faq" USING btree ("_locale");
  CREATE INDEX "_content_items_v_blocks_definition_order_idx" ON "_content_items_v_blocks_definition" USING btree ("_order");
  CREATE INDEX "_content_items_v_blocks_definition_parent_id_idx" ON "_content_items_v_blocks_definition" USING btree ("_parent_id");
  CREATE INDEX "_content_items_v_blocks_definition_path_idx" ON "_content_items_v_blocks_definition" USING btree ("_path");
  CREATE INDEX "_content_items_v_blocks_definition_locale_idx" ON "_content_items_v_blocks_definition" USING btree ("_locale");
  CREATE INDEX "_content_items_v_blocks_definition_related_entity_ref_idx" ON "_content_items_v_blocks_definition" USING btree ("related_entity_ref_id");
  CREATE INDEX "_content_items_v_version_entity_mentions_order_idx" ON "_content_items_v_version_entity_mentions" USING btree ("_order");
  CREATE INDEX "_content_items_v_version_entity_mentions_parent_id_idx" ON "_content_items_v_version_entity_mentions" USING btree ("_parent_id");
  CREATE INDEX "_content_items_v_version_entity_mentions_entity_idx" ON "_content_items_v_version_entity_mentions" USING btree ("entity_id");
  CREATE INDEX "_content_items_v_version_topic_refs_order_idx" ON "_content_items_v_version_topic_refs" USING btree ("_order");
  CREATE INDEX "_content_items_v_version_topic_refs_parent_id_idx" ON "_content_items_v_version_topic_refs" USING btree ("_parent_id");
  CREATE INDEX "_content_items_v_version_topic_refs_topic_idx" ON "_content_items_v_version_topic_refs" USING btree ("topic_id");
  CREATE INDEX "_content_items_v_version_citations_order_idx" ON "_content_items_v_version_citations" USING btree ("_order");
  CREATE INDEX "_content_items_v_version_citations_parent_id_idx" ON "_content_items_v_version_citations" USING btree ("_parent_id");
  CREATE INDEX "_content_items_v_parent_idx" ON "_content_items_v" USING btree ("parent_id");
  CREATE INDEX "_content_items_v_version_version_kind_idx" ON "_content_items_v" USING btree ("version_kind");
  CREATE INDEX "_content_items_v_version_version_featured_image_idx" ON "_content_items_v" USING btree ("version_featured_image_id");
  CREATE INDEX "_content_items_v_version_version_updated_at_idx" ON "_content_items_v" USING btree ("version_updated_at");
  CREATE INDEX "_content_items_v_version_version_created_at_idx" ON "_content_items_v" USING btree ("version_created_at");
  CREATE INDEX "_content_items_v_version_version__status_idx" ON "_content_items_v" USING btree ("version__status");
  CREATE INDEX "_content_items_v_created_at_idx" ON "_content_items_v" USING btree ("created_at");
  CREATE INDEX "_content_items_v_updated_at_idx" ON "_content_items_v" USING btree ("updated_at");
  CREATE INDEX "_content_items_v_snapshot_idx" ON "_content_items_v" USING btree ("snapshot");
  CREATE INDEX "_content_items_v_published_locale_idx" ON "_content_items_v" USING btree ("published_locale");
  CREATE INDEX "_content_items_v_latest_idx" ON "_content_items_v" USING btree ("latest");
  CREATE INDEX "_content_items_v_autosave_idx" ON "_content_items_v" USING btree ("autosave");
  CREATE INDEX "_content_items_v_version_version_slug_idx" ON "_content_items_v_locales" USING btree ("version_slug","_locale");
  CREATE UNIQUE INDEX "_content_items_v_locales_locale_parent_id_unique" ON "_content_items_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_content_items_v_rels_order_idx" ON "_content_items_v_rels" USING btree ("order");
  CREATE INDEX "_content_items_v_rels_parent_idx" ON "_content_items_v_rels" USING btree ("parent_id");
  CREATE INDEX "_content_items_v_rels_path_idx" ON "_content_items_v_rels" USING btree ("path");
  CREATE INDEX "_content_items_v_rels_entities_id_idx" ON "_content_items_v_rels" USING btree ("entities_id");
  CREATE INDEX "surfaces_slug_idx" ON "surfaces" USING btree ("slug");
  CREATE INDEX "surfaces_kind_idx" ON "surfaces" USING btree ("kind");
  CREATE INDEX "surfaces_content_item_ref_idx" ON "surfaces" USING btree ("content_item_ref_id");
  CREATE INDEX "surfaces_updated_at_idx" ON "surfaces" USING btree ("updated_at");
  CREATE INDEX "surfaces_created_at_idx" ON "surfaces" USING btree ("created_at");
  CREATE INDEX "signals_kind_idx" ON "signals" USING btree ("kind");
  CREATE INDEX "signals_content_item_ref_idx" ON "signals" USING btree ("content_item_ref_id");
  CREATE INDEX "signals_entity_ref_idx" ON "signals" USING btree ("entity_ref_id");
  CREATE INDEX "signals_occurred_at_idx" ON "signals" USING btree ("occurred_at");
  CREATE INDEX "signals_updated_at_idx" ON "signals" USING btree ("updated_at");
  CREATE INDEX "signals_created_at_idx" ON "signals" USING btree ("created_at");
  CREATE UNIQUE INDEX "redirects_from_idx" ON "redirects" USING btree ("from");
  CREATE INDEX "redirects_updated_at_idx" ON "redirects" USING btree ("updated_at");
  CREATE INDEX "redirects_created_at_idx" ON "redirects" USING btree ("created_at");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_entities_id_idx" ON "payload_locked_documents_rels" USING btree ("entities_id");
  CREATE INDEX "payload_locked_documents_rels_topics_id_idx" ON "payload_locked_documents_rels" USING btree ("topics_id");
  CREATE INDEX "payload_locked_documents_rels_clusters_id_idx" ON "payload_locked_documents_rels" USING btree ("clusters_id");
  CREATE INDEX "payload_locked_documents_rels_content_items_id_idx" ON "payload_locked_documents_rels" USING btree ("content_items_id");
  CREATE INDEX "payload_locked_documents_rels_surfaces_id_idx" ON "payload_locked_documents_rels" USING btree ("surfaces_id");
  CREATE INDEX "payload_locked_documents_rels_signals_id_idx" ON "payload_locked_documents_rels" USING btree ("signals_id");
  CREATE INDEX "payload_locked_documents_rels_redirects_id_idx" ON "payload_locked_documents_rels" USING btree ("redirects_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_organization_entity_idx" ON "site" USING btree ("organization_entity_id");
  CREATE UNIQUE INDEX "site_locales_locale_parent_id_unique" ON "site_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "navigation_main_children_order_idx" ON "navigation_main_children" USING btree ("_order");
  CREATE INDEX "navigation_main_children_parent_id_idx" ON "navigation_main_children" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_children_locale_idx" ON "navigation_main_children" USING btree ("_locale");
  CREATE INDEX "navigation_main_order_idx" ON "navigation_main" USING btree ("_order");
  CREATE INDEX "navigation_main_parent_id_idx" ON "navigation_main" USING btree ("_parent_id");
  CREATE INDEX "navigation_main_locale_idx" ON "navigation_main" USING btree ("_locale");
  CREATE INDEX "navigation_footer_links_order_idx" ON "navigation_footer_links" USING btree ("_order");
  CREATE INDEX "navigation_footer_links_parent_id_idx" ON "navigation_footer_links" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_links_locale_idx" ON "navigation_footer_links" USING btree ("_locale");
  CREATE INDEX "navigation_footer_order_idx" ON "navigation_footer" USING btree ("_order");
  CREATE INDEX "navigation_footer_parent_id_idx" ON "navigation_footer" USING btree ("_parent_id");
  CREATE INDEX "navigation_footer_locale_idx" ON "navigation_footer" USING btree ("_locale");
  CREATE INDEX "seo_defaults_default_og_image_idx" ON "seo_defaults" USING btree ("default_og_image_id");
  CREATE UNIQUE INDEX "seo_defaults_locales_locale_parent_id_unique" ON "seo_defaults_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "entities_alternate_names" CASCADE;
  DROP TABLE "entities_same_as" CASCADE;
  DROP TABLE "entities_person_knows_language" CASCADE;
  DROP TABLE "entities_organization_area_served" CASCADE;
  DROP TABLE "entities_organization_contact_point" CASCADE;
  DROP TABLE "entities" CASCADE;
  DROP TABLE "entities_locales" CASCADE;
  DROP TABLE "entities_rels" CASCADE;
  DROP TABLE "topics_search_keywords" CASCADE;
  DROP TABLE "topics" CASCADE;
  DROP TABLE "topics_locales" CASCADE;
  DROP TABLE "clusters_topic_refs" CASCADE;
  DROP TABLE "clusters" CASCADE;
  DROP TABLE "clusters_locales" CASCADE;
  DROP TABLE "content_items_cluster_refs" CASCADE;
  DROP TABLE "content_items_blocks_rich_text" CASCADE;
  DROP TABLE "content_items_blocks_faq" CASCADE;
  DROP TABLE "content_items_blocks_definition" CASCADE;
  DROP TABLE "content_items_entity_mentions" CASCADE;
  DROP TABLE "content_items_topic_refs" CASCADE;
  DROP TABLE "content_items_citations" CASCADE;
  DROP TABLE "content_items" CASCADE;
  DROP TABLE "content_items_locales" CASCADE;
  DROP TABLE "content_items_rels" CASCADE;
  DROP TABLE "_content_items_v_version_cluster_refs" CASCADE;
  DROP TABLE "_content_items_v_blocks_rich_text" CASCADE;
  DROP TABLE "_content_items_v_blocks_faq" CASCADE;
  DROP TABLE "_content_items_v_blocks_definition" CASCADE;
  DROP TABLE "_content_items_v_version_entity_mentions" CASCADE;
  DROP TABLE "_content_items_v_version_topic_refs" CASCADE;
  DROP TABLE "_content_items_v_version_citations" CASCADE;
  DROP TABLE "_content_items_v" CASCADE;
  DROP TABLE "_content_items_v_locales" CASCADE;
  DROP TABLE "_content_items_v_rels" CASCADE;
  DROP TABLE "surfaces" CASCADE;
  DROP TABLE "signals" CASCADE;
  DROP TABLE "redirects" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TABLE "site_locales" CASCADE;
  DROP TABLE "navigation_main_children" CASCADE;
  DROP TABLE "navigation_main" CASCADE;
  DROP TABLE "navigation_footer_links" CASCADE;
  DROP TABLE "navigation_footer" CASCADE;
  DROP TABLE "navigation" CASCADE;
  DROP TABLE "social_links" CASCADE;
  DROP TABLE "seo_defaults" CASCADE;
  DROP TABLE "seo_defaults_locales" CASCADE;
  DROP TABLE "brand_system" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_entities_kind";
  DROP TYPE "public"."enum_entities_status";
  DROP TYPE "public"."enum_topics_kind";
  DROP TYPE "public"."enum_topics_status";
  DROP TYPE "public"."enum_clusters_tier";
  DROP TYPE "public"."enum_clusters_status";
  DROP TYPE "public"."enum_content_items_cluster_refs_role";
  DROP TYPE "public"."enum_content_items_citations_type";
  DROP TYPE "public"."enum_content_items_kind";
  DROP TYPE "public"."enum_content_items_format";
  DROP TYPE "public"."enum_content_items_layer";
  DROP TYPE "public"."enum_content_items_editorial_state";
  DROP TYPE "public"."enum_content_items_status";
  DROP TYPE "public"."enum__content_items_v_version_cluster_refs_role";
  DROP TYPE "public"."enum__content_items_v_version_citations_type";
  DROP TYPE "public"."enum__content_items_v_version_kind";
  DROP TYPE "public"."enum__content_items_v_version_format";
  DROP TYPE "public"."enum__content_items_v_version_layer";
  DROP TYPE "public"."enum__content_items_v_version_editorial_state";
  DROP TYPE "public"."enum__content_items_v_version_status";
  DROP TYPE "public"."enum__content_items_v_published_locale";
  DROP TYPE "public"."enum_surfaces_kind";
  DROP TYPE "public"."enum_surfaces_locale";
  DROP TYPE "public"."enum_surfaces_status";
  DROP TYPE "public"."enum_signals_kind";
  DROP TYPE "public"."enum_signals_captured_from";
  DROP TYPE "public"."enum_redirects_type";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
