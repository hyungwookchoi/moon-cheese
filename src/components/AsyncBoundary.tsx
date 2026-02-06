import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorSection from './ErrorSection';
import { Skeleton } from './Skeleton';

export function AsyncBoundary({
  loadingFallback = <Skeleton />,
  rejectedFallback = <ErrorSection />,
  children,
}: {
  loadingFallback?: React.ReactNode;
  rejectedFallback?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary fallback={rejectedFallback}>
      <Suspense fallback={loadingFallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
