import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import toast from 'react-hot-toast';
import { useCreateSale } from '../hooks/useSales';
import { useSettings } from '../hooks/useSettings';
import { ProductSearchInput } from '../components/admin/ProductSearchInput';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { formatPrice } from '../utils/formatPrice';

const spinnerless = '[appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none';
const numInput = `rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-lupe-400 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 ${spinnerless}`;

export function AdminSaleNewPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const nextKey = useRef(1);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [items, setItems] = useState([{ key: 0, product: null, quantity: 1, price: '' }]);

  const { data: settings } = useSettings();
  const paymentMethods = settings?.payment_methods ?? [];
  const mutation = useCreateSale();

  const selectedProductIds = items.filter(i => i.product).map(i => i.product.id);

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price);
    if (!item.product || isNaN(price)) return sum;
    return sum + price * item.quantity;
  }, 0);

  function addItem() {
    setItems(prev => [...prev, { key: nextKey.current++, product: null, quantity: 1, price: '' }]);
  }

  function removeItem(key) {
    setItems(prev => prev.filter(i => i.key !== key));
  }

  function setItemProduct(key, product) {
    setItems(prev => prev.map(i =>
      i.key === key ? { ...i, product, price: product ? String(product.price) : '' } : i
    ));
  }

  function setItemQuantity(key, value) {
    const parsed = parseInt(value, 10);
    if (!isNaN(parsed) && parsed >= 1) {
      setItems(prev => prev.map(i => i.key === key ? { ...i, quantity: parsed } : i));
    }
  }

  function adjustQuantity(key, delta) {
    setItems(prev => prev.map(i =>
      i.key === key ? { ...i, quantity: Math.max(1, i.quantity + delta) } : i
    ));
  }

  function setItemPrice(key, value) {
    setItems(prev => prev.map(i => i.key === key ? { ...i, price: value } : i));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!paymentMethod) { toast.error(t('admin.select_payment_method')); return; }
    if (items.some(i => !i.product)) { toast.error('Completá todos los productos antes de guardar'); return; }
    mutation.mutate(
      {
        payment_method: paymentMethod,
        items: items.map(i => ({ product_id: i.product.id, quantity: i.quantity })),
      },
      {
        onSuccess: () => { toast.success(t('admin.created')); navigate('/admin/sales'); },
        onError: (error) => {
          const status = error?.response?.status;
          const detail = (error?.response?.data?.detail ?? '').toLowerCase();
          if (status === 400 && detail.includes('payment')) toast.error(t('admin.sale_invalid_payment_method'));
          else if (status === 404) toast.error(t('admin.sale_product_not_found'));
          else toast.error(t('common.error'));
        },
      }
    );
  }

  return (
    <>
      <Helmet>
        <title>{t('admin.new_sale')} | LUPE Admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex items-center gap-3 mb-6">
        <Link to="/admin/sales" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <h1 className="font-colab text-2xl font-bold text-gray-800">{t('admin.new_sale')}</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl space-y-6">
        <Select
          label={`${t('admin.payment_method')} *`}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        >
          <option value="">{t('admin.select_payment_method')}</option>
          {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
        </Select>

        {/* ── Items section ─────────────────────────────────── */}
        <div>
          <label className="text-sm font-medium text-gray-700 block mb-3">{t('admin.products')}</label>

          {/* Mobile card view (< sm) */}
          <div className="sm:hidden space-y-3">
            {items.map(item => {
              const price = parseFloat(item.price);
              const subtotal = item.product && !isNaN(price) ? price * item.quantity : null;
              const excludeIds = selectedProductIds.filter(id => id !== item.product?.id);
              return (
                <div key={item.key} className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
                  <div className="flex gap-2">
                    <div className="flex-1 min-w-0">
                      <ProductSearchInput
                        value={item.product}
                        onSelect={(product) => setItemProduct(item.key, product)}
                        excludeIds={excludeIds}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.key)}
                      disabled={items.length === 1}
                      className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500">{t('admin.unit_price')}</label>
                      <input
                        type="number" min="0" step="0.01"
                        value={item.price}
                        onChange={(e) => setItemPrice(item.key, e.target.value)}
                        disabled={!item.product}
                        placeholder="0.00"
                        className={`w-full text-right ${numInput}`}
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs text-gray-500">{t('admin.quantity')}</label>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => adjustQuantity(item.key, -1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-base leading-none transition-colors flex-shrink-0">
                          −
                        </button>
                        <input
                          type="number" min="1"
                          value={item.quantity}
                          onChange={(e) => setItemQuantity(item.key, e.target.value)}
                          className={`w-12 text-center ${numInput}`}
                        />
                        <button type="button" onClick={() => adjustQuantity(item.key, 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-base leading-none transition-colors flex-shrink-0">
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {subtotal !== null && (
                    <div className="text-right text-sm border-t border-gray-100 pt-2">
                      <span className="text-gray-500">{t('admin.subtotal')}: </span>
                      <span className="font-semibold text-gray-800">{formatPrice(subtotal)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Desktop table view (≥ sm) */}
          <div className="hidden sm:block rounded-xl border border-gray-200 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600 min-w-[200px]">Producto</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 w-32">{t('admin.unit_price')}</th>
                  <th className="text-center px-4 py-3 font-medium text-gray-600 w-36">{t('admin.quantity')}</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-600 w-28">{t('admin.subtotal')}</th>
                  <th className="w-10" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {items.map(item => {
                  const price = parseFloat(item.price);
                  const subtotal = item.product && !isNaN(price) ? price * item.quantity : null;
                  const excludeIds = selectedProductIds.filter(id => id !== item.product?.id);
                  return (
                    <tr key={item.key}>
                      <td className="px-4 py-3">
                        <ProductSearchInput
                          value={item.product}
                          onSelect={(product) => setItemProduct(item.key, product)}
                          excludeIds={excludeIds}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number" min="0" step="0.01"
                          value={item.price}
                          onChange={(e) => setItemPrice(item.key, e.target.value)}
                          disabled={!item.product}
                          placeholder="0.00"
                          className={`w-full text-right ${numInput}`}
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-2">
                          <button type="button" onClick={() => adjustQuantity(item.key, -1)}
                            className="hidden sm:flex w-7 h-7 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-base leading-none transition-colors flex-shrink-0">
                            −
                          </button>
                          <input
                            type="number" min="1"
                            value={item.quantity}
                            onChange={(e) => setItemQuantity(item.key, e.target.value)}
                            className={`w-12 text-center ${numInput}`}
                          />
                          <button type="button" onClick={() => adjustQuantity(item.key, 1)}
                            className="hidden sm:flex w-7 h-7 items-center justify-center rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 text-base leading-none transition-colors flex-shrink-0">
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-gray-800 whitespace-nowrap">
                        {subtotal !== null ? formatPrice(subtotal) : '—'}
                      </td>
                      <td className="px-2 py-3 text-center">
                        <button
                          type="button"
                          onClick={() => removeItem(item.key)}
                          disabled={items.length === 1}
                          className="p-1 rounded text-gray-400 hover:text-red-500 hover:bg-red-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-3 flex items-center gap-1.5 text-sm text-lupe-blue hover:underline"
          >
            <Plus size={14} />
            {t('admin.add_product')}
          </button>
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-4">
          <div className="text-right">
            <span className="text-sm text-gray-600">{t('admin.sale_total')}: </span>
            <span className="text-xl font-bold text-lupe-blue">{formatPrice(total)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Link to="/admin/sales">
            <Button type="button" variant="outline">{t('common.cancel')}</Button>
          </Link>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? t('common.loading') : t('admin.register_sale')}
          </Button>
        </div>
      </form>
    </>
  );
}
