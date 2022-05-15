import moment from "moment";
import { useEffect, useState } from "react";
import { useStateObject } from "../../hooks";
import { C2CTradeHistory, C2CTradeType } from "@binance/connector";
import {
  Text,
  Container,
  Wrapper,
  Input,
  Button,
  View,
} from "../../components";
import useP2pHistory from "../../services/useP2pHistory";
import { COLORS } from "../../constans";
import { numberFormat } from "../../utils";

const format = "YYYY-MM";
type Data = {
  data: (C2CTradeHistory["data"][number] & {
    time: string;
    priceTotal: number;
    priceUnit: number;
    jumlah: number;
  })[];
  total: Record<string, [totalPrice?: number]>;
};

const P2pHistory = () => {
  const defaultData: Data = { data: [], total: {} };
  const [dataHistory, setDataHistory] = useState<C2CTradeHistory["data"]>([]);
  const [state, setState] = useStateObject({
    type: "BUY" as C2CTradeType,
    startDate: moment().startOf("month").format(format),
    endDate: moment().endOf("month").format(format),
  });

  const { data, total } = dataHistory.reduce<Data>((ret, history) => {
    const { unitPrice, totalPrice, asset, amount, createTime } = history;
    const priceTotal = Number(totalPrice);
    const priceUnit = Number(unitPrice);
    const jumlah = Number(amount);
    const time = moment(createTime).format(`DD MMM YYYY - HH:mm:ss`);

    if (!ret.total[asset]) ret.total[asset] = [];

    const {
      [asset]: [total = 0],
    } = ret.total;

    ret.total[asset] = [total + Number(totalPrice)];

    ret.data.push({ ...history, time, priceTotal, priceUnit, jumlah });

    return ret;
  }, defaultData);

  const { endDate, startDate, type } = state;
  const isBuy = type === "BUY";
  const totalPrices = Object.entries(total);
  const allDeposited = totalPrices.reduce((ret, e) => {
    const [, [totalPrice = 0]] = e;
    return ret + totalPrice;
  }, 0);

  useEffect(() => {
    useP2pHistory({ type, startDate, endDate }).then(setDataHistory);
  }, [endDate, startDate, type]);

  return (
    <Container>
      <Wrapper>
        <Wrapper>
          <Button
            style={{ background: isBuy ? COLORS.primary : COLORS.secondary }}
            onClick={() => setState({ type: "BUY" })}
          >
            BUY
          </Button>
          <Button
            style={{ background: !isBuy ? COLORS.primary : COLORS.secondary }}
            onClick={() => setState({ type: "SELL" })}
          >
            SELL
          </Button>
        </Wrapper>
        <Input
          type="month"
          defaultValue={startDate}
          onChangeText={(startDate) => setState({ startDate })}
        />
        <Input
          type="month"
          defaultValue={endDate}
          onChangeText={(endDate) => setState({ endDate })}
        />
      </Wrapper>

      <Wrapper>
        {totalPrices.map((e) => {
          const [asset, [totalPrice = 0]] = e;
          return (
            <Wrapper key={asset}>
              <Text>{asset}</Text>
              <View style={{ padding: 5 }} />
              <Text>{numberFormat(totalPrice)}</Text>
            </Wrapper>
          );
        })}
      </Wrapper>

      <Wrapper>
        <Text>Total</Text>
        <Text>{numberFormat(allDeposited)}</Text>
      </Wrapper>

      <Wrapper>
        <Text style={{ flex: 1, textAlign: "center" }}>Time</Text>
        <Text style={{ flex: 1, textAlign: "center" }}>Asset</Text>
        <Text style={{ flex: 1, textAlign: "center" }}>Amount</Text>
        <Text style={{ flex: 1, textAlign: "center" }}>Price Unit (IDR)</Text>
        <Text style={{ flex: 1, textAlign: "center" }}>Price Total (IDR)</Text>
      </Wrapper>

      {data.map((history) => {
        const { asset, time, priceUnit, priceTotal, jumlah } = history;
        return (
          <Wrapper key={`${asset}-${time}`}>
            <Text style={{ flex: 1 }}>{time}</Text>
            <Text style={{ flex: 1 }}>{asset}</Text>
            <Text style={{ flex: 1, textAlign: "right" }}>
              {numberFormat(jumlah)}
            </Text>
            <Text style={{ flex: 1, textAlign: "right" }}>
              {numberFormat(priceUnit)}
            </Text>
            <Text style={{ flex: 1, textAlign: "right" }}>
              {numberFormat(priceTotal)}
            </Text>
          </Wrapper>
        );
      })}
    </Container>
  );
};

export default P2pHistory;
