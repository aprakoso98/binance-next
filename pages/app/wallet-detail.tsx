import React, { useEffect, useState } from "react";

import { ScatterDataPoint } from "chart.js";
import { useRouter } from "next/router";
import { generateChartData } from "../../utils/generateChartData";
import { binance, RetAllOrders } from "../../services/api";
import { Chart, Container, Input, Text, View, Wrapper } from "../../components";

const WalletDetail = () => {
  const router = useRouter();
  const asset = router.query.from as string;
  const stableCoin = (router.query.to as string) ?? "USDT";
  const [assett, setAssett] = useState(asset ?? "");
  const [allOrders, setAllOrders] = useState([] as RetAllOrders);

  const { datasets, averageDatasets, labels } = generateChartData(allOrders);

  const setAssetFix = (from: string, to = stableCoin) => {
    router.push({
      pathname: "/app/wallet-detail",
      query: { from, to },
    });
  };

  useEffect(() => {
    const getDetail = async () => {
      const resp = await binance.allOrders(asset, stableCoin);
      setAllOrders(resp);
    };
    if (asset?.length > 0) getDetail();
  }, [stableCoin, asset]);

  return (
    <Container>
      <Wrapper>
        <Wrapper flex={0.8}>
          <Input
            defaultValue={assett}
            onChangeText={setAssett}
            style={{ flex: 1, display: "flex" }}
            onKeyUp={({ key }) => {
              if (key === "Enter") setAssetFix(assett);
            }}
          />
          <Text onClick={() => setAssetFix(assett)}>Search</Text>
        </Wrapper>
        <Text onClick={() => setAssetFix(assett, "USDT")}>USDT</Text>
        <Text onClick={() => setAssetFix(assett, "BUSD")}>BUSD</Text>
      </Wrapper>
      <Wrapper>
        {averageDatasets.map(({ average, label }) => {
          return (
            <View itemsCenter flex key={label}>
              <Text>{label}</Text>
              <Text>{`Average : ${average.y}`}</Text>
              <Text>{`Total : ${average.x}`}</Text>
            </View>
          );
        })}
      </Wrapper>
      <View flex>
        <Chart
          type="line"
          options={{
            spanGaps: true,
            plugins: {
              tooltip: {
                callbacks: {
                  title: ([{ label }]) => label?.split?.(",").join(" "),
                  afterBody([{ raw }]) {
                    const { x } = raw as ScatterDataPoint;
                    return `Quantity : ${x}`;
                  },
                },
              },
              title: {
                display: true,
                text: `${stableCoin}/${asset}`,
              },
            },
          }}
          data={{ datasets, labels }}
        />
      </View>
    </Container>
  );
};

export default WalletDetail;
