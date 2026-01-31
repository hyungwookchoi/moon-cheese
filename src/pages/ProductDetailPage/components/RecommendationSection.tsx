import { Spacing, Text } from '@/ui-lib';
import { useNavigate } from 'react-router';
import { HStack, styled } from 'styled-system/jsx';
import RecommendationProductItem from './RecommendationProductItem';
import type { Product } from '@/server/data';

interface Props {
  products: Product[];
}

function RecommendationSection({ products }: Props) {
  const navigate = useNavigate();

  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        {products.map(product => (
          <RecommendationProductItem.Root key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
            <RecommendationProductItem.Image src={product.images[0]} alt={product.name} />
            <RecommendationProductItem.Info name={product.name} rating={product.rating} />
            <RecommendationProductItem.Price>${product.price.toFixed(2)}</RecommendationProductItem.Price>
          </RecommendationProductItem.Root>
        ))}
      </HStack>
    </styled.section>
  );
}

export default RecommendationSection;
