// Shared ASCOM Alpaca device-type identifiers and shape interfaces.

export type AlpacaDeviceType =
  | "telescope"
  | "camera"
  | "focuser"
  | "filterwheel"
  | "rotator"
  | "dome"
  | "safetymonitor"
  | "switch"
  | "observingconditions"
  | "covercalibrator"
  | "video";

export interface AlpacaConfiguredDevice {
  DeviceName: string;
  DeviceType: string;
  DeviceNumber: number;
  UniqueID: string;
}

export interface AlpacaServerDescription {
  ServerName: string;
  Manufacturer: string;
  ManufacturerVersion: string;
  Location: string;
}

export interface DiscoveredServer {
  host: string;
  port: number;
  alpacaPort: number;
  rawResponse: Record<string, unknown>;
}

export interface DiscoveryOptions {
  timeoutMs?: number;
  port?: number;
  allowedInterfaces?: string[];
  includeIpv6?: boolean;
}

export interface AlpacaClientOptions {
  host: string;
  port?: number;
  clientId?: number;
  timeoutMs?: number;
  basePath?: string;
  fetch?: typeof fetch;
}

export interface AlpacaRequestOptions {
  signal?: AbortSignal;
  timeoutMs?: number;
}

export type AlpacaHttpMethod = "GET" | "PUT";

export type AlpacaParamValue = string | number | boolean;
export type AlpacaParams = Record<string, AlpacaParamValue>;

export const EquatorialSystem = {
  Other: 0,
  Topocentric: 1,
  J2000: 2,
  J2050: 3,
  B1950: 4,
} as const;
export type EquatorialSystem =
  (typeof EquatorialSystem)[keyof typeof EquatorialSystem];

export const AlignmentMode = {
  AltAz: 0,
  Polar: 1,
  GermanPolar: 2,
} as const;
export type AlignmentMode = (typeof AlignmentMode)[keyof typeof AlignmentMode];

export const CameraState = {
  Idle: 0,
  Waiting: 1,
  Exposing: 2,
  Reading: 3,
  Download: 4,
  Error: 5,
} as const;
export type CameraState = (typeof CameraState)[keyof typeof CameraState];

export const SensorType = {
  Monochrome: 0,
  Color: 1,
  RGGB: 2,
  CMYG: 3,
  CMYG2: 4,
  LRGB: 5,
} as const;
export type SensorType = (typeof SensorType)[keyof typeof SensorType];

export interface AlpacaImageArrayResponse {
  Type: number;
  Rank: number;
  Value: number[][] | number[][][];
  Dimension0Length?: number;
  Dimension1Length?: number;
  Dimension2Length?: number;
}
