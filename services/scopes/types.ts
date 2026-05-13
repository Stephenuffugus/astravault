/**
 * Smart-telescope bridge types — shared across adapters and the registry.
 * Mirrors the public surface of `@astravault/alpaca-client` (in packages/)
 * but adapted for the React Native runtime, which does not have Node's
 * `dgram` module. v0.1 uses manual IP entry rather than UDP discovery.
 */

export type ScopeVendor = 'seestar' | 'dwarf' | 'vespera' | 'unistellar' | 'generic_alpaca';

export interface ScopeConfig {
  /** Stable per-scope ID, generated when the user adds it. */
  id: string;
  /** User-facing label, e.g. "Living-room Seestar". */
  label: string;
  vendor: ScopeVendor;
  /** LAN host or IP. Examples: "192.168.1.45", "seestar.local". */
  host: string;
  /** Alpaca HTTP port. Default 11111 across vendors. */
  port: number;
  /** Alpaca device number. Default 0 for the first device of each type. */
  deviceNumber: number;
  addedAt: number;
}

export interface MountStatus {
  connected: boolean;
  /** Right Ascension, degrees, 0–360. */
  rightAscensionDeg: number | null;
  /** Declination, degrees, -90 to +90. */
  declinationDeg: number | null;
  /** Whether the mount is currently slewing to a new target. */
  slewing: boolean;
  /** Whether the mount is parked (idle / stowed). */
  parked: boolean;
  /** Whether sidereal tracking is enabled. */
  tracking: boolean;
  /** Site latitude/longitude if the mount exposes them. */
  siteLatitude: number | null;
  siteLongitude: number | null;
}

export interface ScopeCapabilities {
  canSlew: boolean;
  canPark: boolean;
  canSync: boolean;
  canImportObservations: boolean;
  /** Does this vendor expose any kind of session/observation history? */
  hasSessionHistory: boolean;
}

export interface ScopeAdapter {
  readonly vendor: ScopeVendor;
  readonly displayName: string;
  readonly capabilities: ScopeCapabilities;
  testConnection: (config: ScopeConfig) => Promise<boolean>;
  getStatus: (config: ScopeConfig) => Promise<MountStatus>;
  slewToCoordinates?: (config: ScopeConfig, ra: number, dec: number) => Promise<void>;
  abortSlew?: (config: ScopeConfig) => Promise<void>;
  park?: (config: ScopeConfig) => Promise<void>;
  unpark?: (config: ScopeConfig) => Promise<void>;
}

export interface ScopeObservation {
  /** Vendor-issued ID (Seestar session id, Dwarf capture id, etc). */
  externalId: string;
  /** UTC ms the observation began. */
  beganAt: number;
  /** UTC ms the observation ended. May equal beganAt for instant captures. */
  endedAt: number;
  /** Target name or RA/Dec target if no name. */
  target: string;
  rightAscensionDeg: number | null;
  declinationDeg: number | null;
  /** Sub-exposure count, if available. */
  frameCount: number | null;
  /** Total integration time in seconds, if available. */
  integrationSeconds: number | null;
}
