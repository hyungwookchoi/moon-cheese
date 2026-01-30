import { Counter, SubGNB, Text } from '@/ui-lib';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Box, Grid, styled } from 'styled-system/jsx';
import ProductItem from '../components/ProductItem';
import { GetFormattedPrice } from './GetFormattedPrice';

const PRODUCT_LIST = [
  {
    id: 1,
    name: '월레스의 오리지널 웬슬리데일',
    price: 12.99,
    thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
    description: '월레스가 아침마다 찾는 바로 그 치즈!',
    rating: 4,
    stock: 3,
  },
  {
    id: 2,
    name: '로봇 크런치 비스킷',
    price: 5,
    thumbnail: '/moon-cheese-images/cracker-1-1.jpg',
    description: '로봇 캐릭터 모양의 귀리 비스킷',
    rating: 3,
    stock: 3,
  },
  {
    id: 3,
    name: '문라이트 카모마일 티',
    price: 7,
    thumbnail: '/moon-cheese-images/tea-1-1.jpg',
    description: '달빛 같은 부드러운 허브차',
    rating: 5,
    stock: 3,
  },
];

function ProductListSection() {
  const [currentTab, setCurrentTab] = useState('all');
  const navigate = useNavigate();

  const handleClickProduct = (productId: number) => {
    navigate(`/product/${productId}`);
  };

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
      <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
        {PRODUCT_LIST.map(product => (
          <ProductItem.Root key={product.id} onClick={() => handleClickProduct(product.id)}>
            <ProductItem.Image src={product.thumbnail} alt={product.name} />
            <ProductItem.Info title={product.name} description={product.description} />
            <ProductItem.Meta>
              <ProductItem.MetaLeft>
                <ProductItem.Rating rating={product.rating} />
                <GetFormattedPrice price={product.price}>
                  {price => <ProductItem.Price>{price}</ProductItem.Price>}
                </GetFormattedPrice>
              </ProductItem.MetaLeft>
            </ProductItem.Meta>
            <Counter.Root>
              <Counter.Minus onClick={() => {}} disabled={true} />
              <Counter.Display value={product.stock} />
              <Counter.Plus onClick={() => {}} />
            </Counter.Root>
          </ProductItem.Root>
        ))}
      </Grid>
    </styled.section>
  );
}

export default ProductListSection;
