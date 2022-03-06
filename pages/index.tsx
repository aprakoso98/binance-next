import { useEffect } from "react";
import { Text, View } from "../components";
import { Binance } from "../services/binance";

const App = () => {
  useEffect(() => {
    Binance()
      .accountInfo()
      .then((e) => console.log(e));
  }, []);
  return (
    <View row>
      <Text>jhsdkf</Text>
      <Text>jhsdkf</Text>
    </View>
  );
};

export default App;
