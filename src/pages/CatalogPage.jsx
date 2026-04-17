import { useState, useEffect } from 'react';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useProducts } from '../hooks/useProducts';
import { useCategories } from '../hooks/useCategories';
import { useDebounce } from '../hooks/useDebounce';
import { SearchBar } from '../components/catalog/SearchBar';
import { CategoryFilter } from '../components/catalog/CategoryFilter';
import { ProductGrid } from '../components/catalog/ProductGrid';

export function CatalogPage() {
  const { t, i18n } = useTranslation();
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

  const { data, isLoading } = useProducts(filters);
  const products = data?.items ?? [];
  const pagination = data ? { page: data.page, pages: data.pages, total: data.total } : null;
  const { data: categories = [] } = useCategories();

  const title = i18n.language === 'es'
    ? 'LUPE — Objetos para llevar de belleza lo cotidiano'
    : 'LUPE — Objects to fill the everyday with beauty';

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
        <meta property="og:image" content="/og-image.jpg" />
      </Helmet>

      <div className="space-y-6">
        <h1 className="font-colab text-2xl font-bold text-center uppercase">{t('catalog.title')}</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={handleCategorySelect}
        />

        <ProductGrid
          products={products}
          isLoading={isLoading}
          pagination={pagination}
          onPageChange={setPage}
        />
      </div>
    </>
  );
}
