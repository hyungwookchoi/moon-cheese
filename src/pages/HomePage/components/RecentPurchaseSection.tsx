import { Flex, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { PriceDisplay } from './PriceDisplay';
import { http } from '@/utils/http';
import { queryOptions } from '@tanstack/react-query';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import ErrorSection from '@/components/ErrorSection';

type RecentProduct = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

const recentProductsQueryOptions = queryOptions({
  queryKey: ['recentProductList'],
  queryFn: () => {
    return http.get<{ recentProducts: RecentProduct[] }>('/api/recent/product/list');
  },
});

function RecentPurchaseSection() {
  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>

      <Spacing size={4} />

      <Flex
        css={{
          bg: 'background.01_white',
          px: 5,
          py: 4,
          gap: 4,
          rounded: '2xl',
        }}
        direction={'column'}
      >
        <ErrorBoundary fallback={<ErrorSection />}>
          <Suspense>
            <SuspenseQuery {...recentProductsQueryOptions}>
              {({ data: { recentProducts } }) => {
                return recentProducts.map(({ id, thumbnail, name, price }) => (
                  <RecentPurchaseItem key={id} id={id} thumbnail={thumbnail} name={name} price={price} />
                ));
              }}
            </SuspenseQuery>
          </Suspense>
        </ErrorBoundary>
      </Flex>
    </styled.section>
  );
}

export default RecentPurchaseSection;

function RecentPurchaseItem({ id, thumbnail, name, price }: RecentProduct) {
  return (
    <Flex key={id} css={{ gap: 4 }}>
      <styled.img src={thumbnail} alt="item" css={{ w: '60px', h: '60px', objectFit: 'cover', rounded: 'xl' }} />
      <Flex flexDir="column" gap={1}>
        <Text variant="B2_Medium">{name}</Text>
        <Text variant="H1_Bold">
          <PriceDisplay usdPrice={price} />
        </Text>
      </Flex>
    </Flex>
  );
}
