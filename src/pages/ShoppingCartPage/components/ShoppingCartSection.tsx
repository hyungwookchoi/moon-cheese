import { productsQueryOptions } from '@/apis/queryOptions';
import { useCart, type CartItem } from '@/stores/cart';
import { Button, Counter, Spacing, Text, type TagType } from '@/ui-lib';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { lowerCase } from 'es-toolkit';
import { Separated } from 'react-simplikit';
import { Divider, Flex, Stack, styled } from 'styled-system/jsx';
import ErrorSection from '@/components/ErrorSection';
import ShoppingCartItem from './ShoppingCartItem';
import { GetFormattedPrice } from '@/components/GetFormattedPrice';

function ShoppingCartSection() {
  const { items, addItem, removeItem, clearCart, getItemQuantity } = useCart();

  return (
    <styled.section css={{ p: 5, bgColor: 'background.01_white' }}>
      <Flex justify="space-between">
        <Text variant="H2_Bold">장바구니</Text>
        <Button color={'neutral'} size="sm" onClick={() => clearCart()}>
          전체삭제
        </Button>
      </Flex>
      <Spacing size={4} />
      <Stack
        gap={5}
        css={{
          p: 5,
          border: '1px solid',
          borderColor: 'border.01_gray',
          rounded: '2xl',
        }}
      >
        <ErrorBoundary fallback={<ErrorSection />}>
          <Suspense>
            <SuspenseQuery
              {...productsQueryOptions}
              select={({ products }) => {
                return products.filter(product => isInCart(product.id, items));
              }}
            >
              {({ data: products }) => {
                return products.length > 0 ? (
                  <Separated by={<Divider color="border.01_gray" />}>
                    {products.map(({ id, name, category, description, price, images, stock }) => {
                      const quantity = getItemQuantity(id);

                      return (
                        <ShoppingCartItem.Root key={id}>
                          <ShoppingCartItem.Image src={images[0]} alt={name} />
                          <ShoppingCartItem.Content>
                            <ShoppingCartItem.Info
                              type={lowerCase(category) as TagType}
                              title={name}
                              description={description}
                              onDelete={() => removeItem({ productId: id, quantity })}
                            />
                            <ShoppingCartItem.Footer>
                              <GetFormattedPrice price={price}>
                                {price => <ShoppingCartItem.Price>{price}</ShoppingCartItem.Price>}
                              </GetFormattedPrice>
                              <Counter.Root>
                                <Counter.Minus
                                  onClick={() => {
                                    removeItem({ productId: id, quantity: 1 });
                                  }}
                                  disabled={quantity === 0}
                                />
                                <Counter.Display value={quantity} />
                                <Counter.Plus
                                  onClick={() => addItem({ productId: id, quantity: 1 })}
                                  disabled={quantity >= stock}
                                />
                              </Counter.Root>
                            </ShoppingCartItem.Footer>
                          </ShoppingCartItem.Content>
                        </ShoppingCartItem.Root>
                      );
                    })}
                  </Separated>
                ) : (
                  <Text variant="C1_Medium">장바구니에 상품이 없습니다.</Text>
                );
              }}
            </SuspenseQuery>
          </Suspense>
        </ErrorBoundary>
      </Stack>
    </styled.section>
  );
}

export default ShoppingCartSection;

function isInCart(productId: number, products: CartItem[]) {
  return products.some(product => product.productId === productId);
}
