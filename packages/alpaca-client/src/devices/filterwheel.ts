// FilterWheelDevice — ASCOM Master Interfaces IFilterWheelV3 surface over Alpaca.

import type { AlpacaClient } from "../client.js";
import type { AlpacaRequestOptions } from "../types.js";

export class FilterWheelDevice {
  private readonly client: AlpacaClient;
  public readonly deviceNumber: number;

  constructor(client: AlpacaClient, deviceNumber = 0) {
    this.client = client;
    this.deviceNumber = deviceNumber;
  }

  public getConnected(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("filterwheel", this.deviceNumber, "connected", undefined, opts);
  }

  public setConnected(value: boolean, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "filterwheel",
      this.deviceNumber,
      "connected",
      { Connected: value },
      opts,
    );
  }

  /** ASCOM §Position — current filter slot index, -1 while moving. */
  public getPosition(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("filterwheel", this.deviceNumber, "position", undefined, opts);
  }

  /** ASCOM §Position — set the target filter slot index (0-based). */
  public setPosition(slot: number, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "filterwheel",
      this.deviceNumber,
      "position",
      { Position: slot },
      opts,
    );
  }

  /** ASCOM §Names — human-readable names for each filter slot. */
  public getNames(opts?: AlpacaRequestOptions): Promise<string[]> {
    return this.client.get<string[]>("filterwheel", this.deviceNumber, "names", undefined, opts);
  }

  /** ASCOM §FocusOffsets — per-slot focuser offset table. */
  public getFocusOffsets(opts?: AlpacaRequestOptions): Promise<number[]> {
    return this.client.get<number[]>(
      "filterwheel",
      this.deviceNumber,
      "focusoffsets",
      undefined,
      opts,
    );
  }
}
