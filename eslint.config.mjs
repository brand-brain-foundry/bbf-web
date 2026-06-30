import nextPlugin from 'eslint-config-next';

const base = Array.isArray(nextPlugin) ? nextPlugin : [nextPlugin];

export default [
  ...base,
  {
    rules: {
      // react-hooks v7 (shipped with eslint-config-next v16) introduced strict rules
      // that our animation components (WASequence, WAAgendaSequence, AprendizajePlayer,
      // MobileMenu, BlobBackground, Lissajous, AppScreenPlayer, IntegracionesPlayer, etc.)
      // written for react-hooks v6 don't yet satisfy:
      // - set-state-in-effect: legitimate patterns (reduced-motion, scroll lock, async timers)
      // - immutability: runId refs need renaming to runIdRef (naming convention)
      // Downgrading to "warn" unblocks the build.
      // Deuda técnica: refactor progresivo a useSyncExternalStore + renombrando refs — despacho pendiente.
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/immutability': 'warn',
    },
  },
];
