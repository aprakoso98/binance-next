import { C2CTradeHistoryOption, C2CTradeType } from "@binance/connector";
import { clientRequest, clientRequestConnector } from "./binance";

export type RetAccountInfo = Awaited<ReturnType<typeof binance.accountInfo>>;
export type RetAllOrders = Awaited<ReturnType<typeof binance.allOrders>>;

export const binance = {
  async p2pHistory(options: C2CTradeHistoryOption & { type: C2CTradeType }) {
    const { type, ...rest } = options;
    return clientRequestConnector("c2cTradeHistory", [type, rest]);
  },
  async allOrders(from: string, to: string) {
    const symbol = `${from}${to}`;
    const resp = await clientRequest(`allOrders`, [{ symbol }]);
    return resp.data;
  },
  async accountInfo() {
    const {
      data: { balances, ...rest },
    } = await clientRequest("accountInfo");
    const accountInfo = {
      ...rest,
      balances: balances
        .map(({ asset, free, locked }) => ({
          asset,
          free: parseFloat(free),
          locked: parseFloat(locked),
        }))
        .filter(
          ({ asset, free, locked }) =>
            (free > 0 || locked > 0) && !asset.match(/^LD/)
        ),
    };
    return accountInfo;
  },
};
