import { productsQueryOptions, type Product } from '@/apis/queryOptions';
import { useCart } from '@/providers/CartProvider';
import { Button, Counter, Spacing, Text, type TagType } from '@/ui-lib';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import { SuspenseQuery } from '@suspensive/react-query';
import { lowerCase } from 'es-toolkit';
import { Separated } from 'react-simplikit';
import { Divider, Flex, Stack, styled } from 'styled-system/jsx';
import ErrorSection from '@/components/ErrorSection';
import ShoppingCartItem from './ShoppingCartItem';
import { GetFormattedPrice } from '@/components/GetFormattedPrice';
import { useState } from 'react';

function ShoppingCartSection() {
  const { items, clearCart } = useCart();

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
            <SuspenseQuery {...productsQueryOptions}>
              {({ data: { products } }) => {
                const cartItems = items
                  .map(item => {
                    const product = products.find(p => p.id === item.productId);
                    return product ? { ...product, quantity: item.quantity } : null;
                  })
                  .filter((item): item is NonNullable<typeof item> => item !== null);

                return (
                  <Separated by={<Divider color="border.01_gray" />}>
                    {cartItems.map(item => (
                      <ShoppingCartItemRow key={item.id} product={item} />
                    ))}
                  </Separated>
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

function ShoppingCartItemRow({ product }: { product: Product }) {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  return (
    <ShoppingCartItem.Root key={product.id}>
      <ShoppingCartItem.Image src={product.images[0]} alt={product.name} />
      <ShoppingCartItem.Content>
        <ShoppingCartItem.Info
          type={lowerCase(product.category) as TagType}
          title={product.name}
          description={product.description}
          onDelete={() => removeItem({ productId: product.id, quantity })}
        />
        <ShoppingCartItem.Footer>
          <GetFormattedPrice price={product.price}>
            {price => <ShoppingCartItem.Price>{price}</ShoppingCartItem.Price>}
          </GetFormattedPrice>
          <Counter.Root>
            <Counter.Minus
              onClick={() => {
                removeItem({ productId: product.id, quantity: 1 });
              }}
              disabled={quantity === 0}
            />
            <Counter.Display value={quantity} />
            <Counter.Plus
              onClick={() => addItem({ productId: product.id, quantity: 1 })}
              disabled={quantity >= product.stock}
            />
          </Counter.Root>
        </ShoppingCartItem.Footer>
      </ShoppingCartItem.Content>
    </ShoppingCartItem.Root>
  );
}
