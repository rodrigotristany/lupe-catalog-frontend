import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { Package, Tag } from 'lucide-react';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useCategories } from '../hooks/useCategories';

function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm flex items-center gap-4">
      <div className="w-12 h-12 rounded-xl bg-lupe-100 flex items-center justify-center">
        <Icon size={22} className="text-lupe-600" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value ?? '—'}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    </div>
  );
}

export function AdminDashboard() {
  const { t } = useTranslation();
  const { data: products } = useAdminProducts();
  const { data: categories } = useCategories();

  return (
    <>
      <Helmet>
        <title>{t('admin.dashboard')} | LUPE Admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1 className="font-display text-2xl font-bold text-gray-800 mb-8">{t('admin.dashboard')}</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-xl">
        <StatCard icon={Package} label={t('admin.total_products')} value={Array.isArray(products) ? products.length : products?.count} />
        <StatCard icon={Tag} label={t('admin.total_categories')} value={categories?.length} />
      </div>
    </>
  );
}
