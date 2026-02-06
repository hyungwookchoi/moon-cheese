import type { Product } from '@/apis/schema';
import { GetFormattedPrice } from '@/components/GetFormattedPrice';
import { useCart } from '@/stores/cart';
import { Button, Counter, RatingGroup, Spacing, Text } from '@/ui-lib';
import Tag, { type TagType } from '@/ui-lib/components/tag';
import { Box, Divider, Flex, Stack, styled } from 'styled-system/jsx';
import { FormProvider, useForm, useFormContext } from 'react-hook-form';

const TAG_TYPE: Record<Product['category'], TagType> = {
  CHEESE: 'cheese',
  CRACKER: 'cracker',
  TEA: 'tea',
} as const;

type ProductInfoSectionProps = {
  product: Product;
};

function ProductInfoSection({ product }: ProductInfoSectionProps) {
  const form = useForm<{ quantity: number }>({
    defaultValues: {
      quantity: 0,
    },
  });

  return (
    <FormProvider {...form}>
      <styled.section css={{ bg: 'background.01_white', p: 5 }}>
        <Box>
          <Stack gap={2}>
            <Tag type={TAG_TYPE[product.category]} />
            <Text variant="B1_Bold">{product.name}</Text>
            <RatingGroup value={product.rating} readOnly label={`${product.rating.toFixed(1)}`} />
          </Stack>
          <Spacing size={4} />
          <GetFormattedPrice price={product.price}>
            {formattedPrice => <Text variant="H1_Bold">{formattedPrice}</Text>}
          </GetFormattedPrice>
        </Box>

        <Spacing size={5} />

        <Flex justify="space-between" alignItems="center">
          <Flex alignItems="center" gap={2}>
            <Text variant="C1_Medium">재고</Text>
            <Divider orientation="vertical" color="border.01_gray" h={4} />
            <Text variant="C1_Medium" color="secondary.02_orange">
              {product.stock}EA
            </Text>
          </Flex>
          <ProductCounter product={product} />
        </Flex>

        <Spacing size={5} />

        <AddToCartButton product={product} />
      </styled.section>
    </FormProvider>
  );
}

function ProductCounter({ product }: { product: Product }) {
  const { getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);
  const isInCart = quantityInCart > 0;

  const form = useFormContext();
  const quantity = form.watch('quantity');

  return (
    <Counter.Root>
      <Counter.Minus
        onClick={() => form.setValue('quantity', Math.max(quantity - 1, 0))}
        disabled={isInCart || quantity <= 0}
      />
      <Counter.Display value={quantity} />
      <Counter.Plus
        onClick={() => form.setValue('quantity', Math.min(quantity + 1, product.stock))}
        disabled={isInCart || quantity >= product.stock}
      />
    </Counter.Root>
  );
}

function AddToCartButton({ product }: { product: Product }) {
  const { getItemQuantity, addItem, removeItem } = useCart();
  const quantityInCart = getItemQuantity(product.id);
  const isInCart = quantityInCart > 0;

  const form = useFormContext();
  const quantity = form.watch('quantity');

  return (
    <Button
      fullWidth
      color="primary"
      size="lg"
      onClick={() => {
        if (isInCart) {
          removeItem({ productId: product.id, quantity: quantityInCart });
        } else {
          addItem({ productId: product.id, quantity: quantity });
        }
      }}
    >
      {isInCart ? '장바구니에서 제거' : '장바구니 담기'}
    </Button>
  );
}

export default ProductInfoSection;
