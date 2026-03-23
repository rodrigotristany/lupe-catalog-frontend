import { useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { deleteCategory } from '../../api/admin';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { CategoryForm } from './CategoryForm';

export function CategoryTable({ categories = [] }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [editTarget, setEditTarget] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast.success(t('admin.deleted'));
      setDeleteId(null);
    },
    onError: () => toast.error(t('common.error')),
  });

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('admin.name_es')}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('admin.name_en')}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">{cat.name_es}</td>
                <td className="px-4 py-3 text-gray-600">{cat.name_en || '—'}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="p-1.5" onClick={() => setEditTarget(cat)}>
                      <Pencil size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-1.5 text-red-500 hover:bg-red-50" onClick={() => setDeleteId(cat.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {categories.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">{t('catalog.no_results')}</p>
        )}
      </div>

      <Modal isOpen={!!editTarget} onClose={() => setEditTarget(null)} title={t('admin.edit_category')}>
        <CategoryForm category={editTarget} onDone={() => setEditTarget(null)} />
      </Modal>

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title={t('common.delete')}>
        <p className="text-gray-600 mb-6">{t('admin.confirm_delete')}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>{t('common.cancel')}</Button>
          <Button variant="danger" onClick={() => deleteMutation.mutate(deleteId)} disabled={deleteMutation.isPending}>
            {t('common.delete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
