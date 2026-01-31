import { Spacing, type TagType } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ThumbnailSection from './components/ThumbnailSection';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorSection from '@/components/ErrorSection';
import { productQueryOptions, productsQueryOptions, recommendedProductsQueryOptions } from '@/apis/queryOptions';
import { SuspenseQueries, SuspenseQuery } from '@suspensive/react-query';
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
                    id={product.id}
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
      <ErrorBoundary fallback={<ErrorSection />}>
        <Suspense>
          <SuspenseQueries queries={[productsQueryOptions, recommendedProductsQueryOptions(productId)]}>
            {([
              {
                data: { products },
              },
              {
                data: { recommendProductIds },
              },
            ]) => {
              const recommendedProducts = products.filter(product =>
                isRecommendedProduct(product.id, recommendProductIds)
              );
              return <RecommendationSection products={recommendedProducts} />;
            }}
          </SuspenseQueries>
        </Suspense>
      </ErrorBoundary>
    </>
  );
}

export default ProductDetailPage;

function isRecommendedProduct(productId: number, recommendProductIds: number[]) {
  return recommendProductIds.includes(productId);
}
