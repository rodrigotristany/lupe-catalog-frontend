import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { createCategory, updateCategory } from '../../api/admin';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

export function CategoryForm({ category, onDone }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name_es: category?.name_es || '',
    name_en: category?.name_en || '',
  });

  const isEdit = !!category;

  const mutation = useMutation({
    mutationFn: (data) => isEdit ? updateCategory(category.id, data) : createCategory(data),
    onSuccess: (saved) => {
      queryClient.setQueryData(['categories'], (old = []) =>
        isEdit ? old.map((c) => (c.id === category.id ? saved : c)) : [...old, saved]
      );
      toast.success(t(isEdit ? 'admin.updated' : 'admin.created'));
      onDone?.();
    },
    onError: () => toast.error(t('common.error')),
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); mutation.mutate(form); }} className="space-y-4">
      <Input
        label={t('admin.name_es')}
        value={form.name_es}
        onChange={(e) => setForm({ ...form, name_es: e.target.value })}
        required
      />
      <Input
        label={t('admin.name_en')}
        value={form.name_en}
        onChange={(e) => setForm({ ...form, name_en: e.target.value })}
      />
      <div className="flex gap-3 justify-end">
        <Button type="button" variant="outline" onClick={onDone}>{t('common.cancel')}</Button>
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending ? t('common.loading') : t('common.save')}
        </Button>
      </div>
    </form>
  );
}
