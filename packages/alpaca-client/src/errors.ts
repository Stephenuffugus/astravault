// Error hierarchy for ASCOM Alpaca HTTP and device-level failures.

export class AlpacaError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AlpacaError";
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AlpacaHttpError extends AlpacaError {
  public readonly status: number;
  public readonly statusText: string;
  public readonly url: string;
  public readonly body?: string;

  constructor(status: number, statusText: string, url: string, body?: string) {
    super(`Alpaca HTTP ${status} ${statusText} at ${url}`);
    this.name = "AlpacaHttpError";
    this.status = status;
    this.statusText = statusText;
    this.url = url;
    if (body !== undefined) this.body = body;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AlpacaDeviceError extends AlpacaError {
  public readonly errorNumber: number;
  public readonly errorMessage: string;
  public readonly clientTransactionId?: number;
  public readonly serverTransactionId?: number;

  constructor(
    errorNumber: number,
    errorMessage: string,
    clientTransactionId?: number,
    serverTransactionId?: number,
  ) {
    super(
      `Alpaca device error 0x${errorNumber.toString(16).toUpperCase()}: ${errorMessage}`,
    );
    this.name = "AlpacaDeviceError";
    this.errorNumber = errorNumber;
    this.errorMessage = errorMessage;
    if (clientTransactionId !== undefined) this.clientTransactionId = clientTransactionId;
    if (serverTransactionId !== undefined) this.serverTransactionId = serverTransactionId;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class AlpacaTimeoutError extends AlpacaError {
  public readonly timeoutMs: number;
  constructor(timeoutMs: number, url: string) {
    super(`Alpaca request timed out after ${timeoutMs}ms at ${url}`);
    this.name = "AlpacaTimeoutError";
    this.timeoutMs = timeoutMs;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export const AlpacaErrorCodes = {
  NotImplemented: 0x400,
  InvalidValue: 0x401,
  ValueNotSet: 0x402,
  NotConnected: 0x407,
  InvalidWhileParked: 0x408,
  InvalidWhileSlaved: 0x409,
  SettingsProviderError: 0x40a,
  InvalidOperationException: 0x40b,
  ActionNotImplementedException: 0x40c,
  NotInCacheException: 0x40d,
  UnspecifiedError: 0x4ff,
} as const;

export type AlpacaErrorCode =
  (typeof AlpacaErrorCodes)[keyof typeof AlpacaErrorCodes];
