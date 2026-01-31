import { http } from '@/utils/http';
import { queryOptions } from '@tanstack/react-query';

interface ExchangeRate {
  KRW: number;
  USD: number;
}

const fetchExchangeRate = () => {
  return http.get<{ exchangeRate: ExchangeRate }>('/api/exchange-rate');
};

export const exchangeRateQueryOptions = queryOptions({
  queryKey: ['exchangeRate'],
  queryFn: fetchExchangeRate,
});

export type GRADE = 'EXPLORER' | 'PILOT' | 'COMMANDER';

interface User {
  point: number;
  grade: GRADE;
}

const fetchUser = () => {
  return http.get<User>('/api/me');
};

export const userQueryOptions = queryOptions({
  queryKey: ['user'],
  queryFn: fetchUser,
});

interface GradePoint {
  type: GRADE;
  minPoint: number;
}

const fetchGradePoint = () => {
  return http.get<{ gradePointList: GradePoint[] }>('/api/grade/point');
};

export const gradePointQueryOptions = queryOptions({
  queryKey: ['gradePoint'],
  queryFn: fetchGradePoint,
});

type Cheese = {
  id: number;
  name: string;
  category: 'CHEESE';
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
};

type Cracker = {
  id: number;
  name: string;
  category: 'CRACKER';
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isGlutenFree?: boolean;
};

type Tea = {
  id: number;
  name: string;
  category: 'TEA';
  stock: number;
  price: number;
  description: string;
  detailDescription: string;
  images: string[];
  rating: number;
  isCaffeineFree?: boolean;
};

type Product = Cheese | Cracker | Tea;

const fetchProducts = () => {
  return http.get<{ products: Product[] }>('/api/product/list');
};

export const productsQueryOptions = queryOptions({
  queryKey: ['products'],
  queryFn: fetchProducts,
});

const fetchProduct = (productId: number) => {
  return http.get<Product>(`/api/product/${productId}`);
};

export const productQueryOptions = (productId: number) =>
  queryOptions({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId),
  });

const fetchRecommendedProducts = (productId: number) => {
  return http.get<{ recommendProductIds: number[] }>(`/api/product/recommend/${productId}`);
};

export const recommendedProductsQueryOptions = (productId: number) =>
  queryOptions({
    queryKey: ['recommendedProducts', productId],
    queryFn: () => fetchRecommendedProducts(productId),
  });
