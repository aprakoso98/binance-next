import moment from "moment";
import { C2CTradeHistory, C2CTradeType } from "@binance/connector";
import { binance } from "./api";

const useP2pHistory = async (props: {
  type: C2CTradeType;
  startDate?: string;
  endDate?: string;
}) => {
  const { type, startDate, endDate } = props;
  const responses: ReturnType<typeof binance["p2pHistory"]>[] = [];

  let index = moment(endDate).diff(moment(startDate), "month");

  while (index > -1) {
    const startTimestamp =
      moment(startDate).add(index, "month").startOf("month").unix() * 1000;
    const endTimestamp =
      moment(startDate).add(index, "month").endOf("month").unix() * 1000;

    responses.push(binance.p2pHistory({ type, endTimestamp, startTimestamp }));

    index--;
  }

  const response = await Promise.all(responses);

  return response.reduce<C2CTradeHistory["data"]>((ret, { data }) => {
    return [...ret, ...data.data];
  }, []);
};

export default useP2pHistory;
