// ClientTransactionID generator per the Alpaca spec — monotonically increasing per client.

export class TransactionCounter {
  private value: number;
  constructor(initial = 0) {
    this.value = initial >>> 0;
  }
  next(): number {
    this.value = (this.value + 1) >>> 0;
    if (this.value === 0) this.value = 1;
    return this.value;
  }
  current(): number {
    return this.value;
  }
}

export interface AlpacaTransactionMeta {
  clientId: number;
  clientTransactionId: number;
  serverTransactionId?: number;
}

export interface AlpacaResponse<T> {
  Value?: T;
  ClientTransactionID?: number;
  ServerTransactionID?: number;
  ErrorNumber: number;
  ErrorMessage: string;
}
