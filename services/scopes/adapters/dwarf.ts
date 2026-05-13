/**
 * Dwarf Lab adapter (Dwarf 2 / 3 / Mini).
 *
 * STATUS: STUB. Dwarf uses a proprietary WebSocket + protobuf API
 * (`dwarfii_api`) rather than ASCOM Alpaca, so this adapter cannot reuse
 * the alpacaTransport. The full implementation requires a protobuf .proto
 * compile step + WebSocket connection management. Tracked for milestone-2.
 *
 * For v0.1 the adapter surface exists so the registry can list "Dwarf"
 * as an option and the connect screen renders the appropriate help text.
 */

import type { ScopeAdapter } from '../types';

export const dwarfAdapter: ScopeAdapter = {
  vendor: 'dwarf',
  displayName: 'Dwarf Lab',
  capabilities: {
    canSlew: false,
    canPark: false,
    canSync: false,
    canImportObservations: false,
    hasSessionHistory: true,
  },

  testConnection: async () => {
    throw new Error('Dwarf adapter not yet implemented — milestone-2');
  },

  getStatus: async () => {
    throw new Error('Dwarf adapter not yet implemented — milestone-2');
  },
};
