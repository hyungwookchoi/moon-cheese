import { http } from '@/utils/http';
import { queryOptions } from '@tanstack/react-query';

interface ExchangeRate {
  KRW: number;
  USD: number;
}

const fetchExchangeRate = () => {
  return http.get<{ exchangeRate: ExchangeRate }>('/api/exchange-rate');
};

export const exchangeRateQueryOptions = queryOptions({
  queryKey: ['exchangeRate'],
  queryFn: fetchExchangeRate,
});
