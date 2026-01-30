import { EnhancedToastProvider } from '@/ui-lib/components/toast';
import { CurrencyProvider } from './CurrencyProvider';
import { TanStackQueryProvider } from './TanStackQueryProvider';

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <EnhancedToastProvider>
      <TanStackQueryProvider>
        <CurrencyProvider>{children}</CurrencyProvider>
      </TanStackQueryProvider>
    </EnhancedToastProvider>
  );
};

export default GlobalProvider;
