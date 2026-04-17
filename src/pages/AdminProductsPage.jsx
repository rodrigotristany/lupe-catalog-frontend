import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useCategories } from '../hooks/useCategories';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/catalog/SearchBar';
import { CategoryFilter } from '../components/catalog/CategoryFilter';
import { ProductTable } from '../components/admin/ProductTable';
import { Button } from '../components/ui/Button';
import { FullPageSpinner } from '../components/ui/Spinner';

export function AdminProductsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebounce(search, 300);

  function handleSearchChange(value) { setSearch(value); setPage(1); }
  function handleCategorySelect(value) { setSelectedCategory(value); setPage(1); }

  const filters = { page, per_page: 20 };
  if (debouncedSearch) filters.search = debouncedSearch;
  if (selectedCategory) filters.category = selectedCategory;

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [page]);

  const { data: products, isLoading } = useAdminProducts(filters);
  const { data: categories = [] } = useCategories();

  const list = Array.isArray(products) ? products : products?.items || [];
  const pagination = products && !Array.isArray(products)
    ? { page: products.page, pages: products.pages, total: products.total }
    : null;

  return (
    <>
      <Helmet>
        <title>{t('admin.products')} | LUPE Admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-colab text-2xl font-bold text-gray-800">{t('admin.products')}</h1>
        <Link to="/admin/products/new">
          <Button size="sm">
            <Plus size={16} />
            {t('admin.new_product')}
          </Button>
        </Link>
      </div>

      <div className="space-y-4 mb-6">
        <SearchBar value={search} onChange={handleSearchChange} />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />
      </div>

      {isLoading ? <FullPageSpinner /> : <ProductTable products={list} pagination={pagination} onPageChange={setPage} />}
    </>
  );
}
