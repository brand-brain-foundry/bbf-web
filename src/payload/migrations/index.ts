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
    name: '20260603_132034_drop_como_funciona_orphan'
  },
];
