import * as migration_20260515_175435 from './20260515_175435';
import * as migration_20260520_184200_wave2_site_globals from './20260520_184200_wave2_site_globals';
import * as migration_20260520_185709_wave4_site_newsletter from './20260520_185709_wave4_site_newsletter';
import * as migration_20260521_102000_wave8_megamenu_sublinks from './20260521_102000_wave8_megamenu_sublinks';
import * as migration_20260521_120000_wave9_footer_groups from './20260521_120000_wave9_footer_groups';
import * as migration_20260521_240000_wave10b1_revert_drop_pageblocks from './20260521_240000_wave10b1_revert_drop_pageblocks';
import * as migration_20260525_231150 from './20260525_231150';
import * as migration_20260528_142418_wave_13_site_homepage from './20260528_142418_wave_13_site_homepage';
import * as migration_20260529_083612_wave_14_capabilities_group from './20260529_083612_wave_14_capabilities_group';
import * as migration_20260529_122936_ds_refinement_lissajous_scenes from './20260529_122936_ds_refinement_lissajous_scenes';
import * as migration_20260529_171439_cap_hub_spokes from './20260529_171439_cap_hub_spokes';
import * as migration_20260530_171004_how_it_works_section from './20260530_171004_how_it_works_section';
import * as migration_20260602_120000_case_study_section from './20260602_120000_case_study_section';
import * as migration_20260602_130000_case_study_video from './20260602_130000_case_study_video';
import * as migration_20260602_180339_comparison_section from './20260602_180339_comparison_section';
import * as migration_20260603_074045_method_section from './20260603_074045_method_section';
import * as migration_20260603_111230_closing_section from './20260603_111230_closing_section';
import * as migration_20260603_132034_drop_como_funciona_orphan from './20260603_132034_drop_como_funciona_orphan';
import * as migration_20260605_090223_add_site_config_global from './20260605_090223_add_site_config_global';
import * as migration_20260605_191000_merge_site_identity_into_site_config_then_rename from './20260605_191000_merge_site_identity_into_site_config_then_rename';
import * as migration_20260605_211913_add_cascade_to_capabilities_scene_tables from './20260605_211913_add_cascade_to_capabilities_scene_tables';
import * as migration_20260606_225445_refactor_founder_group_to_founders_array from './20260606_225445_refactor_founder_group_to_founders_array';
import * as migration_20260611_000100_site_identity_knows_about_relationship from './20260611_000100_site_identity_knows_about_relationship';
import * as migration_20260611_000200_site_identity_add_organization_entity from './20260611_000200_site_identity_add_organization_entity';
import * as migration_20260611_000300_drop_site_legacy_global from './20260611_000300_drop_site_legacy_global';
import * as migration_20260612_000100_drop_site_identity_dead_fields from './20260612_000100_drop_site_identity_dead_fields';
import * as migration_20260612_000200_surfaces_d_ontology_03 from './20260612_000200_surfaces_d_ontology_03';
import * as migration_20260612_000300_brand_system_selectors from './20260612_000300_brand_system_selectors';
import * as migration_20260613_120000_wave_4c1_linktarget from './20260613_120000_wave_4c1_linktarget';
import * as migration_20260613_130000_wave_4c1_drop_legacy_href from './20260613_130000_wave_4c1_drop_legacy_href';
import * as migration_20260613_140000_wave_4c1_sublink_linktarget from './20260613_140000_wave_4c1_sublink_linktarget';
import * as migration_20260614_000100_site_cta_library from './20260614_000100_site_cta_library';
import * as migration_20260616_235419_baseline_sync from './20260616_235419_baseline_sync';
import * as migration_20260619_163628_refactor_hero_ctas from './20260619_163628_refactor_hero_ctas';
import * as migration_20260620_200916_add_phase_icon from './20260620_200916_add_phase_icon';
import * as migration_20260621_100817_add_milestones_to_site_homepage from './20260621_100817_add_milestones_to_site_homepage';
import * as migration_20260621_200640_remove_method_quote_fields from './20260621_200640_remove_method_quote_fields';
import * as migration_20260623_083009_add_nav_sublink_icon from './20260623_083009_add_nav_sublink_icon';
import * as migration_20260623_cierre_cta_to_ctakey from './20260623_cierre_cta_to_ctakey';
import * as migration_20260625_185806_wa_chat_scene from './20260625_185806_wa_chat_scene';
import * as migration_20260625_235256_app_screen_scene from './20260625_235256_app_screen_scene';
import * as migration_20260626_101940_wa_agenda_scene from './20260626_101940_wa_agenda_scene';
import * as migration_20260626_132654_integraciones_scene from './20260626_132654_integraciones_scene';
import * as migration_20260626_162438_aprendizaje_scene from './20260626_162438_aprendizaje_scene';
import * as migration_20260627_134353_seo_anchor_faq from './20260627_134353_seo_anchor_faq';

