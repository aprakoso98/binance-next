import { ChartDataset, ScatterDataPoint } from "chart.js";
import moment from "moment";

import { COLORS } from "../constans";
import { RetAllOrders } from "../services/api";

export const generateChartData = (
  allOrders: RetAllOrders,
  coin: string,
  hideCanceled?: boolean
) => {
  let index = 0;
  const deftSideAndStatus = {
    symbol: [] as string[],
    side: [] as string[],
    status: [] as string[],
  };
  const deftChartData = {
    labels: [] as string[][],
    dataset: {} as Record<string, ChartDataset<"line">>,
  };

  const sideAndStatus = allOrders?.reduce((ret, curr) => {
    const { status, side, symbol } = curr;
    if (!ret.status.includes(status)) ret.status.push(status);
    if (!ret.side.includes(side)) ret.side.push(side);
    if (!ret.symbol.includes(symbol)) ret.symbol.push(symbol);
    return ret;
  }, deftSideAndStatus);

  const { dataset, ...rest } = allOrders?.reduce((chartDataset, order) => {
    const { time, side, status, symbol, price, origQty } = order;
    const [pprice, qty] = [parseFloat(price), parseFloat(origQty)];

    chartDataset.labels = [
      ...chartDataset.labels,
      moment(time).format(`hh:mm A|DD/MM/YYYY`).split("|"),
    ];
    sideAndStatus.symbol.forEach((sb) => {
      sideAndStatus.side.forEach((sd) => {
        sideAndStatus.status.forEach((st) => {
          const label = `${sb.replace(coin, "")} • ${sd} • ${st}`;
          const cond = sb === symbol && sd === side && st === status;
          if (!chartDataset.dataset[label]) {
            chartDataset.dataset[label] = {
              label,
              data: [],
              backgroundColor: Object.values(COLORS)[index],
              borderColor: Object.values(COLORS)[index],
            };
            index++;
          }
          chartDataset.dataset[label].data = [
            // @ts-ignore
            ...chartDataset.dataset[label]?.data, // @ts-ignore
            cond ? { x: qty, y: pprice } : { x: null, y: null },
          ];
        });
      });
    });

    return chartDataset;
  }, deftChartData);

  const datasets = Object.values(dataset).filter(({ label, data }) => {
    // @ts-ignore
    const filteredData = data.filter(({ x, y }: ScatterDataPoint) => x && y);
    const canceled = hideCanceled && label?.includes("CANCELED");
    if (canceled) return false;
    return filteredData.length > 0;
  });

  const averageDatasets = datasets.map(
    ({ data, label }): { label?: string; average: ScatterDataPoint } => {
      return {
        label,
        average: data //@ts-ignore
          .filter(({ y }: ScatterDataPoint) => y !== null)
          .reduce<ScatterDataPoint>(
            (ret, curr, i, arr) => {
              const isLast = i === arr.length - 1;
              const { x, y } = curr as ScatterDataPoint;
              return {
                x: ret.x + x,
                y: (ret.y + y) / (isLast ? arr.length : 1),
              };
            },
            { x: 0, y: 0 }
          ),
      };
    }
  );

  return {
    datasets,
    averageDatasets,
    ...rest,
  };
};
