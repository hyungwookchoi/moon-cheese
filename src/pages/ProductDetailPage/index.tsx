import { Spacing, type TagType } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ThumbnailSection from './components/ThumbnailSection';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorSection from '@/components/ErrorSection';
import { productQueryOptions } from '@/apis/queryOptions';
import { SuspenseQuery } from '@suspensive/react-query';
import { lowerCase } from 'es-toolkit';
import { useLoaderData } from 'react-router';

function ProductDetailPage() {
  const { productId } = useLoaderData<{ productId: number }>();

  return (
    <>
      <ErrorBoundary fallback={<ErrorSection />}>
        <Suspense>
          <SuspenseQuery {...productQueryOptions(productId)}>
            {({ data: product }) => {
              return (
                <>
                  <ThumbnailSection images={product.images} />
                  <ProductInfoSection
                    name={product.name}
                    category={lowerCase(product.category) as TagType}
                    rating={product.rating}
                    price={product.price}
                    quantity={product.stock}
                  />

                  <Spacing size={2.5} />

                  <ProductDetailSection
                    description={
                      '"달 표면에서 가 수확한 특별한 구멍낸 크래커." 달의 분화구를 연상시키는 다지한과 고소한 풍미가 특징인 크래커. 치즈와의 궁합을 고려한 절묘한 비율로, 어느 데어링 메뉴도 잘 어울립니다.'
                    }
                  />
                </>
              );
            }}
          </SuspenseQuery>
        </Suspense>
      </ErrorBoundary>
      <Spacing size={2.5} />
      <RecommendationSection />
    </>
  );
}

export default ProductDetailPage;
