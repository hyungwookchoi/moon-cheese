import { Counter, SubGNB, Text } from '@/ui-lib';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Grid, styled } from 'styled-system/jsx';
import ProductItem from '../components/ProductItem';
import { GetFormattedPrice } from './GetFormattedPrice';
import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorSection from '@/components/ErrorSection';
import { SuspenseQuery } from '@suspensive/react-query';
import { productsQueryOptions } from '../apis/queryOptions';
import { useCart } from '@/providers/CartProvider';

function ProductListSection() {
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();
  const { addItem, removeItem, getItemQuantity } = useCart();

  return (
    <styled.section bg="background.01_white">
      <Box css={{ px: 5, pt: 5, pb: 4 }}>
        <Text variant="H1_Bold">판매중인 상품</Text>
      </Box>
      <SubGNB.Root value={currentTab} onValueChange={details => setCurrentTab(details.value)}>
        <SubGNB.List>
          <SubGNB.Trigger value="all">전체</SubGNB.Trigger>
          <SubGNB.Trigger value="cheese">치즈</SubGNB.Trigger>
          <SubGNB.Trigger value="cracker">크래커</SubGNB.Trigger>
          <SubGNB.Trigger value="tea">티</SubGNB.Trigger>
        </SubGNB.List>
      </SubGNB.Root>
      <ErrorBoundary fallback={<ErrorSection />}>
        <Suspense>
          <SuspenseQuery {...productsQueryOptions}>
            {({ data: { products } }) => {
              return (
                <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
                  {products.map(product => {
                    const quantity = getItemQuantity(product.id);

                    return (
                      <ProductItem.Root key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                        <ProductItem.Image src={product.images[0]} alt={product.name} />
                        <ProductItem.Info title={product.name} description={product.description} />
                        <ProductItem.Meta>
                          <ProductItem.MetaLeft>
                            <ProductItem.Rating rating={product.rating} />
                            <GetFormattedPrice price={product.price}>
                              {price => <ProductItem.Price>{price}</ProductItem.Price>}
                            </GetFormattedPrice>
                          </ProductItem.MetaLeft>
                          {(() => {
                            switch (product.category) {
                              case 'CRACKER':
                                return product.isGlutenFree ? <ProductItem.FreeTag type="gluten" /> : null;
                              case 'TEA':
                                return product.isCaffeineFree ? <ProductItem.FreeTag type="caffeine" /> : null;
                              default:
                                return null;
                            }
                          })()}
                        </ProductItem.Meta>
                        <Counter.Root>
                          <Counter.Minus onClick={() => removeItem(product.id)} disabled={quantity === 0} />
                          <Counter.Display value={quantity} />
                          <Counter.Plus onClick={() => addItem(product.id)} disabled={quantity >= product.stock} />
                        </Counter.Root>
                      </ProductItem.Root>
                    );
                  })}
                </Grid>
              );
            }}
          </SuspenseQuery>
        </Suspense>
      </ErrorBoundary>
    </styled.section>
  );
}

export default ProductListSection;
