import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { ProductTable } from '../components/admin/ProductTable';
import { Button } from '../components/ui/Button';
import { FullPageSpinner } from '../components/ui/Spinner';

export function AdminProductsPage() {
  const { t } = useTranslation();
  const { data: products, isLoading } = useAdminProducts();

  const list = Array.isArray(products) ? products : products?.items || [];

  return (
    <>
      <Helmet>
        <title>{t('admin.products')} | LUPE Admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-800">{t('admin.products')}</h1>
        <Link to="/admin/products/new">
          <Button size="sm">
            <Plus size={16} />
            {t('admin.new_product')}
          </Button>
        </Link>
      </div>

      {isLoading ? <FullPageSpinner /> : <ProductTable products={list} />}
    </>
  );
}
