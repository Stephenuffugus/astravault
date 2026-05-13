// CameraDevice — ASCOM Master Interfaces ICameraV4 surface over Alpaca.

import type { AlpacaClient } from "../client.js";
import type { AlpacaRequestOptions, CameraState } from "../types.js";

export class CameraDevice {
  private readonly client: AlpacaClient;
  public readonly deviceNumber: number;

  constructor(client: AlpacaClient, deviceNumber = 0) {
    this.client = client;
    this.deviceNumber = deviceNumber;
  }

  /** ASCOM §Connected — current connection state. */
  public getConnected(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("camera", this.deviceNumber, "connected", undefined, opts);
  }

  /** ASCOM §Connected — open or close the camera connection. */
  public setConnected(value: boolean, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "camera",
      this.deviceNumber,
      "connected",
      { Connected: value },
      opts,
    );
  }

  /** ASCOM §StartExposure — duration in seconds; light=false for dark frame. */
  public startExposure(
    durationSec: number,
    light = true,
    opts?: AlpacaRequestOptions,
  ): Promise<void> {
    return this.client.put<void>(
      "camera",
      this.deviceNumber,
      "startexposure",
      { Duration: durationSec, Light: light },
      opts,
    );
  }

  /** ASCOM §AbortExposure — immediately stop the current exposure. */
  public abortExposure(opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>("camera", this.deviceNumber, "abortexposure", undefined, opts);
  }

  /** ASCOM §StopExposure — gracefully end exposure (image is still readable). */
  public stopExposure(opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>("camera", this.deviceNumber, "stopexposure", undefined, opts);
  }

  /** ASCOM §ImageReady — true when ImageArray is available to download. */
  public getImageReady(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("camera", this.deviceNumber, "imageready", undefined, opts);
  }

  /** ASCOM §ImageArray — 2D/3D numeric array; consider ImageBytes for large frames. */
  public getImageArray(opts?: AlpacaRequestOptions): Promise<unknown> {
    return this.client.get<unknown>("camera", this.deviceNumber, "imagearray", undefined, opts);
  }

  /** ASCOM §CameraState — Idle/Waiting/Exposing/Reading/Download/Error. */
  public getCameraState(opts?: AlpacaRequestOptions): Promise<CameraState> {
    return this.client.get<CameraState>(
      "camera",
      this.deviceNumber,
      "camerastate",
      undefined,
      opts,
    );
  }

  public getBinX(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("camera", this.deviceNumber, "binx", undefined, opts);
  }

  public setBinX(value: number, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "camera",
      this.deviceNumber,
      "binx",
      { BinX: value },
      opts,
    );
  }

  public getBinY(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("camera", this.deviceNumber, "biny", undefined, opts);
  }

  public setBinY(value: number, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "camera",
      this.deviceNumber,
      "biny",
      { BinY: value },
      opts,
    );
  }

  public getGain(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("camera", this.deviceNumber, "gain", undefined, opts);
  }

  public setGain(value: number, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "camera",
      this.deviceNumber,
      "gain",
      { Gain: value },
      opts,
    );
  }

  public getCcdTemperature(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "camera",
      this.deviceNumber,
      "ccdtemperature",
      undefined,
      opts,
    );
  }

  public getCameraXSize(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("camera", this.deviceNumber, "cameraxsize", undefined, opts);
  }

  public getCameraYSize(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("camera", this.deviceNumber, "cameraysize", undefined, opts);
  }
}
