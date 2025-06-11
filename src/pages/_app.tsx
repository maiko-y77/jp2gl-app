import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { ExchangeRateProvider } from "@/context/ExchangeRateContext";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ExchangeRateProvider>
      <Component {...pageProps} />
    </ExchangeRateProvider>
  );
}
