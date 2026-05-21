import * as migration_20260515_175435 from './20260515_175435';
import * as migration_20260520_184200_wave2_site_globals from './20260520_184200_wave2_site_globals';
import * as migration_20260520_185709_wave4_site_newsletter from './20260520_185709_wave4_site_newsletter';
import * as migration_20260521_102000_wave8_megamenu_sublinks from './20260521_102000_wave8_megamenu_sublinks';
import * as migration_20260521_120000_wave9_footer_groups from './20260521_120000_wave9_footer_groups';

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
];
