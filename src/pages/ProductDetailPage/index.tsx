import { Spacing } from '@/ui-lib';
import ProductDetailSection from './components/ProductDetailSection';
import ProductInfoSection from './components/ProductInfoSection';
import RecommendationSection from './components/RecommendationSection';
import ProductImagesSection from './components/ThumbnailSection';
import {
  productQueryOptions,
  productsQueryOptions,
  recommendedProductsQueryOptions,
  type Product,
} from '@/apis/queryOptions';
import { SuspenseQueries, SuspenseQuery } from '@suspensive/react-query';
import { useLoaderData } from 'react-router';
import { AsyncBoundary } from '@/components/AsyncBoundary';

function ProductDetailPage() {
  return (
    <>
      <GetProduct>
        {({ product }) => {
          return (
            <>
              <ProductImagesSection images={product.images} />
              <ProductInfoSection product={product} />

              <Spacing size={2.5} />

              <ProductDetailSection description={product.detailDescription} />
            </>
          );
        }}
      </GetProduct>
      <Spacing size={2.5} />

      <GetRecommendedProducts>
        {({ recommendedProducts }) => <RecommendationSection products={recommendedProducts} />}
      </GetRecommendedProducts>
    </>
  );
}

function isRecommendedProduct(productId: number, recommendProductIds: number[]) {
  return recommendProductIds.includes(productId);
}

function GetProduct({ children }: { children: ({ product }: { product: Product }) => React.ReactNode }) {
  const { productId } = useLoaderData<{ productId: number }>();
  return (
    <AsyncBoundary>
      <SuspenseQuery {...productQueryOptions(productId)}>{({ data: product }) => children({ product })}</SuspenseQuery>
    </AsyncBoundary>
  );
}

function GetRecommendedProducts({
  children,
}: {
  children: ({ recommendedProducts }: { recommendedProducts: Product[] }) => React.ReactNode;
}) {
  const { productId } = useLoaderData<{ productId: number }>();
  return (
    <AsyncBoundary>
      <SuspenseQueries queries={[productsQueryOptions, recommendedProductsQueryOptions(productId)]}>
        {([
          {
            data: { products },
          },
          {
            data: { recommendProductIds },
          },
        ]) => {
          const recommendedProducts = products.filter(product => isRecommendedProduct(product.id, recommendProductIds));
          return children({ recommendedProducts });
        }}
      </SuspenseQueries>
    </AsyncBoundary>
  );
}

export default ProductDetailPage;
