import moment from "moment";
import { useEffect, useState } from "react";
import { useStateObject } from "../../hooks";
import { C2CTradeHistory, C2CTradeType } from "@binance/connector";
import { Text, Container, Wrapper, Input, Button } from "../../components";
import useP2pHistory from "../../services/useP2pHistory";
import { COLORS } from "../../constans";

const format = "YYYY-MM";

const P2pHistory = () => {
  const [dataHistory, setDataHistory] = useState<C2CTradeHistory["data"]>([]);
  const [state, setState] = useStateObject({
    type: "BUY" as C2CTradeType,
    startDate: moment().startOf("month").format(format),
    endDate: moment().endOf("month").format(format),
  });

  const { endDate, startDate, type } = state;
  const isBuy = type === "BUY";

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

      {dataHistory.map((data) => {
        const { asset, unitPrice, totalPrice, amount } = data;
        return (
          <Wrapper>
            <Text>{asset}</Text>
            <Text>{amount}</Text>
            <Text>{unitPrice}</Text>
            <Text>{totalPrice}</Text>
          </Wrapper>
        );
      })}
    </Container>
  );
};

export default P2pHistory;
