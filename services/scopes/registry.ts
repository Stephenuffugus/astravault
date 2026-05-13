/**
 * Adapter registry — single point of truth for "which scope vendor maps
 * to which adapter."
 */

import { seestarAdapter } from './adapters/seestar';
import { dwarfAdapter } from './adapters/dwarf';
import { vesperaAdapter } from './adapters/vespera';
import { unistellarAdapter } from './adapters/unistellar';
import type { ScopeAdapter, ScopeVendor } from './types';

const ADAPTERS: Record<ScopeVendor, ScopeAdapter> = {
  seestar: seestarAdapter,
  dwarf: dwarfAdapter,
  vespera: vesperaAdapter,
  unistellar: unistellarAdapter,
  generic_alpaca: { ...seestarAdapter, vendor: 'generic_alpaca', displayName: 'Generic Alpaca' },
};

export const getAdapter = (vendor: ScopeVendor): ScopeAdapter => ADAPTERS[vendor];

export const VENDORS: ScopeVendor[] = [
  'seestar',
  'dwarf',
  'vespera',
  'unistellar',
  'generic_alpaca',
];
