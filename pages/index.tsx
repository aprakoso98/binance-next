import { useRouter } from "next/router";
import { useEffect, useLayoutEffect, useState } from "react";
import { Button, Container, Input } from "../components";
import { getConfig } from "../services/binance";

const Index = () => {
  const router = useRouter();

  const [config, setConfigs] = useState({} as ReturnType<typeof getConfig>);
  const { apiKey, apiSecret, hasApiKey, hasApiSecret } = config;
  const hasConfig = hasApiKey && hasApiSecret;

  type X = Partial<Record<"apiKey" | "apiSecret", string>>;
  const setConfig = (newConfig: X) => {
    setConfigs({ ...config, ...newConfig });
  };

  const setNewConfig = () => {
    localStorage.setItem("apiKey", apiKey);
    localStorage.setItem("apiSecret", apiSecret);
    setConfigs(getConfig());
  };

  useLayoutEffect(() => {
    const d = getConfig();
    setConfigs(d);
  }, []);

  useEffect(() => {
    if (hasConfig) router.push("/app");
  }, [hasConfig]);

  if (hasConfig) null;

  return (
    <Container>
      apiKey
      <Input
        defaultValue={apiKey}
        onChangeText={(apiKey) => setConfig({ apiKey })}
      />
      apiSecret
      <Input
        defaultValue={apiSecret}
        onChangeText={(apiSecret) => setConfig({ apiSecret })}
      />
      <Button onClick={setNewConfig}>Set Config</Button>
    </Container>
  );
};

export default Index;
