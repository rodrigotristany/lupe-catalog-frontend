import { Link } from 'react-router-dom';
import { Pencil, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { deleteProduct } from '../../api/admin';
import { localizedField } from '../../utils/i18nField';
import { formatPrice } from '../../utils/formatPrice';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useState } from 'react';

export function ProductTable({ products = [], pagination, onPageChange }) {
  const { t, i18n } = useTranslation();
  const queryClient = useQueryClient();
  const [deleteId, setDeleteId] = useState(null);

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
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
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('admin.price')}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('admin.category')}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('admin.is_active')}</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">{t('admin.actions')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-800">
                  {localizedField(product, 'name', i18n.language)}
                </td>
                <td className="px-4 py-3 text-lupe-blue font-semibold">
                  {formatPrice(product.price)}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {product.category ? localizedField(product.category, 'name', i18n.language) : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                    {product.is_active ? t('common.yes') : t('common.no')}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link to={`/admin/products/${product.id}/edit`}>
                      <Button variant="ghost" size="sm" className="p-1.5">
                        <Pencil size={14} />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1.5 text-red-500 hover:bg-red-50"
                      onClick={() => setDeleteId(product.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {products.length === 0 && (
          <p className="text-center text-gray-400 py-8 text-sm">{t('catalog.no_results')}</p>
        )}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={() => onPageChange(pagination.page - 1)}
            disabled={pagination.page <= 1}
            className="p-2 rounded-lg border border-gray-200 text-lupe-700 hover:bg-lupe-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm text-gray-600">
            {pagination.page} / {pagination.pages}
          </span>
          <button
            onClick={() => onPageChange(pagination.page + 1)}
            disabled={pagination.page >= pagination.pages}
            className="p-2 rounded-lg border border-gray-200 text-lupe-700 hover:bg-lupe-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title={t('common.delete')}
      >
        <p className="text-gray-600 mb-6">{t('admin.confirm_delete')}</p>
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={() => setDeleteId(null)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(deleteId)}
            disabled={deleteMutation.isPending}
          >
            {t('common.delete')}
          </Button>
        </div>
      </Modal>
    </>
  );
}
