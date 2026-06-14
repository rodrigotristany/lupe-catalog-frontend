import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import { formatPrice } from '../../utils/formatPrice';

function formatDate(iso) {
  return new Date(iso).toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function SalesTable({ sales = [], pagination, onPageChange }) {
  const { t } = useTranslation();
  const [expandedId, setExpandedId] = useState(null);

  function toggleExpand(id) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="w-8 px-2 py-3" />
              <th className="text-left px-4 py-3 font-medium text-gray-600">Fecha</th>
              <th className="hidden sm:table-cell text-left px-4 py-3 font-medium text-gray-600">{t('admin.payment_method')}</th>
              <th className="hidden sm:table-cell text-left px-4 py-3 font-medium text-gray-600">{t('admin.products')}</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">{t('admin.sale_total')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {sales.map(sale => (
              <TableRow
                key={sale.id}
                sale={sale}
                expanded={expandedId === sale.id}
                onToggle={() => toggleExpand(sale.id)}
                t={t}
              />
            ))}
          </tbody>
        </table>
        {sales.length === 0 && (
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
    </>
  );
}

function TableRow({ sale, expanded, onToggle, t }) {
  const itemLabel = sale.items.length === 1
    ? t('admin.items_count_one')
    : t('admin.items_count_other', { count: sale.items.length });

  return (
    <>
      <tr onClick={onToggle} className="hover:bg-gray-50 cursor-pointer transition-colors">
        <td className="px-2 py-3 text-gray-400">
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </td>
        <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
          <div>{formatDate(sale.created_at)}</div>
          {/* Payment method visible below date on mobile */}
          <div className="sm:hidden text-xs text-gray-400 mt-0.5">{sale.payment_method}</div>
        </td>
        <td className="hidden sm:table-cell px-4 py-3 font-medium text-gray-800">{sale.payment_method}</td>
        <td className="hidden sm:table-cell px-4 py-3 text-gray-500">{itemLabel}</td>
        <td className="px-4 py-3 text-right text-lupe-blue font-semibold whitespace-nowrap">
          {formatPrice(sale.total)}
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="bg-gray-50 px-4 sm:px-8 pb-4">
            <table className="w-full text-xs mt-2">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 font-medium text-gray-500">Producto</th>
                  <th className="hidden sm:table-cell text-left py-2 font-medium text-gray-500">Categoría</th>
                  <th className="hidden sm:table-cell text-right py-2 font-medium text-gray-500">{t('admin.unit_price')}</th>
                  <th className="text-right py-2 font-medium text-gray-500">{t('admin.quantity')}</th>
                  <th className="text-right py-2 font-medium text-gray-500">{t('admin.subtotal')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {sale.items.map(item => (
                  <tr key={item.id}>
                    <td className="py-2 text-gray-700">{item.product_name_es}</td>
                    <td className="hidden sm:table-cell py-2 text-gray-500">{item.category_name_es ?? '—'}</td>
                    <td className="hidden sm:table-cell py-2 text-right text-gray-600">{formatPrice(item.price)}</td>
                    <td className="py-2 text-right text-gray-600">{item.quantity}</td>
                    <td className="py-2 text-right font-medium text-gray-800">{formatPrice(item.subtotal)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </td>
        </tr>
      )}
    </>
  );
}
