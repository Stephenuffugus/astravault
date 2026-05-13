// AlpacaClient — fetch-based wrapper over /api/v1/{deviceType}/{deviceNumber}/{action}.

import {
  AlpacaDeviceError,
  AlpacaHttpError,
  AlpacaTimeoutError,
} from "./errors.js";
import { TransactionCounter, type AlpacaResponse } from "./transactions.js";
import type {
  AlpacaClientOptions,
  AlpacaDeviceType,
  AlpacaHttpMethod,
  AlpacaParams,
  AlpacaRequestOptions,
  AlpacaConfiguredDevice,
  AlpacaServerDescription,
} from "./types.js";

const DEFAULT_PORT = 11111;
const DEFAULT_CLIENT_ID = 1;
const DEFAULT_TIMEOUT_MS = 10_000;
const DEFAULT_BASE_PATH = "/api/v1";

export class AlpacaClient {
  public readonly host: string;
  public readonly port: number;
  public readonly clientId: number;
  public readonly timeoutMs: number;
  public readonly basePath: string;
  private readonly fetchImpl: typeof fetch;
  private readonly txn: TransactionCounter;

  constructor(options: AlpacaClientOptions) {
    if (!options.host) throw new Error("AlpacaClient: host is required");
    this.host = options.host;
    this.port = options.port ?? DEFAULT_PORT;
    this.clientId = options.clientId ?? DEFAULT_CLIENT_ID;
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.basePath = options.basePath ?? DEFAULT_BASE_PATH;
    const f = options.fetch ?? globalThis.fetch;
    if (typeof f !== "function") {
      throw new Error(
        "AlpacaClient: global fetch is unavailable. Pass options.fetch or upgrade to Node 18+.",
      );
    }
    this.fetchImpl = f.bind(globalThis);
    this.txn = new TransactionCounter();
  }

  public baseUrl(): string {
    return `http://${this.host}:${this.port}${this.basePath}`;
  }

  public deviceUrl(
    deviceType: AlpacaDeviceType,
    deviceNumber: number,
    action: string,
  ): string {
    return `${this.baseUrl()}/${deviceType}/${deviceNumber}/${action.toLowerCase()}`;
  }

  public async get<T>(
    deviceType: AlpacaDeviceType,
    deviceNumber: number,
    action: string,
    params?: AlpacaParams,
    options?: AlpacaRequestOptions,
  ): Promise<T> {
    return this.request<T>("GET", deviceType, deviceNumber, action, params, options);
  }

  public async put<T>(
    deviceType: AlpacaDeviceType,
    deviceNumber: number,
    action: string,
    params?: AlpacaParams,
    options?: AlpacaRequestOptions,
  ): Promise<T> {
    return this.request<T>("PUT", deviceType, deviceNumber, action, params, options);
  }

  public async request<T>(
    method: AlpacaHttpMethod,
    deviceType: AlpacaDeviceType,
    deviceNumber: number,
    action: string,
    params?: AlpacaParams,
    options?: AlpacaRequestOptions,
  ): Promise<T> {
    const url = this.deviceUrl(deviceType, deviceNumber, action);
    const clientTransactionId = this.txn.next();
    const merged: AlpacaParams = {
      ClientID: this.clientId,
      ClientTransactionID: clientTransactionId,
      ...(params ?? {}),
    };
    return this.executeRequest<T>(method, url, merged, clientTransactionId, options);
  }

  public async getManagement<T>(
    path: string,
    options?: AlpacaRequestOptions,
  ): Promise<T> {
    const url = `http://${this.host}:${this.port}/management/v1/${path}`;
    return this.executeRaw<T>("GET", url, undefined, options);
  }

  public async getApiVersions(options?: AlpacaRequestOptions): Promise<number[]> {
    const raw = await this.executeRaw<AlpacaResponse<number[]>>(
      "GET",
      `http://${this.host}:${this.port}/management/apiversions`,
      undefined,
      options,
    );
    return raw.Value ?? [];
  }

  public async getServerDescription(
    options?: AlpacaRequestOptions,
  ): Promise<AlpacaServerDescription> {
    const raw = await this.executeRaw<AlpacaResponse<AlpacaServerDescription>>(
      "GET",
      `http://${this.host}:${this.port}/management/v1/description`,
      undefined,
      options,
    );
    if (!raw.Value)
      throw new AlpacaDeviceError(
        raw.ErrorNumber ?? 0x4ff,
        raw.ErrorMessage ?? "Missing description Value",
      );
    return raw.Value;
  }

  public async getConfiguredDevices(
    options?: AlpacaRequestOptions,
  ): Promise<AlpacaConfiguredDevice[]> {
    const raw = await this.executeRaw<AlpacaResponse<AlpacaConfiguredDevice[]>>(
      "GET",
      `http://${this.host}:${this.port}/management/v1/configureddevices`,
      undefined,
      options,
    );
    return raw.Value ?? [];
  }

  private async executeRequest<T>(
    method: AlpacaHttpMethod,
    url: string,
    params: AlpacaParams,
    clientTransactionId: number,
    options?: AlpacaRequestOptions,
  ): Promise<T> {
    const raw = await this.executeRaw<AlpacaResponse<T>>(method, url, params, options);
    if (raw.ErrorNumber !== 0) {
      throw new AlpacaDeviceError(
        raw.ErrorNumber,
        raw.ErrorMessage,
        clientTransactionId,
        raw.ServerTransactionID,
      );
    }
    return raw.Value as T;
  }

  private async executeRaw<T>(
    method: AlpacaHttpMethod,
    url: string,
    params: AlpacaParams | undefined,
    options?: AlpacaRequestOptions,
  ): Promise<T> {
    const timeoutMs = options?.timeoutMs ?? this.timeoutMs;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const externalSignal = options?.signal;
    const onAbort = () => controller.abort();
    if (externalSignal) {
      if (externalSignal.aborted) controller.abort();
      else externalSignal.addEventListener("abort", onAbort, { once: true });
    }

    let finalUrl = url;
    let init: RequestInit = {
      method,
      signal: controller.signal,
      headers: { Accept: "application/json" },
    };

    if (params && method === "GET") {
      const qs = encodeAlpacaParams(params);
      finalUrl = qs ? `${url}?${qs}` : url;
    } else if (params && method === "PUT") {
      const body = encodeAlpacaParams(params);
      init = {
        ...init,
        body,
        headers: {
          ...(init.headers as Record<string, string>),
          "Content-Type": "application/x-www-form-urlencoded",
        },
      };
    }

    try {
      const response = await this.fetchImpl(finalUrl, init);
      if (!response.ok) {
        let body: string | undefined;
        try {
          body = await response.text();
        } catch {
          body = undefined;
        }
        throw new AlpacaHttpError(response.status, response.statusText, finalUrl, body);
      }
      const text = await response.text();
      if (!text) {
        throw new AlpacaHttpError(
          response.status,
          "Empty response body",
          finalUrl,
        );
      }
      return JSON.parse(text) as T;
    } catch (err) {
      if (
        err instanceof Error &&
        (err.name === "AbortError" || (err as { name?: string }).name === "TimeoutError")
      ) {
        throw new AlpacaTimeoutError(timeoutMs, finalUrl);
      }
      throw err;
    } finally {
      clearTimeout(timer);
      if (externalSignal) externalSignal.removeEventListener("abort", onAbort);
    }
  }
}

function encodeAlpacaParams(params: AlpacaParams): string {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    usp.append(key, formatParamValue(value));
  }
  return usp.toString();
}

function formatParamValue(value: string | number | boolean): string {
  if (typeof value === "boolean") return value ? "True" : "False";
  return String(value);
}
