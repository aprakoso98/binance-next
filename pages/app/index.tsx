import { useRouter } from "next/router";
import { useLayoutEffect, useState } from "react";

import { Button, Container, Text, View, Wrapper } from "../../components";
import { binance, RetAccountInfo } from "../../services/api";
import { getConfig } from "../../services/binance";

const App = () => {
  const router = useRouter();
  const [data, setData] = useState({} as RetAccountInfo);

  const { balances = [] } = data ?? {};
  const isStableCoins = ["BUSD", "USDT"];
  const coins = balances.filter(({ asset }) => !isStableCoins.includes(asset));
  const stableCoins = balances.filter(({ asset }) =>
    isStableCoins.includes(asset)
  );

  const getInfo = async () => {
    const user = await binance.accountInfo();
    setData(user);
  };

  const doLogout = () => {
    localStorage.removeItem("apiKey");
    localStorage.removeItem("apiSecret");
    router.replace("/");
  };

  useLayoutEffect(() => {
    getInfo();
    const { hasConfig } = getConfig();
    if (!hasConfig) router.push("/");
  }, []);

  return (
    <Container>
      <Button onClick={doLogout}>Logout</Button>
      <Wrapper flex>
        <Text>asset</Text>
        <Text>value</Text>
      </Wrapper>
      <View>
        {stableCoins.map((state) => {
          const { asset, free, locked } = state;
          return (
            <Wrapper key={asset}>
              <Text>{asset}</Text>
              <Text>{free + locked}</Text>
            </Wrapper>
          );
        })}
        {coins.map((state) => {
          const { asset, free, locked } = state;
          return (
            <Wrapper
              onClick={() =>
                router.push({
                  pathname: "/app/wallet-detail",
                  query: { from: asset },
                })
              }
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
