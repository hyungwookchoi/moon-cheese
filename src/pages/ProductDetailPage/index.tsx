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

                  <ProductDetailSection description={product.detailDescription} />
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
