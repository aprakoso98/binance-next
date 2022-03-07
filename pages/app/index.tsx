import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { Container, Text, View, Wrapper } from "../../components";
import { binance, RetAccountInfo } from "../../services/api";

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

  useEffect(() => {
    getInfo();
  }, []);

  return (
    <Container>
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
