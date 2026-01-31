import { createBrowserRouter } from 'react-router';
import PageLayout from '@/layout/PageLayout';
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import invariant from 'tiny-invariant';

const router = createBrowserRouter([
  {
    path: '/',
    element: <PageLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        loader: ({ params }) => {
          invariant(params.id, 'productId is required');
          return { productId: Number(params.id) };
        },
        path: '/product/:id',
        element: <ProductDetailPage />,
      },
      {
        path: '/shopping-cart',
        element: <ShoppingCartPage />,
      },
    ],
  },
]);

export default router;
