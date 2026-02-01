export interface ExchangeRate {
  KRW: number;
  USD: number;
}

export type GRADE = 'EXPLORER' | 'PILOT' | 'COMMANDER';

export interface User {
  point: number;
  grade: GRADE;
}

export interface GradePoint {
  type: GRADE;
  minPoint: number;
}

export type Cheese = {
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

export type Cracker = {
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

export type Tea = {
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

export type Product = Cheese | Cracker | Tea;

export interface GradeShipping {
  type: GRADE;
  shippingFee: number;
  freeShippingThreshold: number;
}

export type DeliveryType = 'EXPRESS' | 'PREMIUM';

export interface Order {
  deliveryType: DeliveryType;
  totalPrice: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}
