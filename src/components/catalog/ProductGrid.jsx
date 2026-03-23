import { useTranslation } from 'react-i18next';
import { PackageSearch } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { FullPageSpinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';

export function ProductGrid({ products, isLoading }) {
  const { t } = useTranslation();

  if (isLoading) return <FullPageSpinner />;

  if (!products?.length) {
    return (
      <EmptyState
        icon={PackageSearch}
        title={t('catalog.no_results')}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
