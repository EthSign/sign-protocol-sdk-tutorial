import "@/styles/globals.css";
import type { AppProps } from "next/app";
import "@rainbow-me/rainbowkit/styles.css";
import { getDefaultConfig, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { mainnet, polygon, optimism, arbitrum, base, baseSepolia } from "viem/chains";

export default function App({ Component, pageProps }: AppProps) {
  const config = getDefaultConfig({
    appName: "SpSdkTutorial",
    projectId: "YOUR_PROJECT_ID",
    chains: [mainnet, polygon, optimism, arbitrum, base, baseSepolia],
    ssr: true // If your dApp uses server side rendering (SSR)
  });
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={new QueryClient()}>
        <RainbowKitProvider>
          <Component {...pageProps} />;
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
