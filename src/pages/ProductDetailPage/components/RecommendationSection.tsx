import { Spacing, Text } from '@/ui-lib';
import { Link } from 'react-router';
import { HStack, styled } from 'styled-system/jsx';
import RecommendationProductItem from './RecommendationProductItem';
import type { Product } from '@/server/data';
import { GetFormattedPrice } from '@/components/GetFormattedPrice';

interface Props {
  products: Product[];
}

function RecommendationSection({ products }: Props) {
  return (
    <styled.section css={{ bg: 'background.01_white', px: 5, pt: 5, pb: 6 }}>
      <Text variant="H2_Bold">추천 제품</Text>

      <Spacing size={4} />

      <HStack gap={1.5} overflowX="auto">
        {products.map(product => (
          <Link to={`/product/${product.id}`} key={product.id}>
            <RecommendationProductItem.Root>
              <RecommendationProductItem.Image src={product.images[0]} alt={product.name} />
              <RecommendationProductItem.Info name={product.name} rating={product.rating} />
              <GetFormattedPrice price={product.price}>
                {formattedPrice => <RecommendationProductItem.Price>{formattedPrice}</RecommendationProductItem.Price>}
              </GetFormattedPrice>
            </RecommendationProductItem.Root>
          </Link>
        ))}
      </HStack>
    </styled.section>
  );
}

export default RecommendationSection;
