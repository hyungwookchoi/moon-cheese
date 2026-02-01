import { http } from '@/utils/http';
import { useMutation } from '@tanstack/react-query';

export type DeliveryType = 'EXPRESS' | 'PREMIUM';

interface Order {
  deliveryType: DeliveryType;
  totalPrice: number;
  items: Array<{
    productId: number;
    quantity: number;
  }>;
}

export const purchaseOrder = (order: Order) => {
  return http.post<Order>('/api/product/purchase', order);
};

export const usePurchaseOrder = () => {
  return useMutation({
    mutationFn: purchaseOrder,
  });
};
