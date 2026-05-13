// TelescopeDevice — ASCOM Master Interfaces ITelescopeV4 surface over Alpaca.

import type { AlpacaClient } from "../client.js";
import type { AlpacaRequestOptions } from "../types.js";

export class TelescopeDevice {
  private readonly client: AlpacaClient;
  public readonly deviceNumber: number;

  constructor(client: AlpacaClient, deviceNumber = 0) {
    this.client = client;
    this.deviceNumber = deviceNumber;
  }

  /** ASCOM Master Interfaces §Connected — GET current connection state. */
  public getConnected(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("telescope", this.deviceNumber, "connected", undefined, opts);
  }

  /** ASCOM Master Interfaces §Connected — PUT a new connection state. */
  public setConnected(value: boolean, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "telescope",
      this.deviceNumber,
      "connected",
      { Connected: value },
      opts,
    );
  }

  /** ASCOM §SlewToCoordinatesAsync — RA in hours, Dec in degrees, J2000. */
  public slewToCoordinatesAsync(
    rightAscensionHours: number,
    declinationDegrees: number,
    opts?: AlpacaRequestOptions,
  ): Promise<void> {
    return this.client.put<void>(
      "telescope",
      this.deviceNumber,
      "slewtocoordinatesasync",
      { RightAscension: rightAscensionHours, Declination: declinationDegrees },
      opts,
    );
  }

  /** ASCOM §SyncToCoordinates — align scope's reported position to provided coords. */
  public syncToCoordinates(
    rightAscensionHours: number,
    declinationDegrees: number,
    opts?: AlpacaRequestOptions,
  ): Promise<void> {
    return this.client.put<void>(
      "telescope",
      this.deviceNumber,
      "synctocoordinates",
      { RightAscension: rightAscensionHours, Declination: declinationDegrees },
      opts,
    );
  }

  /** ASCOM §Park — move scope to its park position and stop tracking. */
  public park(opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>("telescope", this.deviceNumber, "park", undefined, opts);
  }

  /** ASCOM §Unpark — release scope from parked state. */
  public unpark(opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>("telescope", this.deviceNumber, "unpark", undefined, opts);
  }

  /** ASCOM §AbortSlew — cancel any in-progress slew. */
  public abortSlew(opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>("telescope", this.deviceNumber, "abortslew", undefined, opts);
  }

  /** ASCOM §RightAscension — current RA in hours (J2000 or topocentric per EquatorialSystem). */
  public getRightAscension(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "telescope",
      this.deviceNumber,
      "rightascension",
      undefined,
      opts,
    );
  }

  /** ASCOM §Declination — current Dec in degrees. */
  public getDeclination(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("telescope", this.deviceNumber, "declination", undefined, opts);
  }

  /** ASCOM §Altitude — current altitude in degrees above horizon. */
  public getAltitude(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("telescope", this.deviceNumber, "altitude", undefined, opts);
  }

  /** ASCOM §Azimuth — current azimuth in degrees from north. */
  public getAzimuth(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("telescope", this.deviceNumber, "azimuth", undefined, opts);
  }

  /** ASCOM §Tracking — true if sidereal-rate tracking is enabled. */
  public getTracking(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("telescope", this.deviceNumber, "tracking", undefined, opts);
  }

  /** ASCOM §Tracking — enable/disable sidereal tracking. */
  public setTracking(value: boolean, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "telescope",
      this.deviceNumber,
      "tracking",
      { Tracking: value },
      opts,
    );
  }

  /** ASCOM §Slewing — true if scope is currently slewing. */
  public getSlewing(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("telescope", this.deviceNumber, "slewing", undefined, opts);
  }

  /** ASCOM §AtPark — true if scope is parked. */
  public getIsParked(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("telescope", this.deviceNumber, "atpark", undefined, opts);
  }

  /** ASCOM §SiteLatitude — geographic latitude of mount in degrees (+N). */
  public getSiteLatitude(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "telescope",
      this.deviceNumber,
      "sitelatitude",
      undefined,
      opts,
    );
  }

  /** ASCOM §SiteLongitude — geographic longitude in degrees (+E). */
  public getSiteLongitude(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "telescope",
      this.deviceNumber,
      "sitelongitude",
      undefined,
      opts,
    );
  }

  /** ASCOM §UTCDate — current UTC time per the mount, ISO 8601. */
  public getUtcDate(opts?: AlpacaRequestOptions): Promise<string> {
    return this.client.get<string>("telescope", this.deviceNumber, "utcdate", undefined, opts);
  }
}
