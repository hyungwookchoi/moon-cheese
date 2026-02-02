import { Flex, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import ErrorSection from '@/components/ErrorSection';
import { GetFormattedPrice } from '@/components/GetFormattedPrice';
import { recentProductsQueryOptions } from '@/apis/queryOptions';
import type { RecentProduct } from '@/apis/schema';

function RecentPurchaseSection() {
  return (
    <styled.section css={{ px: 5, pt: 4, pb: 8 }}>
      <Text variant="H1_Bold">최근 구매한 상품</Text>

      <Spacing size={4} />

      <ErrorBoundary fallback={<ErrorSection />}>
        <Suspense>
          <SuspenseQuery
            {...recentProductsQueryOptions}
            select={({ recentProducts }) => {
              return sumPricesByProductId(recentProducts);
            }}
          >
            {({ data: recentProducts }) => {
              return (
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
                  {recentProducts.map(({ id, thumbnail, name, price }) => (
                    <Flex key={id} css={{ gap: 4 }}>
                      <styled.img
                        src={thumbnail}
                        alt="item"
                        css={{ w: '60px', h: '60px', objectFit: 'cover', rounded: 'xl' }}
                      />
                      <Flex flexDir="column" gap={1}>
                        <Text variant="B2_Medium">{name}</Text>
                        <GetFormattedPrice price={price}>
                          {price => <Text variant="H1_Bold">{price}</Text>}
                        </GetFormattedPrice>
                      </Flex>
                    </Flex>
                  ))}
                </Flex>
              );
            }}
          </SuspenseQuery>
        </Suspense>
      </ErrorBoundary>
    </styled.section>
  );
}

export default RecentPurchaseSection;

function sumPricesByProductId(recentProducts: RecentProduct[]): RecentProduct[] {
  const productMap = new Map<number, RecentProduct>();

  for (const product of recentProducts) {
    const existing = productMap.get(product.id);
    if (existing) {
      existing.price += product.price;
    } else {
      productMap.set(product.id, { ...product });
    }
  }

  return Array.from(productMap.values());
}
