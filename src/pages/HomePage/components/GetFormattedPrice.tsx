import { useCurrency } from '@/providers/CurrencyProvider';
import { useSuspenseQuery } from '@tanstack/react-query';
import { exchangeRateQueryOptions } from '../../../apis/queryOptions';

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
  if (currency === 'USD') {
    return `$${price.toLocaleString('en-US')}`;
  }

  const roundedPrice = Math.round(price * exchangeRate.KRW);
  return `${roundedPrice.toLocaleString('ko-KR')}원`;
}
