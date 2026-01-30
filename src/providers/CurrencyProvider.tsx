import { createContext, useContext, useState } from 'react';

export type CurrencyType = 'USD' | 'KRW';

export type CurrencyContextType = {
  currency: CurrencyType;
  setCurrency: (currency: CurrencyType) => void;
};

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: React.ReactNode }) => {
  const [currency, setCurrency] = useState<CurrencyType>('USD');

  return <CurrencyContext.Provider value={{ currency, setCurrency }}>{children}</CurrencyContext.Provider>;
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};
