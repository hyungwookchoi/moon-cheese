import { useCurrency } from '@/providers/CurrencyProvider';
import { useSuspenseQuery } from '@tanstack/react-query';
import { exchangeRateQueryOptions } from '../queries/queryOptions';

interface Props {
  children: (price: string) => React.ReactNode;
  price: number;
}

export function GetFormattedPrice({ children, price }: Props) {
  const {
    data: { exchangeRate },
  } = useSuspenseQuery(exchangeRateQueryOptions);
  const { currency } = useCurrency();
  return <>{children(formatPrice({ price, currency, exchangeRate }))}</>;
}

function formatPrice({
  price,
  currency,
  exchangeRate,
}: {
  price: number;
  currency: 'USD' | 'KRW';
  exchangeRate: { KRW: number; USD: number };
}) {
  const convertedPrice = currency === 'USD' ? price : Math.floor(price * exchangeRate.KRW);
  return convertedPrice.toLocaleString(currency === 'USD' ? 'en-US' : 'ko-KR');
}
