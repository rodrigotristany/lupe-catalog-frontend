import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Plus, ShoppingBag, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useSales } from '../hooks/useSales';
import { useCategories } from '../hooks/useCategories';
import { useSettings } from '../hooks/useSettings';
import { SalesTable } from '../components/admin/SalesTable';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Input';
import { EmptyState } from '../components/ui/EmptyState';
import { FullPageSpinner } from '../components/ui/Spinner';

export function AdminSalesPage() {
  const { t } = useTranslation();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [totalMin, setTotalMin] = useState('');
  const [totalMax, setTotalMax] = useState('');
  const [order, setOrder] = useState('desc');
  const [page, setPage] = useState(1);

  const activeFilters = { page, per_page: 20, order };
  if (paymentMethod) activeFilters.payment_method = paymentMethod;
  if (categoryId) activeFilters.category_id = Number(categoryId);
  if (dateFrom) activeFilters.date_from = `${dateFrom}T00:00:00`;
  if (dateTo) activeFilters.date_to = `${dateTo}T23:59:59`;
  if (totalMin !== '') activeFilters.total_min = Number(totalMin);
  if (totalMax !== '') activeFilters.total_max = Number(totalMax);

  useEffect(() => { window.scrollTo({ top: 0, behavior: 'instant' }); }, [page]);

  const { data, isLoading } = useSales(activeFilters);
  const { data: categories = [] } = useCategories();
  const { data: settings } = useSettings();

  const sales = data?.items ?? [];
  const pagination = data ? { page: data.page, pages: data.pages, total: data.total } : null;
  const paymentMethods = settings?.payment_methods ?? [];

  const activeFilterCount = [paymentMethod, categoryId, dateFrom, dateTo, totalMin, totalMax]
    .filter(Boolean).length;
  const hasActiveFilters = activeFilterCount > 0;

  function clearFilters() {
    setPaymentMethod('');
    setCategoryId('');
    setDateFrom('');
    setDateTo('');
    setTotalMin('');
    setTotalMax('');
    setPage(1);
  }

  function handleFilter(setter) {
    return (e) => { setter(e.target.value); setPage(1); };
  }

  const inputClass = 'w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-lupe-400 focus:border-transparent';

  const filterGrid = (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-3 sm:mt-0">
      <Select label={t('admin.payment_method')} value={paymentMethod} onChange={handleFilter(setPaymentMethod)}>
        <option value="">Todos</option>
        {paymentMethods.map(m => <option key={m} value={m}>{m}</option>)}
      </Select>

      <Select label={t('admin.category')} value={categoryId} onChange={handleFilter(setCategoryId)}>
        <option value="">{t('catalog.all_categories')}</option>
        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name_es}</option>)}
      </Select>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{t('admin.date_from')}</label>
        <input type="date" value={dateFrom} onChange={handleFilter(setDateFrom)} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{t('admin.date_to')}</label>
        <input type="date" value={dateTo} onChange={handleFilter(setDateTo)} className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{t('admin.total_min')}</label>
        <input type="number" min="0" step="0.01" value={totalMin} onChange={handleFilter(setTotalMin)} placeholder="0.00" className={inputClass} />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">{t('admin.total_max')}</label>
        <input type="number" min="0" step="0.01" value={totalMax} onChange={handleFilter(setTotalMax)} placeholder="0.00" className={inputClass} />
      </div>

      <Select label={t('admin.sort_by')} value={order} onChange={(e) => { setOrder(e.target.value); setPage(1); }}>
        <option value="desc">{t('admin.order_desc')}</option>
        <option value="asc">{t('admin.order_asc')}</option>
      </Select>

      <div className="flex items-end pb-0.5">
        {hasActiveFilters && (
          <button onClick={clearFilters} className="text-sm text-lupe-blue hover:underline">
            {t('admin.clear_filters')}
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>{t('admin.sales')} | LUPE Admin</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-colab text-2xl font-bold text-gray-800">{t('admin.sales')}</h1>
        <Link to="/admin/sales/new">
          <Button size="sm">
            <Plus size={16} />
            <span className="hidden sm:inline">{t('admin.new_sale')}</span>
            <span className="sm:hidden">Nueva</span>
          </Button>
        </Link>
      </div>

      {/* Filter panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        {/* Mobile toggle */}
        <button
          className="sm:hidden w-full flex items-center justify-between text-sm font-medium text-gray-700"
          onClick={() => setFiltersOpen(o => !o)}
        >
          <span>
            Filtros
            {activeFilterCount > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-lupe-blue text-white rounded-full text-xs">
                {activeFilterCount}
              </span>
            )}
          </span>
          <ChevronDown size={16} className={`transition-transform duration-200 ${filtersOpen ? 'rotate-180' : ''}`} />
        </button>

        {/* Filters: always visible on sm+, toggled on mobile */}
        <div className={`${filtersOpen ? 'block' : 'hidden'} sm:block`}>
          {filterGrid}
        </div>
      </div>

      {isLoading ? (
        <FullPageSpinner />
      ) : sales.length === 0 ? (
        hasActiveFilters ? (
          <p className="text-center text-gray-400 py-8 text-sm">{t('catalog.no_results')}</p>
        ) : (
          <EmptyState
            icon={ShoppingBag}
            title="Sin ventas registradas"
            description="Registrá la primera venta para verla aquí"
            action={
              <Link to="/admin/sales/new">
                <Button size="sm">
                  <Plus size={16} />
                  {t('admin.new_sale')}
                </Button>
              </Link>
            }
          />
        )
      ) : (
        <SalesTable sales={sales} pagination={pagination} onPageChange={setPage} />
      )}
    </>
  );
}
