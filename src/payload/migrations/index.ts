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
import * as migration_20260529_132935_ds_refinement_fix_visual from './20260529_132935_ds_refinement_fix_visual';

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
    up: migration_20260529_132935_ds_refinement_fix_visual.up,
    down: migration_20260529_132935_ds_refinement_fix_visual.down,
    name: '20260529_132935_ds_refinement_fix_visual'
  },
];
