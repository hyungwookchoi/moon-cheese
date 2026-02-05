import { Counter, SubGNB, Text } from '@/ui-lib';
import { useState } from 'react';
import { Link } from 'react-router';
import { Box, Grid, styled } from 'styled-system/jsx';
import ProductItem from '../components/ProductItem';
import { SuspenseQuery } from '@suspensive/react-query';
import { productsQueryOptions, type Product } from '@/apis/queryOptions';
import { useCart } from '@/stores/cart';
import { Skeleton } from '@/components/Skeleton';
import { GetFormattedPrice } from '@/components/GetFormattedPrice';
import type { Cheese, Cracker, Tea } from '@/apis/schema';
import { AsyncBoundary } from '@/components/AsyncBoundary';

type ProductCategory = 'ALL' | Product['category'];

function ProductListSection() {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('ALL');

  return (
    <styled.section bg="background.01_white">
      <AsyncBoundary fallback={<ProductListLoader />}>
        <SuspenseQuery
          {...productsQueryOptions}
          select={data => {
            return data.products.filter(product => isMatchCategory(product, selectedCategory));
          }}
        >
          {({ data: products }) => {
            return (
              <>
                <Box css={{ px: 5, pt: 5, pb: 4 }}>
                  <Text variant="H1_Bold">판매중인 상품</Text>
                </Box>
                <CategorySelector
                  value={selectedCategory}
                  onChange={setSelectedCategory}
                  options={[
                    { value: 'ALL', label: '전체' },
                    { value: 'CHEESE', label: '치즈' },
                    { value: 'CRACKER', label: '크래커' },
                    { value: 'TEA', label: '티' },
                  ]}
                />
                <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
                  {products.map(product => {
                    switch (product.category) {
                      case 'CHEESE':
                        return <CheeseProductItem product={product} />;
                      case 'CRACKER':
                        return <CrackerProductItem product={product} />;
                      case 'TEA':
                        return <TeaProductItem product={product} />;
                    }
                  })}
                </Grid>
              </>
            );
          }}
        </SuspenseQuery>
      </AsyncBoundary>
    </styled.section>
  );
}

function CheeseProductItem({ product }: { product: Cheese }) {
  return <ProductItemBase product={product} />;
}

function CrackerProductItem({ product }: { product: Cracker }) {
  return (
    <ProductItemBase
      product={product}
      metaAddon={product.isGlutenFree ? <ProductItem.FreeTag type="gluten" /> : null}
    />
  );
}

function TeaProductItem({ product }: { product: Tea }) {
  return (
    <ProductItemBase
      product={product}
      metaAddon={product.isCaffeineFree ? <ProductItem.FreeTag type="caffeine" /> : null}
    />
  );
}

function ProductItemBase({ product, metaAddon }: { product: Product; metaAddon?: React.ReactNode }) {
  return (
    <Link key={product.id} to={`/product/${product.id}`}>
      <ProductItem.Root>
        <ProductItem.Image src={product.images[0]} alt={product.name} />
        <ProductItem.Info title={product.name} description={product.description} />
        <ProductItem.Meta>
          <ProductItem.MetaLeft>
            <ProductItem.Rating rating={product.rating} />
            <GetFormattedPrice price={product.price}>
              {price => <ProductItem.Price>{price}</ProductItem.Price>}
            </GetFormattedPrice>
          </ProductItem.MetaLeft>
          {metaAddon}
        </ProductItem.Meta>
        <ProductItemCounter product={product} />
      </ProductItem.Root>
    </Link>
  );
}

function ProductItemCounter({ product }: { product: Product }) {
  const { addItem, removeItem, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product.id);

  return (
    <Counter.Root>
      <Counter.Minus onClick={() => removeItem({ productId: product.id, quantity: 1 })} disabled={quantity === 0} />
      <Counter.Display value={quantity} />
      <Counter.Plus
        onClick={() => addItem({ productId: product.id, quantity: 1 })}
        disabled={quantity >= product.stock}
      />
    </Counter.Root>
  );
}

function CategorySelector({
  value,
  onChange,
  options,
}: {
  value: ProductCategory;
  onChange: (value: ProductCategory) => void;
  options: Array<{ value: ProductCategory; label: string }>;
}) {
  return (
    <SubGNB.Root value={value} onValueChange={details => onChange(details.value as ProductCategory)}>
      <SubGNB.List>
        {options.map(option => (
          <SubGNB.Trigger key={option.value} value={option.value}>
            {option.label}
          </SubGNB.Trigger>
        ))}
      </SubGNB.List>
    </SubGNB.Root>
  );
}

function ProductListLoader() {
  return (
    <>
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Skeleton w="140px" h="28px" />
      </Box>
      <Box css={{ px: 5, pb: 4 }}>
        <styled.div display="flex" gap={4}>
          {['48px', '40px', '52px', '28px'].map((width, i) => (
            <Skeleton key={i} w={width} h="32px" rounded="full" />
          ))}
        </styled.div>
      </Box>
      <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Box key={i}>
            <Skeleton w="full" aspectRatio={1} rounded="2xl" />
            <Box mt={4}>
              <Skeleton w="80%" h="18px" mb={1} />
              <Skeleton w="60%" h="14px" />
            </Box>
            <Box mt={2} mb={3}>
              <Skeleton w="100px" h="16px" mb={2} />
              <Skeleton w="70px" h="20px" />
            </Box>
            <Skeleton w="full" h="40px" rounded="lg" />
          </Box>
        ))}
      </Grid>
    </>
  );
}

function isMatchCategory(product: Product, category: string) {
  return product.category === category;
}

export default ProductListSection;
