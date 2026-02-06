import { useState } from 'react';
import { HStack, styled } from 'styled-system/jsx';

type ProductImagesSectionProps = {
  images: string[];
};

function ProductImagesSection({ images }: ProductImagesSectionProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  return (
    <styled.section css={{ bg: 'background.01_white' }}>
      <SelectedImage src={images[selectedImageIndex]} alt={'product-main-image'} />

      <HStack gap={2} css={{ overflowX: 'auto', justifyContent: 'center', pt: 2 }}>
        {images.map((image, index) => (
          <ProductImage
            key={`thumbnail-${index}`}
            src={image}
            alt={`product-image-${index + 1}`}
            onClick={() => setSelectedImageIndex(index)}
            isSelected={selectedImageIndex === index}
          />
        ))}
      </HStack>
    </styled.section>
  );
}

function SelectedImage({ src, alt }: { src: string; alt: string }) {
  return (
    <styled.img
      src={src}
      alt={alt}
      css={{
        w: 'full',
        aspectRatio: 1,
        objectFit: 'cover',
        bg: 'background.01_gray',
      }}
    />
  );
}

function ProductImage({
  src,
  alt,
  onClick,
  isSelected,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  isSelected: boolean;
}) {
  return (
    <styled.img
      src={src}
      alt={alt}
      onClick={onClick}
      role="button"
      css={{
        w: 12,
        h: 12,
        objectFit: 'cover',
        cursor: 'pointer',
        outline: isSelected ? '1px solid' : 'none',
        outlineColor: 'primary.01_primary',
        outlineOffset: isSelected ? '-1px' : 0,
        rounded: 'md',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    />
  );
}

export default ProductImagesSection;
