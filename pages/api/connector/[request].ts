import type { NextApiHandler } from "next";
import { BConfig, BRet, BTarget, BParams } from "../../../services/binance";
import config from "../../../config.json";
import { Spot } from "@binance/connector";

export const BinanceConnector = <T extends BTarget>(
  config: BConfig,
  target: T,
  params?: BParams<T>
): BRet<T> => {
  const p = Array.isArray(params) ? params : [];
  const client = new Spot(...config);
  // @ts-ignore
  return client[target]?.(...p);
};

const requestHandler: NextApiHandler = async (req, res) => {
  const {
    body,
    method,
    headers,
    query: { request },
  } = req;

  const { xApiKey, xApiSignature } = config;
  const {
    "api-key": apiKey,
    "api-secret": apiSecret,
    "x-api-key": serverXApiKey,
    "x-api-signature": serverXApiSignature,
  } = headers as Record<string, string>;

  const sameKey = serverXApiKey === xApiKey;
  const sameSignature = serverXApiSignature === xApiSignature;

  if (method !== "POST") return res.status(400).send("Method not allowed");
  if (!sameKey || !sameSignature)
    return res.status(400).send("Invalid request");

  try {
    const target = request as BTarget;
    const resp = await BinanceConnector([apiKey, apiSecret], target, body);
    res.send(resp.data);
  } catch (err) {
    // @ts-ignore
    res.status(500).send(err?.message);
  }
};

export default requestHandler;
