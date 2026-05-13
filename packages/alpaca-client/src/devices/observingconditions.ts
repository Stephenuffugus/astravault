// ObservingConditionsDevice — ASCOM IObservingConditionsV2 surface over Alpaca.

import type { AlpacaClient } from "../client.js";
import type { AlpacaRequestOptions } from "../types.js";

export class ObservingConditionsDevice {
  private readonly client: AlpacaClient;
  public readonly deviceNumber: number;

  constructor(client: AlpacaClient, deviceNumber = 0) {
    this.client = client;
    this.deviceNumber = deviceNumber;
  }

  public getConnected(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>(
      "observingconditions",
      this.deviceNumber,
      "connected",
      undefined,
      opts,
    );
  }

  public setConnected(value: boolean, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "observingconditions",
      this.deviceNumber,
      "connected",
      { Connected: value },
      opts,
    );
  }

  /** ASCOM §Temperature — ambient air temperature in °C. */
  public getTemperature(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "observingconditions",
      this.deviceNumber,
      "temperature",
      undefined,
      opts,
    );
  }

  /** ASCOM §Humidity — relative humidity 0-100. */
  public getHumidity(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "observingconditions",
      this.deviceNumber,
      "humidity",
      undefined,
      opts,
    );
  }

  /** ASCOM §SkyBrightness — magnitudes per square arcsecond. */
  public getSkyBrightness(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "observingconditions",
      this.deviceNumber,
      "skybrightness",
      undefined,
      opts,
    );
  }

  /** ASCOM §CloudCover — percent cloud cover 0-100. */
  public getCloudCover(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "observingconditions",
      this.deviceNumber,
      "cloudcover",
      undefined,
      opts,
    );
  }

  /** ASCOM §DewPoint — ambient dew point in °C. */
  public getDewPoint(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "observingconditions",
      this.deviceNumber,
      "dewpoint",
      undefined,
      opts,
    );
  }

  /** ASCOM §Pressure — atmospheric pressure in hPa at observer altitude. */
  public getPressure(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "observingconditions",
      this.deviceNumber,
      "pressure",
      undefined,
      opts,
    );
  }

  /** ASCOM §WindSpeed — peak wind speed in m/s. */
  public getWindSpeed(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "observingconditions",
      this.deviceNumber,
      "windspeed",
      undefined,
      opts,
    );
  }

  /** ASCOM §Refresh — force the sensor to re-read all values. */
  public refresh(opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "observingconditions",
      this.deviceNumber,
      "refresh",
      undefined,
      opts,
    );
  }
}
