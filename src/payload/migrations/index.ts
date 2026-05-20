import * as migration_20260515_175435 from './20260515_175435';
import * as migration_20260520_184200_wave2_site_globals from './20260520_184200_wave2_site_globals';
import * as migration_20260520_185709_wave4_site_newsletter from './20260520_185709_wave4_site_newsletter';

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
    name: '20260520_185709_wave4_site_newsletter'
  },
];