export const migrations = [
  {
    up: migration_20260515_175435.up,
    down: migration_20260515_175435.down,
    name: '20260515_175435',
  },
  {
    up: migration_20260520_184200_wave2_site_globals.up,
    down: migration_20260520_184200_wave2_site_globals.down,
    name: '20260520_184200_wave2_site_globals',
  },
  {
    up: migration_20260520_185709_wave4_site_newsletter.up,
    down: migration_20260520_185709_wave4_site_newsletter.down,
    name: '20260520_185709_wave4_site_newsletter',
  },
  {
    up: migration_20260521_102000_wave8_megamenu_sublinks.up,
    down: migration_20260521_102000_wave8_megamenu_sublinks.down,
    name: '20260521_102000_wave8_megamenu_sublinks',
  },
  {
    up: migration_20260521_120000_wave9_footer_groups.up,
    down: migration_20260521_120000_wave9_footer_groups.down,
    name: '20260521_120000_wave9_footer_groups',
  },
  {
    up: migration_20260521_240000_wave10b1_revert_drop_pageblocks.up,
    down: migration_20260521_240000_wave10b1_revert_drop_pageblocks.down,
    name: '20260521_240000_wave10b1_revert_drop_pageblocks',
  },
  {
    up: migration_20260525_231150.up,
    down: migration_20260525_231150.down,
    name: '20260525_231150',
  },
  {
    up: migration_20260528_142418_wave_13_site_homepage.up,
    down: migration_20260528_142418_wave_13_site_homepage.down,
    name: '20260528_142418_wave_13_site_homepage',
  },
  {
    up: migration_20260529_083612_wave_14_capabilities_group.up,
    down: migration_20260529_083612_wave_14_capabilities_group.down,
    name: '20260529_083612_wave_14_capabilities_group',
  },
  {
    up: migration_20260529_122936_ds_refinement_lissajous_scenes.up,
    down: migration_20260529_122936_ds_refinement_lissajous_scenes.down,
    name: '20260529_122936_ds_refinement_lissajous_scenes',
  },
  {
    up: migration_20260529_171439_cap_hub_spokes.up,
    down: migration_20260529_171439_cap_hub_spokes.down,
    name: '20260529_171439_cap_hub_spokes',
  },
  {
    up: migration_20260530_171004_how_it_works_section.up,
    down: migration_20260530_171004_how_it_works_section.down,
    name: '20260530_171004_how_it_works_section',
  },
  {
    up: migration_20260602_120000_case_study_section.up,
    down: migration_20260602_120000_case_study_section.down,
    name: '20260602_120000_case_study_section',
  },
  {
    up: migration_20260602_130000_case_study_video.up,
    down: migration_20260602_130000_case_study_video.down,
    name: '20260602_130000_case_study_video',
  },
  {
    up: migration_20260602_180339_comparison_section.up,
    down: migration_20260602_180339_comparison_section.down,
    name: '20260602_180339_comparison_section',
  },
  {
    up: migration_20260603_074045_method_section.up,
    down: migration_20260603_074045_method_section.down,
    name: '20260603_074045_method_section',
  },
  {
    up: migration_20260603_111230_closing_section.up,
    down: migration_20260603_111230_closing_section.down,
    name: '20260603_111230_closing_section',
  },
  {
    up: migration_20260603_132034_drop_como_funciona_orphan.up,
    down: migration_20260603_132034_drop_como_funciona_orphan.down,
    name: '20260603_132034_drop_como_funciona_orphan',
  },
  {
    up: migration_20260605_090223_add_site_config_global.up,
    down: migration_20260605_090223_add_site_config_global.down,
    name: '20260605_090223_add_site_config_global',
  },
  {
    up: migration_20260605_191000_merge_site_identity_into_site_config_then_rename.up,
    down: migration_20260605_191000_merge_site_identity_into_site_config_then_rename.down,
    name: '20260605_191000_merge_site_identity_into_site_config_then_rename',
  },
  {
    up: migration_20260605_211913_add_cascade_to_capabilities_scene_tables.up,
    down: migration_20260605_211913_add_cascade_to_capabilities_scene_tables.down,
    name: '20260605_211913_add_cascade_to_capabilities_scene_tables',
  },
  {
    up: migration_20260606_225445_refactor_founder_group_to_founders_array.up,
    down: migration_20260606_225445_refactor_founder_group_to_founders_array.down,
    name: '20260606_225445_refactor_founder_group_to_founders_array',
  },
  {
    up: migration_20260611_000100_site_identity_knows_about_relationship.up,
    down: migration_20260611_000100_site_identity_knows_about_relationship.down,
    name: '20260611_000100_site_identity_knows_about_relationship',
  },
  {
    up: migration_20260611_000200_site_identity_add_organization_entity.up,
    down: migration_20260611_000200_site_identity_add_organization_entity.down,
    name: '20260611_000200_site_identity_add_organization_entity',
  },
  {
    up: migration_20260611_000300_drop_site_legacy_global.up,
    down: migration_20260611_000300_drop_site_legacy_global.down,
    name: '20260611_000300_drop_site_legacy_global',
  },
  {
    up: migration_20260612_000100_drop_site_identity_dead_fields.up,
    down: migration_20260612_000100_drop_site_identity_dead_fields.down,
    name: '20260612_000100_drop_site_identity_dead_fields',
  },
  {
    up: migration_20260612_000200_surfaces_d_ontology_03.up,
    down: migration_20260612_000200_surfaces_d_ontology_03.down,
    name: '20260612_000200_surfaces_d_ontology_03',
  },
  {
    up: migration_20260612_000300_brand_system_selectors.up,
    down: migration_20260612_000300_brand_system_selectors.down,
    name: '20260612_000300_brand_system_selectors',
  },
  {
    up: migration_20260613_120000_wave_4c1_linktarget.up,
    down: migration_20260613_120000_wave_4c1_linktarget.down,
    name: '20260613_120000_wave_4c1_linktarget',
  },
  {
    up: migration_20260613_130000_wave_4c1_drop_legacy_href.up,
    down: migration_20260613_130000_wave_4c1_drop_legacy_href.down,
    name: '20260613_130000_wave_4c1_drop_legacy_href',
  },
  {
    up: migration_20260613_140000_wave_4c1_sublink_linktarget.up,
    down: migration_20260613_140000_wave_4c1_sublink_linktarget.down,
    name: '20260613_140000_wave_4c1_sublink_linktarget',
  },
  {
    up: migration_20260614_000100_site_cta_library.up,
    down: migration_20260614_000100_site_cta_library.down,
    name: '20260614_000100_site_cta_library',
  },
  {
    up: migration_20260616_235419_baseline_sync.up,
    down: migration_20260616_235419_baseline_sync.down,
    name: '20260616_235419_baseline_sync',
  },
  {
    up: migration_20260619_163628_refactor_hero_ctas.up,
    down: migration_20260619_163628_refactor_hero_ctas.down,
    name: '20260619_163628_refactor_hero_ctas',
  },
  {
    up: migration_20260620_200916_add_phase_icon.up,
    down: migration_20260620_200916_add_phase_icon.down,
    name: '20260620_200916_add_phase_icon',
  },
  {
    up: migration_20260621_100817_add_milestones_to_site_homepage.up,
    down: migration_20260621_100817_add_milestones_to_site_homepage.down,
    name: '20260621_100817_add_milestones_to_site_homepage',
  },
  {
    up: migration_20260621_200640_remove_method_quote_fields.up,
    down: migration_20260621_200640_remove_method_quote_fields.down,
    name: '20260621_200640_remove_method_quote_fields',
  },
  {
    up: migration_20260623_083009_add_nav_sublink_icon.up,
    down: migration_20260623_083009_add_nav_sublink_icon.down,
    name: '20260623_083009_add_nav_sublink_icon',
  },
  {
    up: migration_20260623_cierre_cta_to_ctakey.up,
    down: migration_20260623_cierre_cta_to_ctakey.down,
    name: '20260623_cierre_cta_to_ctakey',
  },
  {
    up: migration_20260625_185806_wa_chat_scene.up,
    down: migration_20260625_185806_wa_chat_scene.down,
    name: '20260625_185806_wa_chat_scene',
  },
  {
    up: migration_20260625_235256_app_screen_scene.up,
    down: migration_20260625_235256_app_screen_scene.down,
    name: '20260625_235256_app_screen_scene',
  },
  {
    up: migration_20260626_101940_wa_agenda_scene.up,
    down: migration_20260626_101940_wa_agenda_scene.down,
    name: '20260626_101940_wa_agenda_scene',
  },
  {
    up: migration_20260626_132654_integraciones_scene.up,
    down: migration_20260626_132654_integraciones_scene.down,
    name: '20260626_132654_integraciones_scene',
  },
  {
    up: migration_20260626_162438_aprendizaje_scene.up,
    down: migration_20260626_162438_aprendizaje_scene.down,
    name: '20260626_162438_aprendizaje_scene',
  },
  {
    up: migration_20260627_134353_seo_anchor_faq.up,
    down: migration_20260627_134353_seo_anchor_faq.down,
    name: '20260627_134353_seo_anchor_faq'
  },
];
