/**
 * Unistellar adapter — ingest-only stub.
 *
 * STATUS: PARTNERSHIP-GATED. Unistellar's eVscope SDK is closed. Adapter
 * exists so the registry shows "Unistellar" as an option and prompts the
 * user toward partnership-driven import.
 *
 * See outreach/unistellar.md (Franck Marchis, co-founder).
 */

import type { ScopeAdapter } from '../types';

export const unistellarAdapter: ScopeAdapter = {
  vendor: 'unistellar',
  displayName: 'Unistellar eVscope',
  capabilities: {
    canSlew: false,
    canPark: false,
    canSync: false,
    canImportObservations: false,
    hasSessionHistory: true,
  },

  testConnection: async () => {
    throw new Error(
      'Unistellar integration requires partnership — see outreach/unistellar.md',
    );
  },

  getStatus: async () => {
    throw new Error(
      'Unistellar integration requires partnership — see outreach/unistellar.md',
    );
  },
};
