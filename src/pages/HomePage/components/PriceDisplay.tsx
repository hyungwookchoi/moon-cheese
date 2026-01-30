import { useCurrency } from '@/providers/CurrencyProvider';
import { http } from '@/utils/http';
import { queryOptions, useSuspenseQuery } from '@tanstack/react-query';

const exchangeRateQueryOptions = queryOptions({
  queryKey: ['exchangeRate'],
  queryFn: async () => {
    const res = await http.get<{ exchangeRate: { KRW: number; USD: number } }>('/api/exchange-rate');
    return res.exchangeRate;
  },
});

interface Props {
  usdPrice: number;
}

export function PriceDisplay({ usdPrice }: Props) {
  const { data: exchangeRate } = useSuspenseQuery(exchangeRateQueryOptions);
  const { currency } = useCurrency();
  const price = currency === 'USD' ? usdPrice : Math.floor(usdPrice * exchangeRate.KRW);

  return (
    <>
      {currency === 'USD' ? '$' : '₩'}
      {price.toLocaleString()}
    </>
  );
}
