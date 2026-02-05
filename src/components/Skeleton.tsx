import { Box, type BoxProps } from 'styled-system/jsx';

export function Skeleton(props: BoxProps) {
  return <Box bg="neutral.04_lightgray" animation="skeleton-pulse 1.5s ease-in-out infinite" rounded="md" {...props} />;
}
