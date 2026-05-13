// FocuserDevice — ASCOM Master Interfaces IFocuserV4 surface over Alpaca.

import type { AlpacaClient } from "../client.js";
import type { AlpacaRequestOptions } from "../types.js";

export class FocuserDevice {
  private readonly client: AlpacaClient;
  public readonly deviceNumber: number;

  constructor(client: AlpacaClient, deviceNumber = 0) {
    this.client = client;
    this.deviceNumber = deviceNumber;
  }

  public getConnected(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("focuser", this.deviceNumber, "connected", undefined, opts);
  }

  public setConnected(value: boolean, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "focuser",
      this.deviceNumber,
      "connected",
      { Connected: value },
      opts,
    );
  }

  /** ASCOM §Move — absolute position if Absolute=true, otherwise offset from current. */
  public move(position: number, opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>(
      "focuser",
      this.deviceNumber,
      "move",
      { Position: position },
      opts,
    );
  }

  /** ASCOM §Halt — abort focuser motion immediately. */
  public halt(opts?: AlpacaRequestOptions): Promise<void> {
    return this.client.put<void>("focuser", this.deviceNumber, "halt", undefined, opts);
  }

  /** ASCOM §Position — current focuser position in steps. */
  public getPosition(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("focuser", this.deviceNumber, "position", undefined, opts);
  }

  /** ASCOM §IsMoving — true while a Move is in progress. */
  public getIsMoving(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("focuser", this.deviceNumber, "ismoving", undefined, opts);
  }

  /** ASCOM §Temperature — focuser/ambient temperature in °C, where supported. */
  public getTemperature(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("focuser", this.deviceNumber, "temperature", undefined, opts);
  }

  /** ASCOM §MaxStep — maximum step value accepted by Move. */
  public getMaxStep(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>("focuser", this.deviceNumber, "maxstep", undefined, opts);
  }

  /** ASCOM §MaxIncrement — maximum step delta per Move call. */
  public getMaxIncrement(opts?: AlpacaRequestOptions): Promise<number> {
    return this.client.get<number>(
      "focuser",
      this.deviceNumber,
      "maxincrement",
      undefined,
      opts,
    );
  }

  /** ASCOM §Absolute — true if focuser uses absolute positions. */
  public getAbsolute(opts?: AlpacaRequestOptions): Promise<boolean> {
    return this.client.get<boolean>("focuser", this.deviceNumber, "absolute", undefined, opts);
  }
}
