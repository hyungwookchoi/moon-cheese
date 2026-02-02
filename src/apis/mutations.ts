import { useMutation } from '@tanstack/react-query';
import { postProductPurchase } from './fetcher';

export type { DeliveryType, Order } from './schema';

export const usePurchaseOrder = () => {
  return useMutation({
    mutationFn: postProductPurchase,
  });
};
