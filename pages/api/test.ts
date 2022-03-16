import axios from "axios";
import { NextApiHandler } from "next";
import CryptoJS from "crypto-js";

const test: NextApiHandler = (req, res) => {
  const ts = Date.now();
  req.query.timestamp = ts.toString();

  let paramsObject: Record<string, string> = {};

  const binance_api_secret = `y69f44AJA4u2z89eQvBY0u4NSvtWPi7fxq29E1UVla3ePk6FtzZ2EKCABqFWJ4Ut`;

  Object.assign(paramsObject, { timestamp: ts });

  if (binance_api_secret) {
    const queryString = Object.keys(paramsObject)
      .map((key) => {
        return `${key}=${paramsObject[key]}`;
      })
      .join("&");

    const signature = CryptoJS.HmacSHA256(
      queryString,
      binance_api_secret
    ).toString();
    req.query.signature = signature;
  }

  const { timestamp, signature } = req.query;
  const url = `https://api.binance.com/api/v3/account?timestamp=${timestamp}&signature=${signature}`;
  console.log(url, req.query);
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
        "X-MBX-APIKEY": binance_api_secret,
      },
    })
    .then(function (response) {
      console.log(response.data);
    })
    .catch(function (error) {
      console.log(error?.response?.data);
    });
  res.send("");
};

export default test;
