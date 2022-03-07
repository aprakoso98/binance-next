import type { NextApiHandler } from "next";
import Binance, { BinanceTarget } from "../../services/binance";
import config from "../../config.json";

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
  if (!sameKey || !sameSignature) return res.status(400).send("Invalid request");

  try {
    const target = request as BinanceTarget;
    const data = await Binance({ apiKey, apiSecret }, target, body);
    res.send(data);
  } catch (err) {
    // @ts-ignore
    res.status(500).send(err?.message);
  }
};

export default requestHandler;
