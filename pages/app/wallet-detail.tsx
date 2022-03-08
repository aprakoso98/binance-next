import React, { useEffect, useLayoutEffect, useState } from "react";

import { ScatterDataPoint } from "chart.js";
import { useRouter } from "next/router";
import { generateChartData } from "../../utils/generateChartData";
import { binance, RetAllOrders } from "../../services/api";
import {
  Button,
  Chart,
  Container,
  Input,
  Text,
  View,
  Wrapper,
} from "../../components";
import { getConfig } from "../../services/binance";
import { COLORS } from "../../constans";

const WalletDetail = () => {
  const router = useRouter();
  const asset = router.query.from as string;
  const [assett, setAssett] = useState("");
  const [allOrders, setAllOrders] = useState([] as RetAllOrders);
  const [display, setDisplay] = useState(false);
  const [averageShown, setAverageShown] = useState(false);
  const h = generateChartData(allOrders, asset);

  const setAssetFix = (from: string) => {
    router.push({
      pathname: "/app/wallet-detail",
      query: { from },
    });
  };

  useEffect(() => {
    const getDetail = async () => {
      const resp = await binance.allOrders(asset, "USDT");
      const resp2 = await binance.allOrders(asset, "BUSD");
      setAllOrders([...resp, ...resp2]);
    };
    if (asset?.length > 0) {
      getDetail();
      setAssett(asset);
    }
  }, [asset]);

  useLayoutEffect(() => {
    const { hasConfig } = getConfig();
    if (!hasConfig) router.push("/");
  }, []);

  return (
    <Container>
      <Wrapper>
        <Button onClick={() => router.push("/app")}>Home</Button>
        <Button onClick={() => setDisplay(!display)}>Show Legend</Button>
        <Button onClick={() => setAverageShown(!averageShown)}>
          Show Average
        </Button>
        <Wrapper flex>
          <Input
            defaultValue={assett}
            onChangeText={setAssett}
            style={{ flex: 1, display: "flex" }}
            onKeyUp={({ key }) => {
              if (key === "Enter") setAssetFix(assett);
            }}
          />
          <Button onClick={() => setAssetFix(assett)}>Search</Button>
        </Wrapper>
      </Wrapper>
      {averageShown && <RenderAverage {...h} />}
      <RenderChart {...h} display={display} />
    </Container>
  );
};

export default WalletDetail;

type HJJ = ReturnType<typeof generateChartData>;

const RenderChart = (props: HJJ & { display: boolean }) => {
  const { datasets, labels, display } = props;
  return (
    <View flex>
      <Chart
        type="line"
        options={{
          spanGaps: true,
          plugins: {
            legend: { position: "right", display },
            tooltip: {
              callbacks: {
                title: ([{ label }]) => label?.split?.(",").join(" "),
                afterBody([{ raw }]) {
                  const { x } = raw as ScatterDataPoint;
                  return `Quantity : ${x}`;
                },
              },
            },
          },
        }}
        data={{ datasets, labels }}
      />
    </View>
  );
};

const RenderAverage = (props: HJJ) => {
  const { averageDatasets, datasets } = props;
  return (
    <View
      absolute
      style={{
        width: "70%",
        padding: 16,
        boxShadow: "5px 5px 20px rgba(0,0,0,0.75)",
        top: "50%",
        left: "50%",
        background: COLORS.white,
        transform: "translate(-50%, -50%)",
      }}
    >
      <View
        style={{
          display: "grid",
          rowGap: 16,
          columnGap: 16,
          gridTemplateColumns: `repeat(3, 1fr)`,
        }}
      >
        {averageDatasets.map(({ average, label }, index) => {
          return (
            <View
              style={{
                padding: 10,// @ts-ignore
                background: datasets[index].backgroundColor,
              }}
              key={label}
            >
              <Text style={{ color: COLORS.white }}>{label}</Text>
              <Text
                style={{ color: COLORS.white }}
              >{`Average : ${average.y}`}</Text>
              <Text
                style={{ color: COLORS.white }}
              >{`Total : ${average.x}`}</Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};
