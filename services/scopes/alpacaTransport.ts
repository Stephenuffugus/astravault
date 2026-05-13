/**
 * Minimal ASCOM Alpaca HTTP transport for React Native.
 *
 * Mirrors the surface of `@astravault/alpaca-client/client` but uses RN's
 * built-in `fetch` and skips the Node-only UDP discovery. The full canonical
 * implementation lives at packages/alpaca-client/; this module exists so
 * services/scopes/ can run on iOS / Android / web without pulling Node
 * dependencies into Metro.
 *
 * When we set up workspace tooling later, this should be replaced by
 * `import { AlpacaClient } from '@astravault/alpaca-client'`.
 */

import type { ScopeConfig } from './types';

export interface AlpacaResponse<T> {
  Value: T;
  ClientTransactionID: number;
  ServerTransactionID: number;
  ErrorNumber: number;
  ErrorMessage: string;
}

export class AlpacaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AlpacaError';
  }
}

export class AlpacaDeviceError extends AlpacaError {
  errorNumber: number;
  constructor(errorNumber: number, errorMessage: string) {
    super(`Alpaca device error ${errorNumber}: ${errorMessage}`);
    this.name = 'AlpacaDeviceError';
    this.errorNumber = errorNumber;
  }
}

let clientTransactionId = 0;
const CLIENT_ID = 17;

const baseUrl = (config: ScopeConfig): string =>
  `http://${config.host}:${config.port}/api/v1`;

const buildPath = (
  config: ScopeConfig,
  deviceType: string,
  action: string,
): string => `${baseUrl(config)}/${deviceType}/${config.deviceNumber}/${action}`;

const handleResponse = async <T>(res: Response, action: string): Promise<T> => {
  if (!res.ok) {
    throw new AlpacaError(`HTTP ${res.status} on ${action}`);
  }
  const data = (await res.json()) as AlpacaResponse<T>;
  if (data.ErrorNumber !== 0) {
    throw new AlpacaDeviceError(data.ErrorNumber, data.ErrorMessage);
  }
  return data.Value;
};

const nextTxn = (): number => ++clientTransactionId;

export const alpacaGet = async <T>(
  config: ScopeConfig,
  deviceType: string,
  action: string,
  timeoutMs = 8_000,
): Promise<T> => {
  const url = `${buildPath(config, deviceType, action)}?ClientID=${CLIENT_ID}&ClientTransactionID=${nextTxn()}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { signal: controller.signal });
    return await handleResponse<T>(res, action);
  } finally {
    clearTimeout(timer);
  }
};

export const alpacaPut = async <T>(
  config: ScopeConfig,
  deviceType: string,
  action: string,
  params: Record<string, string | number | boolean> = {},
  timeoutMs = 12_000,
): Promise<T> => {
  const body = new URLSearchParams();
  body.set('ClientID', String(CLIENT_ID));
  body.set('ClientTransactionID', String(nextTxn()));
  for (const [k, v] of Object.entries(params)) {
    body.set(k, String(v));
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(buildPath(config, deviceType, action), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body.toString(),
      signal: controller.signal,
    });
    return await handleResponse<T>(res, action);
  } finally {
    clearTimeout(timer);
  }
};

/** Server-info endpoint — useful to verify we're talking to an Alpaca host. */
export const fetchServerDescription = async (
  config: ScopeConfig,
  timeoutMs = 5_000,
): Promise<{ ServerName: string; Manufacturer: string; ManufacturerVersion: string }> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(
      `${baseUrl(config).replace('/api/v1', '')}/management/v1/description`,
      { signal: controller.signal },
    );
    if (!res.ok) throw new AlpacaError(`HTTP ${res.status} on management/description`);
    const data = (await res.json()) as AlpacaResponse<{
      ServerName: string;
      Manufacturer: string;
      ManufacturerVersion: string;
    }>;
    return data.Value;
  } finally {
    clearTimeout(timer);
  }
};
