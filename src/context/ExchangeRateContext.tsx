import { createContext, useContext, useEffect, useState } from "react";
import { fetchExchangeRateJPYtoCAD } from "@/lib/currency";

const ExchangeRateContext = createContext<number | null>(null);

export const ExchangeRateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const loadRate = async () => {
      const cached = localStorage.getItem("exchangeRate");
      if (cached) {
        const { rate, timestamp } = JSON.parse(cached);
        const now = Date.now();
        const isFresh = now - timestamp < 1000 * 60 * 60 * 24; // 24時間以内
        if (isFresh) {
          setExchangeRate(rate);
          return;
        }
      }

      const rate = await fetchExchangeRateJPYtoCAD();
      setExchangeRate(rate);
      localStorage.setItem(
        "exchangeRate",
        JSON.stringify({ rate, timestamp: Date.now() })
      );
    };

    loadRate();
  }, []);

  return (
    <ExchangeRateContext.Provider value={exchangeRate}>
      {children}
    </ExchangeRateContext.Provider>
  );
};

export const useExchangeRate = () => useContext(ExchangeRateContext);
