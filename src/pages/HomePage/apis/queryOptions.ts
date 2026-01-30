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
