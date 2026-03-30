import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Plus } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCategories } from '../hooks/useCategories';
import { CategoryTable } from '../components/admin/CategoryTable';
import { CategoryForm } from '../components/admin/CategoryForm';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { FullPageSpinner } from '../components/ui/Spinner';

export function AdminCategoriesPage() {
  const { t } = useTranslation();
  const { data: categories = [], isLoading } = useCategories();
  const [creating, setCreating] = useState(false);

  return (
    <>
      <Helmet>
        <title>{t('admin.categories')} | LUPE Admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-colab text-2xl font-bold text-gray-800">{t('admin.categories')}</h1>
        <Button size="sm" onClick={() => setCreating(true)}>
          <Plus size={16} />
          {t('admin.new_category')}
        </Button>
      </div>

      {isLoading ? <FullPageSpinner /> : <CategoryTable categories={categories} />}

      <Modal isOpen={creating} onClose={() => setCreating(false)} title={t('admin.new_category')}>
        <CategoryForm onDone={() => setCreating(false)} />
      </Modal>
    </>
  );
}
