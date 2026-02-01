import { queryOptions } from '@tanstack/react-query';
import {
  getExchangeRate,
  getMe,
  getGradePoint,
  getProductList,
  getProduct,
  getProductRecommend,
  getGradeShipping,
} from './fetcher';

export type { GRADE, Product } from './schema';

export const exchangeRateQueryOptions = queryOptions({
  queryKey: ['exchangeRate'],
  queryFn: getExchangeRate,
});

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: getMe,
});

export const gradePointQueryOptions = queryOptions({
  queryKey: ['gradePoint'],
  queryFn: getGradePoint,
});

export const productsQueryOptions = queryOptions({
  queryKey: ['products'],
  queryFn: getProductList,
});

export const productQueryOptions = (productId: number) =>
  queryOptions({
    queryKey: ['product', productId],
    queryFn: () => getProduct(productId),
  });

export const recommendedProductsQueryOptions = (productId: number) =>
  queryOptions({
    queryKey: ['recommendedProducts', productId],
    queryFn: () => getProductRecommend(productId),
  });

export const gradeShippingListQueryOptions = queryOptions({
  queryKey: ['gradeShippingList'],
  queryFn: getGradeShipping,
});
