import { useNavigate } from 'react-router';
import { Box, Divider, Flex, HStack, Stack, styled } from 'styled-system/jsx';
import { SECOND } from '@/constants/time';
import { Button, Spacing, Text } from '@/ui-lib';
import { toast } from '@/ui-lib/components/toast';
import { delay } from '@/utils/async';
import { usePurchaseOrder } from '@/apis/mutations';
import { useCart, type CartItem } from '@/stores/cart';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQueries } from '@suspensive/react-query';
import { productsQueryOptions, userQueryOptions, gradeShippingListQueryOptions, type GRADE } from '@/apis/queryOptions';
import ErrorSection from '@/components/ErrorSection';
import type { DeliveryType } from '@/apis/mutations';

interface CheckoutSectionProps {
  deliveryType: DeliveryType;
}

function CheckoutSection({ deliveryType }: CheckoutSectionProps) {
  const navigate = useNavigate();
  const { items, clearCart, getItemQuantity } = useCart();
  const purchaseOrder = usePurchaseOrder();

  return (
    <ErrorBoundary fallback={<ErrorSection />}>
      <Suspense>
        <SuspenseQueries queries={[productsQueryOptions, userQueryOptions, gradeShippingListQueryOptions]}>
          {([
            {
              data: { products },
            },
            { data: user },
            {
              data: { gradeShippingList },
            },
          ]) => {
            const cartItems = products.filter(product => isInCart(product.id, items));
            const totalQuantity = cartItems.reduce(
              (totalQuantity, product) => totalQuantity + getItemQuantity(product.id),
              0
            );
            const subtotal = cartItems.reduce(
              (subtotal, product) => subtotal + product.price * getItemQuantity(product.id),
              0
            );

            const shippingFee = getShippingFee({
              deliveryType,
              grade: user.grade,
              cartTotal: subtotal,
              gradeShippingList,
            });
            const totalPrice = subtotal + shippingFee;

            return (
              <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
                <Text variant="H2_Bold">결제금액</Text>

                <Spacing size={4} />

                <Stack
                  gap={6}
                  css={{
                    p: 5,
                    border: '1px solid',
                    borderColor: 'border.01_gray',
                    rounded: '2xl',
                  }}
                >
                  <Stack gap={5}>
                    <Box gap={3}>
                      <Flex justify="space-between">
                        <Text variant="B2_Regular">주문금액({totalQuantity}개)</Text>
                        <Text variant="B2_Bold">${subtotal.toFixed(2)}</Text>
                      </Flex>
                      <Spacing size={3} />
                      <Flex justify="space-between">
                        <Text variant="B2_Regular">배송비</Text>
                        <Text variant="B2_Bold" color={shippingFee === 0 ? 'state.green' : undefined}>
                          {shippingFee === 0 ? '무료' : `$${shippingFee}`}
                        </Text>
                      </Flex>
                    </Box>

                    <Divider color="border.01_gray" />

                    <HStack justify="space-between">
                      <Text variant="H2_Bold">총 금액</Text>
                      <Text variant="H2_Bold">${totalPrice.toFixed(2)}</Text>
                    </HStack>
                  </Stack>

                  <Button
                    fullWidth
                    size="lg"
                    loading={purchaseOrder.isPending}
                    onClick={() => {
                      purchaseOrder.mutate(
                        {
                          deliveryType,
                          totalPrice,
                          items,
                        },
                        {
                          onSuccess: async () => {
                            clearCart();
                            toast.success('결제가 완료되었습니다.');
                            await delay(SECOND * 2);
                            navigate('/');
                          },
                          onError: () => {
                            toast.error('결제에 실패했습니다.');
                          },
                        }
                      );
                    }}
                  >
                    {purchaseOrder.isPending ? '결제 중...' : '결제 진행'}
                  </Button>

                  <Text variant="C2_Regular" color="neutral.03_gray">
                    {`우리는 신용카드, 은행 송금, 모바일 결제, 현금을 받아들입니다\n안전한 체크아웃\n귀하의 결제 정보는 암호화되어 안전합니다.`}
                  </Text>
                </Stack>
              </styled.section>
            );
          }}
        </SuspenseQueries>
      </Suspense>
    </ErrorBoundary>
  );
}

function isInCart(productId: number, products: CartItem[]) {
  return products.some(product => product.productId === productId);
}

function getShippingFee({
  deliveryType,
  grade,
  cartTotal,
  gradeShippingList,
}: {
  deliveryType: DeliveryType;
  grade: GRADE;
  cartTotal: number;
  gradeShippingList: Array<{ type: GRADE; shippingFee: number; freeShippingThreshold: number }>;
}) {
  if (deliveryType === 'EXPRESS') {
    return 0;
  }

  const gradeShipping = gradeShippingList.find(g => g.type === grade);
  if (!gradeShipping) {
    return 0;
  }

  if (cartTotal >= gradeShipping.freeShippingThreshold) {
    return 0;
  }

  return gradeShipping.shippingFee;
}

export default CheckoutSection;
