import { Flex, Stack, styled } from 'styled-system/jsx';
import { Spacing, Text } from '@/ui-lib';
import { DeliveryIcon, RocketIcon } from '@/ui-lib/components/icons';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQueries } from '@suspensive/react-query';
import { userQueryOptions, gradeShippingListQueryOptions, productsQueryOptions, type GRADE } from '@/apis/queryOptions';
import { useCart, type CartItem } from '@/stores/cart';
import ErrorSection from '@/components/ErrorSection';
import type { DeliveryType } from '@/apis/mutations';

interface DeliveryMethodSectionProps {
  deliveryType: DeliveryType;
  onDeliveryTypeChange: (type: DeliveryType) => void;
}

function DeliveryMethodSection({ deliveryType, onDeliveryTypeChange }: DeliveryMethodSectionProps) {
  const { items, getItemQuantity } = useCart();

  return (
    <ErrorBoundary fallback={<ErrorSection />}>
      <Suspense>
        <SuspenseQueries queries={[userQueryOptions, gradeShippingListQueryOptions, productsQueryOptions]}>
          {([
            { data: user },
            {
              data: { gradeShippingList },
            },
            {
              data: { products },
            },
          ]) => {
            const cartTotal = products
              .filter(product => isInCart(product.id, items))
              .reduce((totalPrice, product) => {
                return totalPrice + product.price * getItemQuantity(product.id);
              }, 0);

            const premiumPrice = getPremiumShippingPrice({
              grade: user.grade,
              cartTotal,
              gradeShippingList,
            });

            return (
              <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
                <Text variant="H2_Bold">배송 방식</Text>

                <Spacing size={4} />

                <Stack gap={4}>
                  <DeliveryItem
                    title="Express"
                    description="2~3일 후 도착 예정"
                    icon={<DeliveryIcon size={28} />}
                    price={0}
                    isSelected={deliveryType === 'EXPRESS'}
                    onClick={() => onDeliveryTypeChange('EXPRESS')}
                  />
                  <DeliveryItem
                    title="Premium"
                    description="당일 배송"
                    icon={<RocketIcon size={28} />}
                    price={premiumPrice}
                    isSelected={deliveryType === 'PREMIUM'}
                    onClick={() => onDeliveryTypeChange('PREMIUM')}
                  />
                </Stack>
              </styled.section>
            );
          }}
        </SuspenseQueries>
      </Suspense>
    </ErrorBoundary>
  );
}

function getPremiumShippingPrice({
  grade,
  cartTotal,
  gradeShippingList,
}: {
  grade: GRADE;
  cartTotal: number;
  gradeShippingList: Array<{ type: GRADE; shippingFee: number; freeShippingThreshold: number }>;
}) {
  const gradeShipping = gradeShippingList.find(g => g.type === grade);
  if (!gradeShipping) {
    return 0;
  }

  const isFreeShipping = cartTotal >= gradeShipping.freeShippingThreshold;
  return isFreeShipping ? 0 : gradeShipping.shippingFee;
}

function DeliveryItem({
  title,
  description,
  icon,
  price,
  isSelected,
  onClick,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  price: number;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <Flex
      gap={3}
      css={{
        alignItems: 'center',
        p: 5,
        py: 4,
        bgColor: isSelected ? 'primary.01_primary' : 'background.02_light-gray',
        transition: 'background-color 0.3s ease',
        rounded: '2xl',
        color: isSelected ? 'neutral.05_white' : 'neutral.01_black',
        cursor: 'pointer',
      }}
      role="button"
      onClick={onClick}
    >
      {icon}

      <Flex flexDir="column" gap={1} flex={1}>
        <Text variant="B2_Regular" fontWeight={'semibold'} color={isSelected ? 'neutral.05_white' : 'neutral.01_black'}>
          {title}
        </Text>
        <Text variant="C2_Medium" color={isSelected ? 'neutral.05_white' : 'neutral.02_gray'}>
          {description}
        </Text>
      </Flex>
      <Text variant="B2_Medium" fontWeight={'semibold'} color={isSelected ? 'neutral.05_white' : 'neutral.01_black'}>
        {price ? `$${price}` : '무료'}
      </Text>
    </Flex>
  );
}

function isInCart(productId: number, products: CartItem[]) {
  return products.some(product => product.productId === productId);
}

export default DeliveryMethodSection;
