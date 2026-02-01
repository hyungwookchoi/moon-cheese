import { http } from '@/utils/http';
import type { ExchangeRate, User, GradePoint, Product, GradeShipping, Order } from './schema';

export const getExchangeRate = () => {
  return http.get<{ exchangeRate: ExchangeRate }>('/api/exchange-rate');
};

export const getMe = () => {
  return http.get<User>('/api/me');
};

export const getGradePoint = () => {
  return http.get<{ gradePointList: GradePoint[] }>('/api/grade/point');
};

export const getProductList = () => {
  return http.get<{ products: Product[] }>('/api/product/list');
};

export const getProduct = (productId: number) => {
  return http.get<Product>(`/api/product/${productId}`);
};

export const getProductRecommend = (productId: number) => {
  return http.get<{ recommendProductIds: number[] }>(`/api/product/recommend/${productId}`);
};

export const getGradeShipping = () => {
  return http.get<{ gradeShippingList: GradeShipping[] }>('/api/grade/shipping');
};

export const postProductPurchase = (order: Order) => {
  return http.post<Order>('/api/product/purchase', order);
};
