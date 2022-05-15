import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";

import { Button, Container, Text, View, Wrapper } from "../../components";
import { useArray } from "../../hooks";
import { binance, RetAccountInfo } from "../../services/api";
import { getConfig } from "../../services/binance";

type T = Omit<RetAccountInfo, "balances">;
type Y = T & {
  balances: ({ hover?: boolean } & RetAccountInfo["balances"][number])[];
};

const App = () => {
  const router = useRouter();
  const [data, setData] = useState({} as Y);

  const { balances = [] } = data ?? {};
  const isStableCoins = ["BUSD", "USDT"];

  const coins = balances.filter(({ asset }) => !isStableCoins.includes(asset));
  const stableCoins = balances.filter(({ asset }) =>
    isStableCoins.includes(asset)
  );

  const doLogout = () => {
    localStorage.removeItem("apiKey");
    localStorage.removeItem("apiSecret");
    router.replace("/");
  };

  const getInfo = async () => {
    const user = await binance.accountInfo();
    setData(user);
  };

  useLayoutEffect(() => {
    getInfo();
    const { hasConfig } = getConfig();
    if (!hasConfig) router.push("/");
  }, []);

  return (
    <Container>
      <Wrapper>
        <Button style={{ flex: 1, textAlign: "center" }} onClick={doLogout}>
          Logout
        </Button>
        <View style={{ padding: 5 }} />
        <Button
          style={{ flex: 1, textAlign: "center" }}
          onClick={() => router.push("/app/p2p-history")}
        >
          P2P History
        </Button>
      </Wrapper>
      <View style={{ padding: 5 }} />
      <Wrapper style={{ background: "#9fa3b4" }} flex>
        <Text>asset</Text>
        <Text>value</Text>
      </Wrapper>
      <View>
        {stableCoins.map((state) => {
          const { asset, free, locked } = state;
          return (
            <Wrapper style={{ background: "#9fa3b4" }} key={asset}>
              <Text>{asset}</Text>
              <Text>{free + locked}</Text>
            </Wrapper>
          );
        })}
        {coins.map((state) => {
          const { asset, free, locked, hover } = state;
          return (
            <Wrapper
              onClick={() =>
                router.push({
                  pathname: "/app/wallet-detail",
                  query: { from: asset },
                })
              }
              style={hover ? { background: "#9fa3b4" } : {}}
              key={asset}
            >
              <Text>{asset}</Text>
              <Text>{free + locked}</Text>
            </Wrapper>
          );
        })}
      </View>
    </Container>
  );
};

export default App;
