/**
 * Vaonis Vespera adapter — ingest-only stub.
 *
 * STATUS: PARTNERSHIP-GATED. Vaonis Singularity is a closed app with no
 * public SDK. This adapter exists so the registry shows "Vespera" as an
 * option and prompts the user toward the partnership-driven import flow
 * (future: Singularity export → Astra Vault ingest endpoint).
 *
 * See outreach/vaonis.md for the partnership track.
 */

import type { ScopeAdapter } from '../types';

export const vesperaAdapter: ScopeAdapter = {
  vendor: 'vespera',
  displayName: 'Vaonis Vespera',
  capabilities: {
    canSlew: false,
    canPark: false,
    canSync: false,
    canImportObservations: false,
    hasSessionHistory: true,
  },

  testConnection: async () => {
    throw new Error(
      'Vespera integration requires Vaonis partnership — see outreach/vaonis.md',
    );
  },

  getStatus: async () => {
    throw new Error(
      'Vespera integration requires Vaonis partnership — see outreach/vaonis.md',
    );
  },
};
