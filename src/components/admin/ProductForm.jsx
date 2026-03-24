import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { createProduct, updateProduct } from '../../api/admin';
import { useCategories } from '../../hooks/useCategories';
import { Input, Textarea, Select } from '../ui/Input';
import { Button } from '../ui/Button';

export function ProductForm({ product }) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories = [] } = useCategories();

  const [form, setForm] = useState({
    name_es: product?.name_es || '',
    name_en: product?.name_en || '',
    description_es: product?.description_es || '',
    description_en: product?.description_en || '',
    price: product?.price || '',
    category_id: product?.category?.id ?? '',
    is_active: product?.is_active ?? true,
  });

  const isEdit = !!product;

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? updateProduct(product.id, data) : createProduct(data),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      toast.success(t(isEdit ? 'admin.updated' : 'admin.created'));
      if (!isEdit) navigate(`/admin/products/${saved.id}/edit`);
    },
    onError: () => toast.error(t('common.error')),
  });

  function set(key, value) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = {
      ...form,
      category_id: form.category_id !== '' ? parseInt(form.category_id, 10) : null,
    };
    mutation.mutate(payload);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('admin.name_es')}
          value={form.name_es}
          onChange={(e) => set('name_es', e.target.value)}
          required
        />
        <Input
          label={t('admin.name_en')}
          value={form.name_en}
          onChange={(e) => set('name_en', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Textarea
          label={t('admin.description_es')}
          value={form.description_es}
          onChange={(e) => set('description_es', e.target.value)}
        />
        <Textarea
          label={t('admin.description_en')}
          value={form.description_en}
          onChange={(e) => set('description_en', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={t('admin.price')}
          type="number"
          step="0.01"
          min="0"
          value={form.price}
          onChange={(e) => set('price', e.target.value)}
          required
        />
        <Select
          label={t('admin.category')}
          value={form.category_id}
          onChange={(e) => set('category_id', e.target.value)}
        >
          <option value="">—</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name_es}</option>
          ))}
        </Select>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={form.is_active}
          onChange={(e) => set('is_active', e.target.checked)}
          className="rounded border-gray-300 text-lupe-500 focus:ring-lupe-400"
        />
        <span className="text-sm font-medium text-gray-700">{t('admin.is_active')}</span>
      </label>

      <div className="flex gap-3">
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? t('common.loading') : t('common.save')}
        </Button>
        <Button type="button" variant="outline" onClick={() => navigate('/admin/products')}>
          {t('common.cancel')}
        </Button>
      </div>
    </form>
  );
}
