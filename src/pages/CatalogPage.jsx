import { useState } from 'react';
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
  const debouncedSearch = useDebounce(search, 300);

  const filters = {};
  if (debouncedSearch) filters.search = debouncedSearch;
  if (selectedCategory) filters.category = selectedCategory;

  const { data: products, isLoading } = useProducts(filters);
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
        <h1 className="font-display text-3xl font-bold text-lupe-800">{t('catalog.title')}</h1>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchBar value={search} onChange={setSearch} />
          </div>
        </div>

        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <ProductGrid products={products} isLoading={isLoading} />
      </div>
    </>
  );
}
