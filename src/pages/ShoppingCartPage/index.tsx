import { useState } from 'react';
import CheckoutSection from './components/CheckoutSection';
import DeliveryMethodSection from './components/DeliveryMethodSection';
import ShoppingCartSection from './components/ShoppingCartSection';
import type { DeliveryType } from '@/apis/mutations';

function ShoppingCartPage() {
  return (
    <>
      <ShoppingCartSection />
      <PaymentSection />
    </>
  );
}

function PaymentSection() {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>('EXPRESS');

  return (
    <>
      <DeliveryMethodSection deliveryType={deliveryType} onDeliveryTypeChange={setDeliveryType} />
      <CheckoutSection deliveryType={deliveryType} />
    </>
  );
}

export default ShoppingCartPage;
