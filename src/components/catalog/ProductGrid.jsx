import { useTranslation } from 'react-i18next';
import { ChevronLeft, ChevronRight, PackageSearch } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { FullPageSpinner } from '../ui/Spinner';
import { EmptyState } from '../ui/EmptyState';

export function ProductGrid({ products, isLoading, pagination, onPageChange }) {
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
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2 rounded-lg border border-lupe-200 text-lupe-700 hover:bg-lupe-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={t('catalog.prev_page', 'Previous page')}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <span className="text-sm text-lupe-600">
            {t('catalog.page_of', { page: pagination.page, pages: pagination.pages }, `${pagination.page} / ${pagination.pages}`)}
          </span>

          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="p-2 rounded-lg border border-lupe-200 text-lupe-700 hover:bg-lupe-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            aria-label={t('catalog.next_page', 'Next page')}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}
