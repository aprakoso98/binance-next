type Awaited<T> = T extends PromiseLike<infer U> ? U : T;
type MyObject<D = string> = Record<string, D>;

declare module "@binance/connector" {
  declare class Spot extends SpotMethods {
    constructor(apiKey: string, apiSecret: string);
  }

  class SpotMethods {
    c2cTradeHistory(
      type: C2CTradeType,
      options?: C2CTradeHistoryOption
    ): Promise<C2CTradeHistory>;
  }

  type C2CTradeType = "BUY" | "SELL";
  interface C2CTradeHistoryOption {
    startTimestamp?: number;
    endTimestamp?: number;
    page?: number;
    rows?: number;
    recvWindow?: number;
  }

  interface C2CTradeHistory {
    code: string;
    message: string;
    data: {
      orderNumber: string;
      advNo: string;
      tradeType: string;
      asset: string;
      fiat: string;
      fiatSymbol: string;
      amount: string;
      totalPrice: string;
      unitPrice: string;
      orderStatus: "CANCELLED" | "COMPLETED";
      createTime: number;
      commission: string;
      counterPartNickName: string;
      advertisementRole: string;
    }[];
    total: number;
    success: boolean;
  }
}
