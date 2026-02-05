import { ErrorBoundary, Suspense } from '@suspensive/react';
import ErrorSection from './ErrorSection';

export function AsyncBoundary({ fallback, children }: { fallback: React.ReactNode; children: React.ReactNode }) {
  return (
    <ErrorBoundary fallback={<ErrorSection />}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}
